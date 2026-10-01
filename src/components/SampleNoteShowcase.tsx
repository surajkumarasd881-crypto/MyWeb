import React, { useState } from 'react';
import { Sparkles, ArrowRight, Palette, Type, Check, Download, Eye, ExternalLink } from 'lucide-react';
import { SAMPLE_PHYSICS_NOTE } from '../services/sampleData';
import { NoteTheme, NoteFont } from '../types/note';
import { NoteDoodle } from './NoteDoodles';

interface SampleNoteShowcaseProps {
  onOpenSampleInEditor: (note: typeof SAMPLE_PHYSICS_NOTE) => void;
}

export const SampleNoteShowcase: React.FC<SampleNoteShowcaseProps> = ({ onOpenSampleInEditor }) => {
  const [activeTheme, setActiveTheme] = useState<NoteTheme>('classic');
  const [activeFont, setActiveFont] = useState<NoteFont>('kalam');

  const themes: { id: NoteTheme; name: string; bgClass: string; textColor: string; cardBorder: string }[] = [
    { id: 'classic', name: 'Classic Notebook', bgClass: 'bg-lined-paper', textColor: 'text-stone-900', cardBorder: 'border-stone-300' },
    { id: 'clean', name: 'Clean White', bgClass: 'bg-clean-white', textColor: 'text-stone-900', cardBorder: 'border-stone-200' },
    { id: 'graph', name: 'Graph Paper', bgClass: 'bg-graph-paper', textColor: 'text-stone-900', cardBorder: 'border-sky-300/60' },
    { id: 'dark', name: 'Dark Study', bgClass: 'bg-dark-paper', textColor: 'text-stone-100', cardBorder: 'border-stone-700' },
    { id: 'colorful', name: 'Colorful Revision', bgClass: 'bg-colorful-paper', textColor: 'text-stone-900', cardBorder: 'border-amber-300' },
  ];

  const fonts: { id: NoteFont; label: string; fontClass: string }[] = [
    { id: 'kalam', label: 'Kalam (Neat Pen)', fontClass: 'font-kalam' },
    { id: 'caveat', label: 'Caveat (Fluid Ink)', fontClass: 'font-caveat' },
    { id: 'patrick', label: 'Patrick Hand (Print)', fontClass: 'font-patrick' },
  ];

  const currentTheme = themes.find(t => t.id === activeTheme) || themes[0];
  const currentFont = fonts.find(f => f.id === activeFont) || fonts[0];

  return (
    <section className="py-16 md:py-24 bg-stone-100/70 border-b border-stone-200 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200/80 text-amber-950 font-bold text-xs border border-amber-300 mb-3">
            <Eye className="w-3.5 h-3.5 text-amber-700" />
            <span>Interactive Demo Preview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Look Like Real Handwritten Notes.
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            Toggle themes and handwriting styles below to see how ReviseKaro formats your lecture notes.
          </p>
        </div>

        {/* Live Controls Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-stone-200 mb-6 flex flex-wrap items-center justify-between gap-4">
          
          {/* Themes */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" /> Paper:
            </span>
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTheme(t.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTheme === t.id
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Fonts */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
              <Type className="w-3.5 h-3.5" /> Font:
            </span>
            {fonts.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFont(f.id)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeFont === f.id
                    ? 'bg-stone-900 text-amber-400 font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>

        {/* The Handwritten Notebook Sheet Preview */}
        <div className="relative mx-auto rounded-2xl shadow-2xl overflow-hidden border-2 border-stone-300 transition-all duration-300">
          
          {/* Top Banner Notice */}
          <div className="bg-stone-900 text-stone-300 text-xs py-2 px-4 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span className="font-semibold text-white">Demonstration Sample (Physics: Newton's Laws)</span>
            </div>
            <button
              onClick={() => onOpenSampleInEditor(SAMPLE_PHYSICS_NOTE)}
              className="text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center gap-1 hover:underline"
            >
              <span>Open in Full Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notebook Paper Body */}
          <div className={`p-6 sm:p-10 ${currentTheme.bgClass} ${currentTheme.textColor} ${currentFont.fontClass} transition-colors duration-300`}>
            
            {/* Header / Student Meta */}
            <div className="border-b-2 border-dashed border-stone-400/40 pb-6 mb-8 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-sans uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-300">
                    PHYSICS NOTES
                  </span>
                  <span className="text-xs font-sans text-stone-500 font-medium">
                    Topic 04 • Classical Mechanics
                  </span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-bold tracking-wide">
                  Newton's Laws of Motion & Friction
                </h3>
              </div>

              <div className="text-right text-xs sm:text-sm opacity-75 font-sans font-medium">
                <div>Date: Oct 2026</div>
                <div>Source: Lecture Video (42m)</div>
                <div className="text-amber-700 font-bold mt-1">Page 1 of 3</div>
              </div>
            </div>

            {/* Intro paragraph with highlighter */}
            <div className="mb-8 text-base sm:text-lg leading-relaxed">
              <p>
                <span className="highlight-yellow font-bold">Newtonian mechanics</span> forms the foundational bedrock of classical physics. It relates the motion of macroscopic objects to the vector sum of forces acting upon them, explaining planetary orbits, vehicle dynamics, and everyday balance.
              </p>
            </div>

            {/* Two column layout for concepts and formula card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              {/* Concept 1 */}
              <div className="lg:col-span-2 space-y-5">
                <div className="relative p-5 rounded-xl border-2 border-dashed border-stone-400/50 bg-white/40 backdrop-blur-xs">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl sm:text-2xl font-bold text-stone-900">
                      1. Law of Inertia (First Law)
                    </h4>
                    <NoteDoodle type="atom" className="w-8 h-8 text-amber-600" />
                  </div>
                  <p className="text-base sm:text-lg mb-3">
                    A body continues in its state of rest or uniform motion in a straight line unless compelled by an <span className="highlight-pink font-semibold">external net unbalanced force</span> (∑F ≠ 0).
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm sm:text-base opacity-90 pl-1">
                    <li>Inertia is quantitatively measured by mass (m).</li>
                    <li>Valid strictly in inertial (non-accelerating) frames.</li>
                  </ul>
                </div>

                {/* Concept 2 */}
                <div className="relative p-5 rounded-xl border-2 border-dashed border-stone-400/50 bg-white/40 backdrop-blur-xs">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl sm:text-2xl font-bold text-stone-900">
                      2. Fundamental Equation (Second Law)
                    </h4>
                    <NoteDoodle type="math" className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-base sm:text-lg mb-2">
                    The rate of change of linear momentum (p = mv) is directly proportional to applied force:
                  </p>
                  <div className="p-3 my-2 rounded-lg bg-amber-50/80 border border-amber-300 font-sans font-bold text-stone-950 text-center tracking-wide text-lg sm:text-xl">
                    F_net = m · a = dp / dt
                  </div>
                </div>
              </div>

              {/* Right: Sticky Note for Exam Important */}
              <div className="relative lg:col-span-1">
                <div className="hand-box p-5 bg-amber-200/90 text-stone-950 shadow-md border border-amber-300 transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="flex items-center gap-1.5 text-xs font-sans uppercase font-extrabold text-amber-900 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>EXAM IMPORTANT TIP</span>
                  </div>
                  <h5 className="font-bold text-lg mb-1">
                    Apparent Weight in Lifts
                  </h5>
                  <p className="text-sm leading-relaxed mb-3">
                    Accelerating UP: N = m(g + a) (Feels heavier).
                    <br />
                    Accelerating DOWN: N = m(g - a) (Feels lighter).
                    <br />
                    Free fall (a = g): N = 0 (Weightlessness!).
                  </p>
                  <div className="text-xs font-sans font-bold text-stone-700 border-t border-amber-300/80 pt-2">
                    Frequent in NEET / JEE / CBSE
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Revision Checklist */}
            <div className="p-5 rounded-xl border-2 border-stone-400/30 bg-white/30 backdrop-blur-xs">
              <h4 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>Quick 30-Second Revision Checklist</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>1st Law = Definition of Force & Inertia</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>2nd Law = Quantitative Measurement (F = ma)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>3rd Law = Forces occur in dual interacting pairs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Static friction (µs) &gt; Kinetic friction (µk)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Action Footer */}
          <div className="bg-stone-50 p-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-stone-500 font-medium text-center sm:text-left">
              Want to edit these notes, add your own sections, or download the printable PDF?
            </span>
            <button
              onClick={() => onOpenSampleInEditor(SAMPLE_PHYSICS_NOTE)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-sm transition-all"
            >
              <span>Open in Full Editor & Download PDF</span>
              <Download className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
