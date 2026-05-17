import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import config from '../config/config';
import { BarChart3, FileText, Car, LogOut } from 'lucide-react';

const navItems = [
  { to: '/admin',          icon: BarChart3, label: 'Dashboard',    end: true },
  { to: '/admin/bookings', icon: FileText, label: 'Reservations'            },
  { to: '/admin/cars',     icon: Car, label: 'Cars'                    },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#080808] border-r border-[#2A2A2A] transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">

          {/* Brand — reads from config.js */}
          <div className="p-5 border-b border-[#2A2A2A] flex items-center gap-3">
            <img
              src={config.company.logo}
              alt={config.company.name}
              className="h-9 w-9 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="leading-none">
              <span className="text-base font-bold tracking-widest text-white">{config.company.name}</span>
              <p className="text-[9px] tracking-[0.2em] text-accent uppercase">{config.company.tagline}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to} to={to} end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-accent text-black font-bold'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'}`
                }
              >
                <Icon className="w-5 h-5" />{label}
              </NavLink>
            ))}
          </nav>

          {/* User + Logout */}
          <div className="p-4 border-t border-[#2A2A2A]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-accent text-black rounded-full flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0) ?? 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                <p className="text-gray-600 text-xs truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left text-gray-600 hover:text-red-400 text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#080808] border-b border-[#2A2A2A] px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            className="lg:hidden text-gray-500 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <Link to="/" target="_blank" className="text-sm text-gray-600 hover:text-accent transition-colors">
              View Site →
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
