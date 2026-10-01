import React, { useState } from 'react';
import { Check, Sparkles, Crown, Zap, Shield, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types/note';

interface PricingSectionProps {
  user: UserProfile;
  onUpgradeToPro: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ user, onUpgradeToPro }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const pricingConfig = {
    free: {
      price: '$0',
      period: 'forever',
      features: [
        '5 AI lecture generations / month',
        'Classic Notebook & Clean White themes',
        'Standard PDF export',
        'Up to 30-minute lectures',
        'Essential formula & exam tips'
      ]
    },
    pro: {
      monthlyPrice: '$8',
      yearlyPrice: '$6',
      period: 'per month',
      features: [
        'Unlimited AI note generations',
        'All 5 Notebook Themes (Graph, Dark Study, Colorful)',
        'All 3 Handwritten Fonts (Kalam, Caveat, Patrick)',
        'Ultra-long video support (Up to 3+ hours)',
        'High-resolution multi-page A4 PDF & Print',
        'Priority Gemini 3.8 Flash AI reasoning',
        'Unlimited cloud/local notes history',
        'Export Markdown & Plain text'
      ]
    }
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-extrabold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-4">
            Invest in Better Grades, Not More Screen Time.
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            Start free, then unlock unlimited lectures and premium themes when you're ready.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="mt-6 inline-flex items-center p-1 rounded-xl bg-stone-200 text-xs font-semibold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                billingCycle === 'monthly' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Free Tier */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-500">Free Tier</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-stone-100 text-stone-600">Starter</span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-stone-900">{pricingConfig.free.price}</span>
                <span className="text-stone-500 text-xs ml-1">/ {pricingConfig.free.period}</span>
                <p className="text-xs text-stone-500 mt-2">
                  Perfect for occasional revisions and quick lecture overviews.
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {pricingConfig.free.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-stone-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              disabled
              className="w-full py-3 rounded-xl bg-stone-100 text-stone-400 font-bold text-xs cursor-default text-center"
            >
              {user.plan === 'free' ? 'Current Active Plan' : 'Free Plan'}
            </button>
          </div>

          {/* Pro Tier */}
          <div className="relative bg-stone-900 text-white rounded-3xl p-8 border-2 border-amber-500 shadow-xl flex flex-col justify-between">
            <div className="absolute -top-3.5 right-8 bg-amber-500 text-stone-950 font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
              <span>Most Popular</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">Pro Student</span>
                <Crown className="w-5 h-5 text-amber-400" />
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">
                  {billingCycle === 'monthly' ? pricingConfig.pro.monthlyPrice : pricingConfig.pro.yearlyPrice}
                </span>
                <span className="text-stone-400 text-xs ml-1">/ {pricingConfig.pro.period}</span>
                <p className="text-xs text-stone-400 mt-2">
                  For students preparing for university finals, NEET, JEE, UPSC, and board exams.
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {pricingConfig.pro.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-stone-200">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onUpgradeToPro}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-sm shadow-md shadow-amber-500/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              {user.plan === 'pro' ? 'You are on Pro Plan ✓' : 'Upgrade to Pro Now'}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
