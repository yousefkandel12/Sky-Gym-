import React, { useState, useEffect } from 'react';
import { getMembers, addMember } from '../services/storage';
import { sendWelcomeMessage } from '../services/whatsapp';
import { Member, PlanType } from '../types';
import { Plus, Smartphone, Search, X } from 'lucide-react';
import QRGenerator from '../components/QRGenerator';

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState<Member | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    planType: PlanType.TIME_BASED,
    durationMonths: 1,
    sessions: 10,
    amount: 0
  });

  useEffect(() => {
    refreshMembers();
  }, []);

  const refreshMembers = () => setMembers(getMembers());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let endDate;
    if (formData.planType === PlanType.TIME_BASED) {
      const date = new Date();
      date.setMonth(date.getMonth() + Number(formData.durationMonths));
      endDate = date.toISOString();
    }

    const newMember = addMember({
      name: formData.name,
      phone: formData.phone,
      startDate: new Date().toISOString(),
      endDate,
      totalSessions: formData.planType === PlanType.SESSIONS ? Number(formData.sessions) : undefined,
      planType: formData.planType,
      amountPaid: Number(formData.amount)
    });

    // WhatsApp Integration
    await sendWelcomeMessage(newMember);
    
    refreshMembers();
    setShowModal(false);
    alert(`Member added & WhatsApp Sent to ${formData.phone}`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark">Members</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary hover:bg-yellow-500 text-dark px-6 py-3 rounded-xl font-bold shadow-lg transition-transform transform hover:scale-105"
        >
          <Plus size={20} />
          Add New Member
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Plan</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Remaining</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-dark">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.phone}</p>
                  </td>
                  <td className="p-4 text-sm">{m.planType === PlanType.TIME_BASED ? 'Time Based' : 'Session Pack'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${m.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {m.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    {m.planType === PlanType.SESSIONS 
                      ? `${m.remainingSessions} Sessions` 
                      : `Ends: ${new Date(m.endDate!).toLocaleDateString()}`}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => setShowQRModal(m)}
                      className="text-primary hover:text-yellow-600 bg-dark p-2 rounded-lg"
                    >
                      <Smartphone size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                 <tr><td colSpan={5} className="p-8 text-center text-gray-400">No members found. Add one to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">New Subscription</h2>
              <button onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (WhatsApp)</label>
                <input required type="tel" className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
                   value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type</label>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <button type="button" 
                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-colors ${formData.planType === PlanType.TIME_BASED ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                    onClick={() => setFormData({...formData, planType: PlanType.TIME_BASED})}
                  >Time Based</button>
                  <button type="button" 
                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-colors ${formData.planType === PlanType.SESSIONS ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                    onClick={() => setFormData({...formData, planType: PlanType.SESSIONS})}
                  >Sessions</button>
                </div>
              </div>

              {formData.planType === PlanType.TIME_BASED ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Months)</label>
                  <input type="number" min="1" className="w-full p-3 rounded-lg border border-gray-300"
                     value={formData.durationMonths} onChange={e => setFormData({...formData, durationMonths: Number(e.target.value)})} />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Sessions</label>
                  <input type="number" min="1" className="w-full p-3 rounded-lg border border-gray-300"
                    value={formData.sessions} onChange={e => setFormData({...formData, sessions: Number(e.target.value)})} />
                </div>
              )}

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid ($)</label>
                  <input type="number" required min="0" className="w-full p-3 rounded-lg border border-gray-300"
                    value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
              </div>

              <button type="submit" className="w-full bg-primary text-dark font-bold py-3 rounded-xl hover:bg-yellow-500 transition-colors">
                Create & Send WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowQRModal(null)}>
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
             <h3 className="text-xl font-bold">{showQRModal.name}</h3>
             <div className="border-4 border-primary p-2 rounded-xl">
               <QRGenerator value={showQRModal.qrCodeData} size={200} />
             </div>
             <p className="text-sm text-gray-500">Scan this code at the entrance</p>
             <button onClick={() => setShowQRModal(null)} className="text-red-500 font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;