import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  Library,
  PlusCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { PWAInstallButton } from '../common/PWAInstallButton.tsx';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { userProfile, currentUser, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Vocabulary', path: '/vocabulary', icon: Library },
    { name: 'Add New Word', path: '/add', icon: PlusCircle },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Header */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
            <NavLink
              to="/"
              className="flex items-center gap-3 overflow-hidden"
              onClick={() => setMobileOpen(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-indigo-600/30">
                <BookOpen className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                    LEXORA
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-indigo-600 tracking-wider mt-1">
                    Vocabulary Vault
                  </span>
                </div>
              )}
            </NavLink>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 group ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    } ${isCollapsed ? 'justify-center' : ''}`
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Profile + Collapse Button */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {/* PWA Install Action */}
          {!isCollapsed && <PWAInstallButton variant="sidebar" />}

          {/* User profile card */}
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100 ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            {userProfile?.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt={userProfile.fullName || 'User'}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {getInitials(userProfile?.fullName || currentUser?.displayName || 'User')}
              </div>
            )}

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate leading-snug">
                  {userProfile?.fullName || currentUser?.displayName || 'Lexora Member'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {currentUser?.email || ''}
                </p>
              </div>
            )}
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>

          {/* Desktop Collapse Toggle */}
          <div className="hidden lg:flex justify-end pt-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
