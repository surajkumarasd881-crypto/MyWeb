import React from 'react';

interface FooterProps {
  onNavigateHome: () => void;
  onOpenPricing: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateHome, onOpenPricing }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <span className="font-kalam text-xl font-bold">R</span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Revise<span className="text-amber-500">Karo</span>
              </span>
            </div>
            <p className="text-amber-400 font-medium text-sm">Watch Less. Revise Better.</p>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Transforming lengthy educational YouTube lectures into structured, beautiful handwritten study notes for university, competitive, and school exams.
            </p>
          </div>

          {/* Product links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">Product</h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>
                <button onClick={onNavigateHome} className="hover:text-amber-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-amber-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <button onClick={onOpenPricing} className="hover:text-amber-400 transition-colors">
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Company */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">Legal & Support</h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>
                <a href="#faq" className="hover:text-amber-400 transition-colors">
                  FAQ & Help
                </a>
              </li>
              <li>
                <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-stone-300 cursor-pointer">Contact Support</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 ReviseKaro. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Gemini 3.8 Flash AI</span>
            <span>•</span>
            <span>Handwritten Vector Note Engine</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
