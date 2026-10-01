import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, X, RefreshCw, ArrowLeft } from 'lucide-react';

interface GenerationProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStepIndex: number;
  error: string | null;
  errorCode?: 'INVALID_URL' | 'VIDEO_UNAVAILABLE' | 'FETCH_FAILED' | string | null;
  onRetry: () => void;
  onOpenManualPaste?: () => void;
  onTryAnotherVideo: () => void;
  videoTitle?: string;
  videoId?: string;
  thumbnailUrl?: string;
}

const STEPS = [
  { label: 'Analyzing video...', desc: 'Reading lecture details and timestamps' },
  { label: 'Extracting content...', desc: 'Processing captions or audio speech-to-text' },
  { label: 'Creating your notes...', desc: 'Generating formulas, concepts and revision sheet' }
];

export const GenerationProgressModal: React.FC<GenerationProgressModalProps> = ({
  isOpen,
  onClose,
  currentStepIndex,
  error,
  errorCode,
  onRetry,
  onTryAnotherVideo,
  videoTitle,
  videoId,
  thumbnailUrl
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 fill-stone-950" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">ReviseKaro AI</h3>
              <p className="text-xs text-stone-400">
                {error ? 'Processing status' : 'Transforming YouTube lecture into study notes'}
              </p>
            </div>
          </div>
          {error && (
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Video meta preview if available */}
        {videoTitle && (
          <div className="px-6 py-3 bg-amber-50/70 border-b border-amber-200/60 flex items-center gap-3">
            {thumbnailUrl && (
              <img src={thumbnailUrl} alt="Thumbnail" className="w-12 h-8 rounded object-cover border border-amber-300" />
            )}
            <div className="overflow-hidden">
              <p className="text-xs text-amber-900 font-bold truncate">{videoTitle}</p>
              <p className="text-[11px] text-amber-700/80">
                {videoId ? `Video ID: ${videoId}` : 'Public YouTube Lecture'}
              </p>
            </div>
          </div>
        )}

        {/* Body content */}
        <div className="p-6">
          
          {error ? (
            /* Error State */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-rose-900 text-sm mb-1">
                    Notice
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-700 leading-relaxed font-medium">
                    {error}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={onRetry}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
                <button
                  type="button"
                  onClick={onTryAnotherVideo}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Try Another Video</span>
                </button>
              </div>
            </div>
          ) : (
            /* Streamlined 3-step Progress State */
            <div className="space-y-4">
              {STEPS.map((step, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isWaiting = idx > currentStepIndex;

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 transition-opacity duration-300 ${
                      isWaiting ? 'opacity-35' : 'opacity-100'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {isDone ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-xs animate-pulse">
                          <span className="w-2.5 h-2.5 rounded-full bg-stone-950 animate-ping"></span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-stone-300 flex items-center justify-center text-[10px] font-bold text-stone-400">
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className={`text-sm font-bold ${isCurrent ? 'text-amber-800 font-extrabold' : 'text-stone-800'}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-stone-500">
                        {step.desc}
                      </p>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                        Processing
                      </span>
                    )}
                  </div>
                );
              })}

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                <span>Auto-detection: Captions & Audio Speech-to-Text</span>
                <span>Gemini Engine</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
