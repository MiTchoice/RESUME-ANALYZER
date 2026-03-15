import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import {
  LayoutDashboard, Upload, Briefcase, MessageSquare,
  Mic, ChevronLeft, ChevronRight, Zap, LogOut
} from 'lucide-react';

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload',    icon: Upload,          label: 'Upload Resume' },
  { to: '/job-match', icon: Briefcase,       label: 'Job Match' },
  { to: '/interview', icon: MessageSquare,   label: 'Interview Prep' },
  { to: '/mock',      icon: Mic,             label: 'Mock Interview' }
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const { uploadedFileName, reset } = useResume();
  const navigate = useNavigate();

  const handleReset = () => { reset(); navigate('/'); };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Sidebar */}
      <aside className={`flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          {!collapsed && <span className="text-white font-bold text-lg tracking-tight">ResumeAI</span>}
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                 ${isActive
                  ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'}`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* File indicator */}
        {!collapsed && uploadedFileName && (
          <div className="mx-3 mb-3 p-3 bg-accent-500/10 border border-accent-500/20 rounded-xl">
            <p className="text-xs text-accent-400 font-semibold mb-0.5">Active Resume</p>
            <p className="text-xs text-gray-300 truncate">{uploadedFileName}</p>
          </div>
        )}

        {/* Bottom actions */}
        <div className="border-t border-gray-800 p-2 space-y-1">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-100 hover:bg-gray-800 w-full transition-all"
          >
            {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-all"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Reset / New</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
