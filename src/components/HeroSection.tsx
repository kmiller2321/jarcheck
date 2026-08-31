import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, AlertTriangle, Sparkles, CheckCircle, Flame, HeartHandshake } from 'lucide-react';
import { IMAGE_PRESETS, CANNING_JAR_SVG_FALLBACK } from '../utils/imageAssets';

interface HeroSectionProps {
  onStartAnalyze: () => void;
  onOpenTrial: () => void;
  onSelectPreset: (recipeText: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartAnalyze,
  onOpenTrial,
  onSelectPreset
}) => {
  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-16 md:py-20">
      {/* Background Soft Orange Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#FF8107]/15 via-[#FFB267]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#FF8107]/10 via-[#FFB267]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* USDA Compliance Pill Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-[#FF8107]/30 px-4 py-2 rounded-full shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#FF8107]" />
              <span className="text-xs sm:text-sm font-bold text-[#0D0D0D]">
                USDA NCHFP Guided Food Preservation Science
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0D0D0D] leading-[1.1]">
              Preserve with Confidence.{' '}
              <span className="bg-gradient-to-r from-[#FF8107] to-amber-500 bg-clip-text text-transparent block mt-1">
                Zero Botulism Risk.
              </span>
            </h1>

            {/* Paragraph */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl font-normal leading-relaxed">
              Transform any family recipe or experimental batch into a USDA-compliant canned masterpiece. Instantly scan for unsafe thickeners, dairy fats, low-acid hazards, and incorrect canning methods.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={onStartAnalyze}
                className="bg-[#FF8107] hover:bg-[#e06f00] text-white px-8 py-4 rounded-3xl text-lg font-bold shadow-xl shadow-[#FF8107]/25 flex items-center justify-center space-x-3 transition-all duration-200"
              >
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                <span>Analyze Recipe Safety</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenTrial}
                className="bg-[#0D0D0D] hover:bg-black text-white px-7 py-4 rounded-3xl text-base font-bold flex items-center justify-center space-x-2 transition-all duration-200"
              >
                <Sparkles className="w-5 h-5 text-[#FF8107]" />
                <span>Start 15-Day Free Trial</span>
              </motion.button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 max-w-xl">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[#FF8107] flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-700">Red Flag Detection</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[#FF8107] flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-700">Digital Pantry Logs</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[#FF8107] flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-700">Master Jar Labels</span>
              </div>
            </div>

          </motion.div>

          {/* Right Hero Image Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Main Rounded Bubble Visual */}
            <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-amber-500/20 to-orange-500/10 p-3 shadow-2xl border border-white/60">
              <div className="rounded-[24px] overflow-hidden relative aspect-square bg-gray-900">
                <img 
                  src={IMAGE_PRESETS.womanCanning1} 
                  alt="JarCheck Master Artisan Canning Specialist" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = CANNING_JAR_SVG_FALLBACK;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Floating Safety Badge Overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-[#0D0D0D] shadow-md flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5 text-[#FF8107]" />
                    <span>USDA NCHFP Compliant</span>
                  </span>
                  <span className="bg-[#FF8107] text-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                    100% Verified
                  </span>
                </div>

                {/* Bottom Card Overlay */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-xl text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF8107] font-bold">
                      pH
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0D0D0D]">Automatic pH & Acid Calc</h4>
                      <p className="text-xs text-gray-500">Calculates Water Bath vs Pressure Canner PSI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden sm:flex items-center space-x-3 z-20">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-gray-400 block uppercase">Protection Level</span>
                <span className="text-sm font-black text-[#0D0D0D]">JarCheck Certified Safe</span>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
