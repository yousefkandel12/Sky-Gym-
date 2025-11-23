import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, QrCode, ShieldCheck, ClipboardList } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const linkClass = (path: string) => `
    flex items-center p-3 rounded-xl transition-all duration-200 mb-2
    ${isActive(path) 
      ? 'bg-primary text-secondary font-bold shadow-lg' 
      : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
  `;

  return (
    <div className="w-64 bg-dark h-screen fixed left-0 top-0 flex flex-col p-6 shadow-2xl z-50 hidden md:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-lg">
          I
        </div>
        <h1 className="text-white text-xl font-bold tracking-wider">IRON<span className="text-primary">PULSE</span></h1>
      </div>

      <nav className="flex-1">
        <Link to="/" className={linkClass('/')}>
          <LayoutDashboard size={20} className="mr-3" />
          Dashboard
        </Link>
        <Link to="/members" className={linkClass('/members')}>
          <Users size={20} className="mr-3" />
          Members
        </Link>
        <Link to="/scanner" className={linkClass('/scanner')}>
          <QrCode size={20} className="mr-3" />
          QR Scanner
        </Link>
        <Link to="/staff" className={linkClass('/staff')}>
          <ShieldCheck size={20} className="mr-3" />
          Staff
        </Link>
        <Link to="/attendance" className={linkClass('/attendance')}>
          <ClipboardList size={20} className="mr-3" />
          History
        </Link>
      </nav>

      <div className="mt-auto">
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <p className="text-xs text-gray-400 mb-1">Admin Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-white text-sm font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;