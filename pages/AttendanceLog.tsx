import React, { useEffect, useState } from 'react';
import { getAttendance } from '../services/storage';
import { AttendanceRecord } from '../types';

const AttendanceLog = () => {
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    setLogs(getAttendance());
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-dark mb-8">Attendance History</h1>
      
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">Time</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Type</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-4 font-medium">{log.memberName}</td>
                <td className="p-4 text-sm">{log.type}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    log.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 
                    log.status === 'STAFF_IN' ? 'bg-blue-100 text-blue-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-400">{log.note || '-'}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No history available</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceLog;