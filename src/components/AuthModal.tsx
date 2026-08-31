import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Mail, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { supabase, isAuthConfigured } from '../lib/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendLink = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!supabase) {
      setErrorMessage("Login isn't set up yet on this site -- please check back soon.");
      return;
    }

    setErrorMessage(null);
    setIsSending(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: { emailRedirectTo: window.location.origin },
    });

    setIsSending(false);

    if (error) {
      setErrorMessage(error.message || 'Something went wrong sending your login link.');
      return;
    }

    setIsSent(true);
  };

  const handleClose = () => {
    setIsSent(false);
    setEmail('');
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-6 sm:p-8 relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSent ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-[#FF8107]/10 flex items-center justify-center mb-5">
              <Mail className="w-7 h-7 text-[#FF8107]" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1.5">Subscriber Log In</h2>
            <p className="text-sm text-gray-500 font-medium mb-6">
              Enter the email you subscribed with -- we'll send you a magic link, no password needed.
            </p>

            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendLink()}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-[#FF8107] focus:ring-2 focus:ring-[#FF8107]/20 outline-none text-sm font-medium mb-4"
            />

            {errorMessage && (
              <p className="text-xs text-red-500 font-bold text-center mb-4">{errorMessage}</p>
            )}
            {!isAuthConfigured && (
              <p className="text-xs text-amber-600 font-bold text-center mb-4">
                Heads up: login isn't configured on this deployment yet.
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendLink}
              disabled={isSending}
              className="w-full bg-[#FF8107] hover:bg-[#e06f00] text-white py-4 rounded-full text-base font-black shadow-xl shadow-[#FF8107]/30 flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Send Login Link</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9 text-emerald-500" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Check Your Inbox</h2>
            <p className="text-sm text-gray-500 font-medium">
              We sent a login link to <span className="font-bold text-gray-800">{email}</span>. Click it to open your dashboard -- you can close this window.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
