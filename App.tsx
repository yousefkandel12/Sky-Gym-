import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Scanner from './pages/Scanner';
import StaffPage from './pages/Staff';
import AttendanceLog from './pages/AttendanceLog';

const Layout = () => (
  <div className="flex min-h-screen font-sans text-dark bg-gray-50">
    <Sidebar />
    <div className="flex-1 md:ml-64">
      <Outlet />
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="attendance" element={<AttendanceLog />} />
        </Route>
        <Route path="/scanner" element={<Scanner />} />
      </Routes>
    </Router>
  );
};

export default App;