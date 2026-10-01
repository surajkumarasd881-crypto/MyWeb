import React, { useState } from 'react';
import { Sparkles, Youtube, ArrowRight, Play, FileText, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface HeroProps {
  onStartGeneration: (url: string) => void;
  onOpenManualTranscript: () => void;
  onLoadSample: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

const SAMPLE_VIDEOS = [
  {
    label: "Physics: Newton's Laws",
    url: 'https://www.youtube.com/watch?v=kKKM8Y-u7ds',
    badge: 'Physics'
  },
  {
    label: 'Calculus: Derivatives',
    url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
    badge: 'Math'
  },
  {
    label: 'Cellular Respiration',
    url: 'https://www.youtube.com/watch?v=00jbG_cfGuQ',
    badge: 'Biology'
  },
  {
    label: 'French Revolution Overview',
    url: 'https://www.youtube.com/watch?v=8qRZcXIODNU',
    badge: 'History'
  }
];

export const Hero: React.FC<HeroProps> = ({
  onStartGeneration,
  onOpenManualTranscript,
  onLoadSample,
  isLoading,
  errorMessage
}) => {
  const [url, setUrl] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setLocalError('Please paste a YouTube video link.');
      return;
    }

    // Basic client check
    const isYouTube = /(?:youtube\.com\/(?:watch|shorts|embed)|youtu\.be\/)/i.test(trimmed);
    if (!isYouTube) {
      setLocalError('Please paste a valid YouTube video link (e.g., https://www.youtube.com/watch?v=...)');
      return;
    }

    onStartGeneration(trimmed);
  };

  const handleSelectSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setLocalError(null);
    onStartGeneration(sampleUrl);
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 border-b border-stone-200/70 bg-gradient-to-b from-amber-50/40 via-stone-50 to-stone-50">
      
      {/* Decorative background grid and warm glow */}
      <div className="absolute inset-0 bg-graph-paper opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Small badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 shadow-xs mb-6 text-xs sm:text-sm font-semibold tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>AI-Powered Study Notes</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span className="text-amber-800/80 font-normal">Handwritten Aesthetic</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15] mb-5">
          Turn YouTube Lectures Into <br className="hidden sm:inline" />
          <span className="relative inline-block text-amber-600 font-extrabold underline decoration-amber-400 decoration-wavy decoration-3 underline-offset-8">
            Beautiful Study Notes.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-stone-600 font-medium mb-10 leading-relaxed">
          Paste a YouTube lecture and get structured, easy-to-revise notes in seconds.
          Formulas, definitions, exam tips, and handwritten styling included.
        </p>

        {/* Large Input Form */}
        <div className="max-w-3xl mx-auto mb-6">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="relative flex flex-col sm:flex-row items-center p-2 rounded-2xl bg-white shadow-xl shadow-stone-200/60 border-2 border-stone-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all">
              
              {/* YouTube Icon */}
              <div className="hidden sm:flex items-center pl-3 pr-2 text-red-500">
                <Youtube className="w-6 h-6" />
              </div>

              {/* Text Input */}
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (localError) setLocalError(null);
                }}
                placeholder="Paste YouTube video link here... (e.g. https://www.youtube.com/watch?v=...)"
                aria-label="YouTube lecture URL"
                className="w-full px-4 py-3.5 text-base text-stone-900 placeholder-stone-400 bg-transparent border-0 focus:outline-none focus:ring-0 font-medium"
                disabled={isLoading}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto mt-2 sm:mt-0 flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-base shadow-md shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Notes</span>
                    <Sparkles className="w-4 h-4 text-stone-950 fill-stone-950" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message if any */}
          {(localError || errorMessage) && (
            <div className="mt-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{localError || errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={onOpenManualTranscript}
                className="text-xs font-bold text-rose-900 underline hover:no-underline whitespace-nowrap"
              >
                Paste text manually →
              </button>
            </div>
          )}
        </div>

        {/* Secondary options: Instant demo pills */}
        <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500 mb-8">
          <span className="font-semibold text-stone-700">Try Instant Sample:</span>
          {SAMPLE_VIDEOS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(item.url)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200 hover:border-amber-300 shadow-2xs transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3 text-amber-600 fill-amber-600" />
              <span>{item.label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold border border-amber-300 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-700" />
            <span>Interactive Demo Sheet</span>
          </button>
        </div>

        {/* Animated Workflow Stage Indicator */}
        <div className="max-w-3xl mx-auto pt-6 border-t border-stone-200/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-2">
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 shadow-2xs">
              <Youtube className="w-4 h-4 text-red-500" />
              <span>YouTube Video</span>
            </div>

            <div className="hidden sm:flex items-center text-amber-500">
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Processing</span>
            </div>

            <div className="hidden sm:flex items-center text-amber-500">
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 shadow-2xs">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Smart Notes</span>
            </div>

            <div className="hidden sm:flex items-center text-amber-500">
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Fast Revision</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
