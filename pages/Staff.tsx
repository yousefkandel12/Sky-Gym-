import React, { useState, useEffect } from 'react';
import { getStaff, addStaff } from '../services/storage';
import { Staff } from '../types';
import QRGenerator from '../components/QRGenerator';
import { UserPlus, Shield } from 'lucide-react';

const StaffPage = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Trainer');

  useEffect(() => {
    setStaffList(getStaff());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newStaffName) return;
    addStaff(newStaffName, newStaffRole);
    setStaffList(getStaff());
    setNewStaffName('');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-dark mb-8">Staff Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UserPlus size={20} className="text-primary"/> Add Staff
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input className="w-full border rounded-lg p-2" value={newStaffName} onChange={e => setNewStaffName(e.target.value)} />
            </div>
            <div>
               <label className="block text-sm text-gray-600 mb-1">Role</label>
               <select className="w-full border rounded-lg p-2" value={newStaffRole} onChange={e => setNewStaffRole(e.target.value)}>
                 <option>Trainer</option>
                 <option>Receptionist</option>
                 <option>Cleaner</option>
                 <option>Manager</option>
               </select>
            </div>
            <button className="w-full bg-dark text-white py-2 rounded-lg font-bold hover:bg-black">Generate Badge</button>
          </form>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {staffList.map(staff => (
            <div key={staff.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 border border-gray-100">
              <div className="bg-gray-100 p-2 rounded-xl">
                <QRGenerator value={staff.qrCodeData} size={80} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-primary"/>
                  <h3 className="font-bold text-lg">{staff.name}</h3>
                </div>
                <p className="text-gray-500 text-sm">{staff.role}</p>
                <p className="text-xs text-gray-300 mt-2">{staff.id.slice(0,8)}</p>
              </div>
            </div>
          ))}
          {staffList.length === 0 && <p className="text-gray-400 p-4">No staff added yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default StaffPage;