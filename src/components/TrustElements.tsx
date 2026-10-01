import React from 'react';
import { Video, Brain, PenTool, FileDown, Zap } from 'lucide-react';

export const TrustElements: React.FC = () => {
  const features = [
    {
      icon: Video,
      color: 'bg-red-50 text-red-600 border-red-200',
      title: 'YouTube to Notes',
      description: 'Turn long educational lectures into cleanly organized, distraction-free study material.'
    },
    {
      icon: Brain,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      title: 'Smart Structure',
      description: 'AI automatically isolates concepts, definitions, formula boxes, examples, and exam-important points.'
    },
    {
      icon: PenTool,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      title: 'Handwritten Look',
      description: 'Rendered on authentic notebook paper with realistic handwriting fonts, margin lines, and highlights.'
    },
    {
      icon: FileDown,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      title: 'High-Quality PDF',
      description: 'Export razor-sharp multi-page A4 PDFs formatted for printing and tablet annotation.'
    },
    {
      icon: Zap,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      title: 'Faster Revision',
      description: 'Review a 90-minute lecture in 7 minutes before tests and competitive exams.'
    }
  ];

  return (
    <section id="features" className="py-16 md:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-amber-700 mb-2">
            Why ReviseKaro?
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Built for Students Who Value Every Revision Minute.
          </p>
          <p className="mt-3 text-base text-stone-600">
            Stop pausing, screenshotting, and rewinding videos. Get ready-to-study notebook pages automatically.
          </p>
        </div>

        {/* 5-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative p-6 rounded-2xl bg-stone-50/70 border border-stone-200/90 hover:border-amber-300 hover:bg-amber-50/20 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 flex flex-col group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
