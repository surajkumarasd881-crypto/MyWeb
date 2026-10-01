import React from 'react';
import { BookOpen, Sparkles, FolderHeart, ShieldCheck, Crown, ExternalLink } from 'lucide-react';
import { UserProfile } from '../types/note';

interface NavbarProps {
  user: UserProfile;
  savedCount: number;
  onOpenMyNotes: () => void;
  onOpenPricing: () => void;
  onOpenApiStatus: () => void;
  onLoadSample: () => void;
  activeView: 'home' | 'note' | 'notes-list';
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  savedCount,
  onOpenMyNotes,
  onOpenPricing,
  onOpenApiStatus,
  onLoadSample,
  activeView,
  onNavigateHome
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <span className="font-kalam text-2xl font-bold tracking-tight">R</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-stone-900">Revise<span className="text-amber-600">Karo</span></span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full border border-amber-200">
                  AI Notes
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block font-medium">Watch Less. Revise Better.</p>
            </div>
          </button>
        </div>

        {/* Center navigation links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button onClick={onNavigateHome} className={`hover:text-amber-600 transition-colors ${activeView === 'home' ? 'text-amber-600 font-semibold' : ''}`}>
            Home
          </button>
          <a href="#how-it-works" className="hover:text-amber-600 transition-colors">
            How It Works
          </a>
          <a href="#features" className="hover:text-amber-600 transition-colors">
            Why Us
          </a>
          <button onClick={onLoadSample} className="hover:text-amber-600 transition-colors flex items-center gap-1 text-stone-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Demo Notes
          </button>
          <button onClick={onOpenPricing} className="hover:text-amber-600 transition-colors">
            Pricing
          </button>
          <a href="#faq" className="hover:text-amber-600 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* API Health Pill */}
          <button
            onClick={onOpenApiStatus}
            title="System & AI Status"
            className="hidden lg:flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-lg border border-stone-200 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Gemini AI</span>
          </button>

          {/* My Notes button */}
          <button
            onClick={onOpenMyNotes}
            className="flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3.5 py-1.5 rounded-lg transition-colors border border-stone-200/80"
          >
            <FolderHeart className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">My Notes</span>
            <span className="bg-amber-500 text-stone-950 font-bold text-xs px-1.5 py-0.2 rounded-full">
              {savedCount}
            </span>
          </button>

          {/* Plan badge & Upgrade */}
          {user.plan === 'free' ? (
            <button
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 text-xs font-semibold bg-stone-900 text-amber-400 hover:bg-stone-800 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              <Crown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upgrade Pro</span>
              <span className="sm:hidden">Pro</span>
            </button>
          ) : (
            <span className="flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-lg">
              <Crown className="w-3 h-3 text-amber-600" />
              PRO
            </span>
          )}
        </div>

      </div>
    </header>
  );
};
