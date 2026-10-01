import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Can ReviseKaro summarize any YouTube video?',
      a: 'ReviseKaro works with educational lectures and videos where usable transcript or caption content is available. Subtitles can be creator-provided or YouTube auto-generated. If captions are restricted, you can paste the lecture transcript or lecture notes directly.'
    },
    {
      q: 'Can I edit the generated study notes?',
      a: 'Yes, completely! Every heading, explanation, bullet point, and formula is editable inline. You can add new custom sections, delete parts you already know, reorder concepts, and highlight key terms.'
    },
    {
      q: 'Can I download the notes as a PDF?',
      a: 'Yes. ReviseKaro generates high-resolution, print-ready multi-page A4 PDFs with preserved handwritten typography, formula boxes, highlights, and page numbers. You can also print directly from your browser.'
    },
    {
      q: 'Does ReviseKaro work on mobile devices?',
      a: 'Yes. ReviseKaro is designed mobile-first. You can paste video links on your smartphone, review handwritten notebook pages on the bus, and export PDFs right to your phone or tablet.'
    },
    {
      q: 'Can I change the handwriting style and paper theme?',
      a: 'Yes. You can switch between 5 authentic paper themes (Classic Ruled Notebook, Clean White, Graph Paper, Dark Study, and Colorful Revision) and 3 handwriting fonts (Kalam, Caveat, and Patrick Hand) with instant live preview.'
    },
    {
      q: 'What happens if a video has no transcript or subtitles?',
      a: 'If a YouTube video has captions turned off or is private, ReviseKaro will inform you immediately rather than generating hallucinated notes. You can use our "Paste Transcript Manually" option to provide lecture slides, speech-to-text, or class notes to generate notes.'
    }
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-white border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest font-extrabold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-4">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            Everything you need to know about ReviseKaro's YouTube note engine.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-stone-200 bg-stone-50/50 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-stone-900 text-sm sm:text-base cursor-pointer hover:bg-stone-100/60"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
