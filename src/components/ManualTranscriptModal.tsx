import React, { useState } from 'react';
import { FileText, X, Sparkles, Youtube, Check } from 'lucide-react';

interface ManualTranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { transcript: string; title: string; subjectHint?: string }) => void;
  initialTitle?: string;
}

export const ManualTranscriptModal: React.FC<ManualTranscriptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTitle = ''
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [subjectHint, setSubjectHint] = useState('General');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim() || transcript.trim().length < 30) {
      setError('Please provide at least 30 characters of transcript text.');
      return;
    }
    setError('');
    onSubmit({
      title: title.trim() || 'Custom Lecture Notes',
      subjectHint,
      transcript: transcript.trim()
    });
  };

  const handleUsePreset = (type: 'physics' | 'math' | 'history') => {
    if (type === 'physics') {
      setTitle("Newton's Laws of Motion & Momentum Lecture");
      setSubjectHint('Physics');
      setTranscript(`Welcome to today's physics lecture on Newton's Laws of Motion. We begin with the concept of Inertia introduced by Galileo and formalized by Sir Isaac Newton in 1687. The first law states that an object will remain at rest or in uniform motion unless acted upon by an external net force. Mass is the direct measurement of inertia. Moving to the second law, force is the rate of change of momentum. If mass is constant, F = m * a. In SI units, force is measured in Newtons (kg m/s²). Impulse is the product of average force and time, equal to change in momentum. The third law establishes that all forces exist in action-reaction pairs between interacting bodies, with equal magnitude and opposite direction.`);
    } else if (type === 'math') {
      setTitle('Differential Calculus: Derivatives & Chain Rule');
      setSubjectHint('Mathematics');
      setTranscript(`In this calculus class, we explore the derivative as the instantaneous rate of change and the geometric slope of the tangent line. By definition from first principles, f'(x) equals the limit as h approaches zero of [f(x+h) - f(x)] divided by h. Key rules include the Power Rule d/dx(x^n) = n*x^(n-1), the Product Rule, and the Chain Rule. When dealing with composite functions y = f(g(x)), dy/dx = f'(g(x)) * g'(x). This rule is indispensable in physics, engineering, and machine learning gradient descent.`);
    } else {
      setTitle('The French Revolution and Its Impact on Europe');
      setSubjectHint('History');
      setTranscript(`Today we examine the French Revolution of 1789. The crisis emerged from financial bankruptcy, the Estates-General social division into Clergy, Nobility, and the Third Estate. Key turning points included the storming of the Bastille on July 14, 1789, the Declaration of the Rights of Man, the Reign of Terror under Robespierre, and the eventual rise of Napoleon Bonaparte in 1799. The revolution abolished feudalism and planted democratic ideas across modern Europe.`);
    }
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Paste Lecture Transcript</h3>
              <p className="text-xs text-stone-400">Works with any lecture text, slide transcript, or notes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="px-6 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center gap-2 text-xs flex-wrap">
          <span className="font-semibold text-stone-600">Quick Test Templates:</span>
          <button
            type="button"
            onClick={() => handleUsePreset('physics')}
            className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 font-medium"
          >
            Physics Sample
          </button>
          <button
            type="button"
            onClick={() => handleUsePreset('math')}
            className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-medium"
          >
            Math Sample
          </button>
          <button
            type="button"
            onClick={() => handleUsePreset('history')}
            className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-medium"
          >
            History Sample
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Lecture / Video Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Physics Chapter 3: Mechanics"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Subject Category
              </label>
              <select
                value={subjectHint}
                onChange={(e) => setSubjectHint(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-white"
              >
                <option value="Physics">Physics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
                <option value="Polity">Polity / Constitution</option>
                <option value="Economics">Economics</option>
                <option value="Competitive Exams">UPSC / SSC / Govt Exams</option>
                <option value="General Science">General Science</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Transcript or Lecture Notes Text
            </label>
            <textarea
              rows={8}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste the full transcript, auto-generated subtitles, or lecture speech text here..."
              className="w-full p-3.5 rounded-xl border border-stone-300 text-sm font-sans focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 leading-relaxed"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Characters: {transcript.length} (minimum 30 chars required)
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-stone-950" />
              <span>Generate Handwritten Notes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
