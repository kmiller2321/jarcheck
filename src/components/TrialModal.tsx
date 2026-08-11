import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateTrial: () => void;
}

export const TrialModal: React.FC<TrialModalProps> = ({
  isOpen,
  onClose,
  onActivateTrial
}) => {
  if (!isOpen) return null;

  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [optInWeeklyEmail, setOptInWeeklyEmail] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Record the subscriber & send the welcome email (best-effort).
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, optInWeeklyEmail })
      });
    } catch (e) {
      console.warn('Newsletter subscription error:', e);
    }

    // Start the real Stripe subscription (15-day trial, card required up front).
    try {
      const checkoutRes = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const checkoutData = await checkoutRes.json();

      if (checkoutRes.ok && checkoutData.url) {
        window.location.href = checkoutData.url;
        return;
      }

      console.warn('Stripe checkout unavailable:', checkoutData.error);
    } catch (e) {
      console.warn('Stripe checkout error:', e);
    }

    // Fallback: if Stripe isn't configured yet, still unlock the trial locally
    // so the demo/site remains functional while billing is being set up.
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      onActivateTrial();
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-[36px] max-w-lg w-full p-8 shadow-2xl relative text-left border border-gray-100 space-y-6"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-[#0D0D0D]">15-Day Trial Activated!</h3>
            <p className="text-sm font-medium text-gray-600">
              Welcome to jarcheck. All safety tools, pantry logs, and master recipes are now fully unlocked.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF8107] text-white flex items-center justify-center shadow-lg shadow-[#FF8107]/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0D0D0D]">
                Start Your 15-Day Free Trial
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                Try jarcheck risk-free. No commitment, cancel anytime in 1 click.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/70 border border-[#FF8107]/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span>Today (Day 1)</span>
                <span className="text-[#FF8107] font-black">$0.00 FREE</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span>Day 15</span>
                <span>$9.99 / month</span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs font-bold text-gray-800">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF8107]" />
                <span>Unlimited USDA Recipe Safety Shield Calculations</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF8107]" />
                <span>Cloud Pantry Log Storage & Master CSV Exports</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF8107]" />
                <span>Full Search Access to Past Archived Weekly Recipes</span>
              </li>
            </ul>

            {/* Email & Opt-In Form */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  Email Address for Account & Weekly Updates
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#FF8107] focus:border-transparent outline-none"
                />
              </div>

              <label className="flex items-start space-x-2.5 cursor-pointer bg-orange-50/50 p-2.5 rounded-xl border border-orange-200/60">
                <input
                  type="checkbox"
                  checked={optInWeeklyEmail}
                  onChange={(e) => setOptInWeeklyEmail(e.target.checked)}
                  className="mt-0.5 rounded text-[#FF8107] focus:ring-[#FF8107]"
                />
                <div className="text-[11px] leading-tight">
                  <span className="font-extrabold text-gray-900 block">Opt-in to Weekly Free Recipe Email</span>
                  <span className="text-gray-600 font-medium">Receive our newest USDA tested recipe automatically in your inbox every week!</span>
                </div>
              </label>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-500 font-bold text-center">{errorMessage}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="w-full bg-[#FF8107] hover:bg-[#e06f00] text-white py-4 rounded-full text-base font-black shadow-xl shadow-[#FF8107]/30 flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Redirecting to secure checkout…' : 'Continue to Secure Checkout'}</span>
              {!isSubmitting && <ArrowRight className="w-5 h-5" />}
            </motion.button>

            <p className="text-[10px] text-center text-gray-400 font-semibold">
              Card required to start your trial. You won't be charged until Day 15. Cancel anytime before then to pay nothing. By continuing, you agree to our{' '}
              <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Terms</a>
              {' '}and{' '}
              <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Privacy Policy</a>.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};
