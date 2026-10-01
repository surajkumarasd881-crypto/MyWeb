import React from 'react';

interface DoodleProps {
  type?: string | null;
  className?: string;
}

export const NoteDoodle: React.FC<DoodleProps> = ({ type, className = 'w-7 h-7 text-amber-600' }) => {
  switch (type) {
    case 'atom':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
          <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(30 50 50)" strokeDasharray="3 2" />
          <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(-30 50 50)" />
          <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(90 50 50)" strokeDasharray="4 2" />
          <circle cx="50" cy="50" r="7" fill="currentColor" />
        </svg>
      );

    case 'math':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
          {/* Sigma / Integral doodle */}
          <path d="M 30 20 L 75 20 L 50 50 L 75 80 L 30 80" />
          <path d="M 68 35 L 82 35" strokeWidth="2.5" />
          <circle cx="75" cy="50" r="3" fill="currentColor" />
        </svg>
      );

    case 'bulb':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
          <path d="M 35 45 C 35 25, 65 25, 65 45 C 65 55, 58 60, 58 70 L 42 70 C 42 60, 35 55, 35 45 Z" />
          <line x1="42" y1="76" x2="58" y2="76" />
          <line x1="45" y1="82" x2="55" y2="82" />
          {/* Glow rays */}
          <line x1="50" y1="12" x2="50" y2="20" strokeWidth="2.5" />
          <line x1="22" y1="26" x2="28" y2="32" strokeWidth="2.5" />
          <line x1="78" y1="26" x2="72" y2="32" strokeWidth="2.5" />
        </svg>
      );

    case 'flask':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
          <path d="M 44 20 L 56 20 L 56 36 L 78 78 C 82 85, 76 90, 68 90 L 32 90 C 24 90, 18 85, 22 78 L 44 36 Z" />
          <path d="M 30 74 C 40 70, 60 78, 70 74" strokeDasharray="3 3" />
          <circle cx="45" cy="80" r="3" fill="currentColor" />
          <circle cx="58" cy="76" r="2" fill="currentColor" />
        </svg>
      );

    case 'chart':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
          <line x1="20" y1="20" x2="20" y2="80" />
          <line x1="20" y1="80" x2="85" y2="80" />
          <path d="M 24 68 Q 45 60 55 45 T 82 28" strokeWidth="3.5" />
          <circle cx="82" cy="28" r="4" fill="currentColor" />
        </svg>
      );

    case 'dna':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M 30 20 Q 50 35 70 50 Q 50 65 30 80" />
          <path d="M 70 20 Q 50 35 30 50 Q 50 65 70 80" />
          <line x1="38" y1="30" x2="62" y2="30" strokeWidth="2.5" />
          <line x1="42" y1="44" x2="58" y2="44" strokeWidth="2.5" />
          <line x1="42" y1="56" x2="58" y2="56" strokeWidth="2.5" />
          <line x1="38" y1="70" x2="62" y2="70" strokeWidth="2.5" />
        </svg>
      );

    case 'star':
    default:
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="50,15 62,38 88,41 68,58 74,83 50,70 26,83 32,58 12,41 38,38" fill="rgba(245, 158, 11, 0.2)" />
        </svg>
      );
  }
};
