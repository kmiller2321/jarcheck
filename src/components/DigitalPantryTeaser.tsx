import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Package, ShieldCheck, QrCode, ArrowRight, Lock, 
  Printer, CheckCircle2, Calendar, Sparkles, ExternalLink 
} from 'lucide-react';
import { CanningBatch } from '../types';
import { INITIAL_PANTRY_BATCHES } from '../data/usdaData';
import { JarLabelModal } from './JarLabelModal';

interface DigitalPantryTeaserProps {
  onGoToPantry: () => void;
  onOpenTrialModal: () => void;
  isTrialActive: boolean;
}

export const DigitalPantryTeaser: React.FC<DigitalPantryTeaserProps> = ({
  onGoToPantry,
  onOpenTrialModal,
  isTrialActive
}) => {
  const [selectedBatchForLabel, setSelectedBatchForLabel] = useState<CanningBatch | null>(null);

  // Take first 3 sample batches to demonstrate pantry functionality
  const sampleBatches = INITIAL_PANTRY_BATCHES.slice(0, 3);

  return (
    <section id="pantry-summary" className="py-16 md:py-24 bg-gray-50/80 relative text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header & Feature Summary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-[#FF8107]/10 border border-[#FF8107]/20 px-3.5 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4 text-[#FF8107]" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF8107]">
                JarCheck Digital Pantry
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D0D0D] tracking-tight">
              Cloud Inventory & Scannable QR Jar Labels
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
              Every subscriber gets a private Digital Pantry log to store canning dates, jar counts, processing methods, headspace, and pH levels. Print scannable QR lid stickers so anyone who receives your jars can verify their safety audit!
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onGoToPantry}
              className="px-6 py-3.5 rounded-2xl bg-[#0D0D0D] hover:bg-gray-800 text-white text-xs sm:text-sm font-bold shadow-lg flex items-center space-x-2 transition-all"
            >
              <Package className="w-4 h-4 text-[#FF8107]" />
              <span>Explore Full Digital Pantry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subscription / Personal Pantry Notification Callout Banner */}
        <div className="bg-gradient-to-r from-[#0D0D0D] via-gray-900 to-black rounded-[32px] p-6 sm:p-8 text-white shadow-2xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-left relative z-10 max-w-2xl">
            <div className="flex items-center space-x-2 text-[#FF8107]">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-wider">Subscriber Exclusive Feature</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Get Your Own Personal Digital Pantry
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
              Sign up for a JarCheck subscription to activate your private pantry. All your batch notes, expiration countdowns, jar inventories, and scannable QR lid labels remain securely saved in your account forever.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10 w-full md:w-auto">
            <button
              onClick={onOpenTrialModal}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#FF8107] hover:bg-[#e06f00] text-white text-xs sm:text-sm font-extrabold rounded-full shadow-lg shadow-[#FF8107]/25 flex items-center justify-center space-x-2 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>{isTrialActive ? 'Manage Subscription' : 'Start 15-Day Free Trial'}</span>
            </button>
            <button
              onClick={onGoToPantry}
              className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-full border border-white/20 transition-all text-center"
            >
              View Sample Pantry
            </button>
          </div>
        </div>

        {/* Sample Pantry Batches Demonstration Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
              Sample Pantry Log Previews:
            </span>
            <span className="text-xs text-[#FF8107] font-bold">
              3 Example Batches Shown
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleBatches.map((batch) => (
              <motion.div
                key={batch.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-[28px] overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <img
                      src={batch.image || '/images/cans_on_shelf_1.png'}
                      alt={batch.recipeName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/20">
                      {batch.batchCode}
                    </span>

                    <span className="absolute bottom-3 left-3 bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                      {batch.status}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h4 className="text-base font-black text-[#0D0D0D] leading-snug">
                        {batch.recipeName}
                      </h4>
                      <div className="flex items-center space-x-1.5 text-xs text-gray-400 font-semibold mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Canned on {batch.canningDate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-gray-50 p-2.5 rounded-xl border border-gray-100 font-semibold text-gray-700">
                      <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Jars</span>{batch.jarCount} ({batch.jarSize.split(' ')[0]})</div>
                      <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Method</span>{batch.processingMethod}</div>
                      <div><span className="text-gray-400 font-bold block text-[9px] uppercase">PSI</span>{batch.psi}</div>
                      <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Headspace</span>{batch.headspace}</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedBatchForLabel(batch)}
                    className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-[#FF8107] text-[#0D0D0D] hover:text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View & Print QR Label</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Printable Jar Label Modal Preview */}
      {selectedBatchForLabel && (
        <JarLabelModal
          batch={selectedBatchForLabel}
          onClose={() => setSelectedBatchForLabel(null)}
        />
      )}
    </section>
  );
};
