import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Hammer, X } from 'lucide-react';

const DISMISS_KEY = 'jarcheck_construction_notice_dismissed';

export const ConstructionNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const alreadyDismissed = window.sessionStorage.getItem(DISMISS_KEY) === 'true';
    if (!alreadyDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    window.sessionStorage.setItem(DISMISS_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-6 sm:p-8 relative text-center"
      >
        <button
          onClick={handleDismiss}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-[#FF8107]/10 flex items-center justify-center mx-auto mb-5">
          <Hammer className="w-7 h-7 text-[#FF8107]" />
        </div>

        <h2 className="text-xl font-black text-gray-900 mb-2">Thanks for stopping by early!</h2>
        <p className="text-sm text-gray-500 font-medium mb-6 leading-relaxed">
          JarCheck is still being built and polished behind the scenes. Things may look or work a little different as we finish up -- check back soon for the complete experience!
        </p>

        <button
          onClick={handleDismiss}
          className="w-full bg-[#FF8107] hover:bg-[#e06f00] text-white py-3.5 rounded-full text-sm font-black shadow-lg shadow-[#FF8107]/30 transition-colors"
        >
          Got it, let's take a look!
        </button>
      </motion.div>
    </div>
  );
};