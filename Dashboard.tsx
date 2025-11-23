import React, { useEffect, useState } from 'react';
import { getMembers, getAttendance } from '../services/storage';
import { generateBusinessInsights } from '../services/geminiService';
import { Member, AttendanceRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, Users, DollarSign, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [insights, setInsights] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    setMembers(getMembers());
    setAttendance(getAttendance());
  }, []);

  const stats = {
    active: members.filter(m => m.active).length,
    today: attendance.filter(a => {
      const today = new Date().toISOString().split('T')[0];
      return a.timestamp.startsWith(today) && a.status === 'SUCCESS';
    }).length,
    revenue: members.reduce((acc, m) => acc + m.amountPaid, 0),
    expired: members.filter(m => !m.active).length // Simplified expired logic
  };

  const handleGenerateInsights = async () => {
    setLoadingAi(true);
    const result = await generateBusinessInsights(members, attendance);
    setInsights(result);
    setLoadingAi(false);
  };

  // Chart Data Preparation
  const checkInChartData = attendance.slice(0, 20).map((a, i) => ({
    name: `Log ${i}`,
    value: 1
  }));

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark">Admin Dashboard</h1>
        <button 
          onClick={handleGenerateInsights}
          disabled={loadingAi}
          className="flex items-center gap-2 bg-primary hover:bg-yellow-500 text-dark px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          <Sparkles size={18} />
          {loadingAi ? 'Consulting Gemini...' : 'Ask AI Coach'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Members</p>
            <h3 className="text-2xl font-bold text-dark">{stats.active}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Today's Check-ins</p>
            <h3 className="text-2xl font-bold text-dark">{stats.today}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <h3 className="text-2xl font-bold text-dark">${stats.revenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Inactive / Expired</p>
            <h3 className="text-2xl font-bold text-dark">{stats.expired}</h3>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      {insights && (
        <div className="bg-gradient-to-r from-dark to-gray-800 p-6 rounded-2xl shadow-lg mb-8 text-white border-l-4 border-primary relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <Sparkles size={100} />
           </div>
           <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
             <Sparkles className="text-primary" size={20}/> Gemini Analysis
           </h3>
           <div className="prose prose-invert max-w-none text-gray-200 whitespace-pre-line">
             {insights}
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-dark mb-4">Recent Activity Flow</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={checkInChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#FACC15" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Check-ins Table */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-lg font-bold text-dark mb-4">Live Feed</h3>
          <div className="space-y-4">
            {attendance.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-10 rounded-full ${log.status === 'SUCCESS' || log.status === 'STAFF_IN' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <p className="font-semibold text-sm text-dark">{log.memberName}</p>
                    <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  log.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 
                  log.status === 'DENIED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
            {attendance.length === 0 && <p className="text-gray-400 text-center">No check-ins yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;