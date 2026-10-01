import React from 'react';
import { 
  Calculator, Atom, FlaskConical, Dna, Clock, Globe, 
  Landmark, TrendingUp, Sparkles, BookOpen, Brain, GraduationCap 
} from 'lucide-react';

export const SubjectBadges: React.FC = () => {
  const subjects = [
    { name: 'Mathematics', desc: 'Step-by-step proofs & LaTeX formulas', icon: Calculator, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { name: 'Physics', desc: 'Mechanics, units & free body diagrams', icon: Atom, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { name: 'Chemistry', desc: 'Reactions, stoichiometry & mechanisms', icon: FlaskConical, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { name: 'Biology', desc: 'Organisms, cellular systems & processes', icon: Dna, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { name: 'History', desc: 'Timelines, causes, revolutions & key figures', icon: Clock, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { name: 'Polity & Law', desc: 'Constitutional articles, courts & governance', icon: Landmark, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { name: 'Economics', desc: 'Macroeconomics, fiscal policy & markets', icon: TrendingUp, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { name: 'UPSC & State PSC', desc: 'High-yield exam facts, mnemonics & one-liners', icon: GraduationCap, color: 'text-amber-800 bg-amber-100/60 border-amber-300' }
  ];

  return (
    <section className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-extrabold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            Subject-Aware AI Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-4">
            Adaptive Note Formats For Every Discipline
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            ReviseKaro automatically identifies your subject and tailors the layout: formulas for STEM, timelines for History, and high-yield cards for competitive tests.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((sub, i) => {
            const Icon = sub.icon;
            return (
              <div 
                key={i}
                className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/50 hover:bg-white hover:border-amber-300 hover:shadow-sm transition-all flex items-start gap-3.5"
              >
                <div className={`p-2.5 rounded-lg border shrink-0 ${sub.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {sub.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
