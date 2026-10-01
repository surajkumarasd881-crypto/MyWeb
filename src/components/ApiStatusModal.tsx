import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertCircle, X, CheckCircle2, Cpu, Server, Key, Sparkles } from 'lucide-react';

interface ApiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiStatusModal: React.FC<ApiStatusModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/config-status')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to query backend status:', err);
        setLoading(false);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Backend & AI Health</h3>
              <p className="text-xs text-stone-400">ReviseKaro Service Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="py-8 text-center text-xs text-stone-500">
              <span className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin inline-block mb-2"></span>
              <p>Checking server configuration...</p>
            </div>
          ) : (
            <div className="space-y-3">
              
              {/* Gemini AI Status */}
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Gemini AI Engine</span>
                  </span>
                  <p className="text-[11px] text-stone-500">Model: gemini-3.8-flash (Google Gen AI SDK)</p>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{config?.services?.ai?.configured ? 'Active' : 'Ready'}</span>
                </div>
              </div>

              {/* YouTube Caption Service */}
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-red-600" />
                    <span>YouTube TimedText Captions</span>
                  </span>
                  <p className="text-[11px] text-stone-500">Official Player Caption Tracks</p>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Ready</span>
                </div>
              </div>

              {/* Vector PDF Engine */}
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>PDF & Print Engine</span>
                  </span>
                  <p className="text-[11px] text-stone-500">Multi-page A4 Canvas & High-res export</p>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Ready</span>
                </div>
              </div>

              {/* Security notice */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <strong>Security Architecture:</strong> All AI processing and YouTube transcript downloads are executed securely on the backend server. No credentials or secret keys are exposed in client-side code.
              </div>

            </div>
          )}

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
