import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Check, ShieldCheck, HelpCircle, ChevronDown, ChevronUp, ArrowRight 
} from 'lucide-react';

interface PricingSectionProps {
  onOpenTrialModal: () => void;
  isTrialActive: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onOpenTrialModal,
  isTrialActive
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does the 15-Day Free Trial work?',
      a: 'You get full unlimited access to all COOKPAD: PRESERVE features for 15 days completely free ($0). You can analyze unlimited recipes, print jar labels, and log your pantry batches.'
    },
    {
      q: 'Why are USDA guidelines strictly enforced?',
      a: 'Botulism bacteria thrive in low-acid, oxygen-free environments (like canned jars). Our scanner detects dangerous thickeners, purees, and missing acidifiers to ensure your preserves are 100% safe.'
    },
    {
      q: 'Can I export my canning logs for offline backup?',
      a: 'Yes! You can download a complete CSV/JSON master log sheet anytime or print individual jar labels formatted for standard 2.5-inch lid stickers.'
    }
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-[#0D0D0D] text-white relative overflow-hidden">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FF8107]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4 text-[#FF8107]" />
            <span className="text-xs font-black uppercase tracking-widest text-gray-200">
              PreserveCheck Membership
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Start free. Preserve smarter.
          </h2>
          <p className="text-base sm:text-lg text-gray-300 font-medium">
            $0 for 15 days, then $9.99/mo.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="max-w-2xl mx-auto">
          
          {/* Main Free Trial Card (Highlighted Bubble UI) */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-[36px] p-8 sm:p-10 border-2 border-[#FF8107] shadow-2xl relative flex flex-col justify-between text-left"
          >
            <div className="absolute -top-4 right-8 bg-[#FF8107] text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
              15-Day Free Trial
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#FF8107] uppercase tracking-wider block">
                  All-Inclusive Canning Pass
                </span>
                <h3 className="text-3xl font-black text-white mt-1">PreserveCheck Pass</h3>
                <p className="text-xs text-gray-400 mt-1">Complete safety scanner, digital pantry logging, and weekly inspiration.</p>
              </div>

              {/* Price Highlight */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-black text-white">$0</span>
                  <span className="text-sm font-bold text-gray-400">for 15 Days</span>
                </div>
                <div className="text-xs text-[#FF8107] font-bold pt-1">
                  Then $9.99 / month • Cancel anytime with 1 click
                </div>
              </div>

              {/* Feature Bullet Points */}
              <ul className="space-y-3.5 text-sm font-semibold text-gray-200">
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF8107]/20 text-[#FF8107] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Recipe red flag scanner</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF8107]/20 text-[#FF8107] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Pantry batch logs</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF8107]/20 text-[#FF8107] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>PDF exports & master jar labels</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF8107]/20 text-[#FF8107] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Weekly recipe inspiration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF8107]/20 text-[#FF8107] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Safety reminders & altitude timing calculators</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={onOpenTrialModal}
                className="w-full bg-[#FF8107] hover:bg-[#e06f00] text-white py-4 rounded-full text-lg font-black shadow-lg shadow-[#FF8107]/30 flex items-center justify-center space-x-2 transition-all"
              >
                <span>{isTrialActive ? 'Trial Active' : 'Start 15-Day Free Trial'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto pt-8 space-y-4 text-left">
          <h3 className="text-xl font-black text-white text-center">Frequently Asked Questions</h3>
          
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-sm text-gray-200 flex items-center justify-between"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-[#FF8107]" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-gray-400 font-medium leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
