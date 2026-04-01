import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { 
  FiHome, 
  FiActivity, 
  FiCalendar, 
  FiCpu, 
  FiUser, 
  FiLogOut, 
  FiMenu 
} from 'react-icons/fi';
import VirtualSmartWatch from './VirtualSmartWatch';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Health Metrics', href: '/health', icon: FiActivity },
    { name: 'Appointments', href: '/appointments', icon: FiCalendar },
    { name: 'AI Insights', href: '/ai-insights', icon: FiCpu },
    { name: 'Profile', href: '/profile', icon: FiUser },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 z-30
        w-64 h-screen bg-gradient-to-b from-primary-800 to-primary-900
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-primary-700">
            <h1 className="text-2xl font-bold text-white">HealthFit AI</h1>
            <p className="text-primary-200 text-sm mt-1">Your AI Health Companion</p>
          </div>

          <nav className="flex-1 py-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-6 py-3 mx-2 rounded-lg transition-all duration-200
                    ${isActive(item.href) 
                      ? 'bg-primary-700 text-white shadow-lg' 
                      : 'text-primary-100 hover:bg-primary-700/50 hover:text-white'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-primary-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-primary-100 hover:text-white hover:bg-primary-700 rounded-lg transition-all duration-200"
            >
              <FiLogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <FiMenu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="flex items-center space-x-4 ml-auto">
              <VirtualSmartWatch />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;