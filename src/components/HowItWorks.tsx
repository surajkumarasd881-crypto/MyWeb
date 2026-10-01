import React from 'react';
import { Link2, Cpu, FileSignature, CheckCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Paste',
      desc: 'Paste your YouTube lecture URL from any computer, tablet, or phone.',
      icon: Link2
    },
    {
      num: '02',
      title: 'Understand',
      desc: 'ReviseKaro processes the available transcript and extracts core timestamps.',
      icon: Cpu
    },
    {
      num: '03',
      title: 'Generate',
      desc: 'AI converts the lecture into structured notes with equations and definitions.',
      icon: FileSignature
    },
    {
      num: '04',
      title: 'Revise',
      desc: 'Edit freely, customize themes, download high-res PDF, and ace your exams.',
      icon: CheckCircle
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest font-extrabold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            Simple 4-Step Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-4">
            How ReviseKaro Works
          </h2>
          <p className="mt-2 text-stone-600">
            From 60-minute video to handwritten study notes in under 15 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-extrabold text-3xl font-kalam text-amber-500/80">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/80">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-stone-100 flex items-center text-xs font-semibold text-stone-400">
                  Step {index + 1} of 4
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
