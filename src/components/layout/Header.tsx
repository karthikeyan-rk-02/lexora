import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useVocabulary } from '../../context/VocabularyContext.tsx';
import { PWAInstallButton } from '../common/PWAInstallButton.tsx';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { userProfile, currentUser } = useAuth();
  const { searchQuery, setSearchQuery } = useVocabulary();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = userProfile?.fullName || currentUser?.displayName || 'Learner';
  const firstName = displayName.split(' ')[0] || displayName;

  // Determine time-based greeting
  const hour = new Date().getHours();
  let timeGreeting = 'Hello';
  if (hour < 12) timeGreeting = 'Good morning';
  else if (hour < 18) timeGreeting = 'Good afternoon';
  else timeGreeting = 'Good evening';

  const motivationalQuotes = [
    'A richer vocabulary unlocks clearer thinking.',
    'Every word you master sharpens your perspective.',
    'Language is the architecture of ideas.',
    'Elevate your expression one word at a time.',
  ];

  // Pick stable quote based on day
  const quote = motivationalQuotes[new Date().getDate() % motivationalQuotes.length];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/vocabulary') {
      navigate('/vocabulary');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Greeting */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate flex items-center gap-2">
              <span>{timeGreeting}, {firstName}</span>
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 hidden sm:inline" />
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block truncate">
              {quote}
            </p>
          </div>
        </div>

        {/* Right: Quick Search & Profile Avatar */}
        <div className="flex items-center gap-3">
          {/* PWA Install Button (auto-hides when running standalone) */}
          <PWAInstallButton variant="header" />

          {/* Search Bar */}
          <div className="relative w-44 sm:w-64 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search words, meanings..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Profile Avatar linking to /settings */}
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center p-0.5 rounded-full ring-2 ring-transparent hover:ring-indigo-500/30 transition-all shrink-0"
            title="Account Settings"
            aria-label="Account Settings"
          >
            {userProfile?.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center">
                {firstName.slice(0, 1).toUpperCase()}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
