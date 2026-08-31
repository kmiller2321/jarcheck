import React, { useState } from 'react';
import { Sparkles, Lock, Users, Menu, X, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JarCheckLogo } from './JarCheckLogo';

interface NavbarProps {
  isTrialActive: boolean;
  onOpenTrialModal: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  currentPage: 'HOME' | 'PANTRY' | 'COMMUNITY' | 'DASHBOARD';
  setCurrentPage: (page: 'HOME' | 'PANTRY' | 'COMMUNITY' | 'DASHBOARD') => void;
  subscriberEmail: string | null;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isTrialActive,
  onOpenTrialModal,
  onNavigate,
  activeSection,
  currentPage,
  setCurrentPage,
  subscriberEmail,
  onOpenAuthModal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNavigate = (page: 'HOME' | 'PANTRY' | 'COMMUNITY' | 'DASHBOARD', sectionId: string) => {
    setCurrentPage(page);
    onNavigate(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 rounded-b-[24px] shadow-lg shadow-black/5 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => {
            setCurrentPage('HOME');
            onNavigate('hero');
            setIsMobileMenuOpen(false);
          }}
          className="cursor-pointer group shrink-0"
        >
          <JarCheckLogo size="md" variant="light" showTagline={true} />
        </div>

        {/* Desktop Navigation Bar */}
        <nav className="hidden md:flex items-center space-x-1 bg-gray-100 p-1.5 rounded-full border border-gray-200/80 shadow-inner max-w-full mx-2">
          <button
            onClick={() => {
              setCurrentPage('HOME');
              onNavigate('analyzer');
            }}
            className={`px-3.5 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-extrabold transition-all duration-200 whitespace-nowrap ${
              currentPage === 'HOME' && activeSection === 'analyzer'
                ? 'bg-white text-[#0D0D0D] shadow-md border border-gray-200/50'
                : 'text-gray-600 hover:text-[#0D0D0D] hover:bg-white/50'
            }`}
          >
            Safety Analyzer
          </button>

          <button
            onClick={() => {
              setCurrentPage('PANTRY');
              onNavigate('pantry');
            }}
            className={`px-3.5 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-extrabold transition-all duration-200 whitespace-nowrap ${
              currentPage === 'PANTRY' || (currentPage === 'HOME' && activeSection === 'pantry')
                ? 'bg-white text-[#0D0D0D] shadow-md border border-gray-200/50'
                : 'text-gray-600 hover:text-[#0D0D0D] hover:bg-white/50'
            }`}
          >
            Digital Pantry
          </button>

          <button
            onClick={() => {
              setCurrentPage('HOME');
              onNavigate('weekly-recipe');
            }}
            className={`px-3.5 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-extrabold transition-all duration-200 whitespace-nowrap flex items-center space-x-1.5 ${
              currentPage === 'HOME' && activeSection === 'weekly-recipe'
                ? 'bg-white text-[#0D0D0D] shadow-md border border-gray-200/50'
                : 'text-gray-600 hover:text-[#0D0D0D] hover:bg-white/50'
            }`}
          >
            <span>Weekly Recipe</span>
          </button>

          <button
            onClick={() => {
              setCurrentPage('COMMUNITY');
              onNavigate('community');
            }}
            className={`px-3.5 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-extrabold transition-all duration-200 whitespace-nowrap flex items-center space-x-1.5 ${
              currentPage === 'COMMUNITY' || activeSection === 'community'
                ? 'bg-white text-[#0D0D0D] shadow-md border border-gray-200/50'
                : 'text-gray-600 hover:text-[#0D0D0D] hover:bg-white/50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#FF8107]" />
            <span>Community Hub</span>
          </button>
        </nav>

        {/* Desktop Trial Status / CTA Button */}
        <div className="hidden md:flex items-center space-x-3 shrink-0">
          {subscriberEmail ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('DASHBOARD')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md flex items-center space-x-2 transition-all duration-200 ${
                currentPage === 'DASHBOARD'
                  ? 'bg-[#0D0D0D] text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25'
              }`}
            >
              <UserCircle2 className="w-4 h-4" />
              <span>My Dashboard</span>
            </motion.button>
          ) : (
            <>
              <button
                onClick={onOpenAuthModal}
                className="text-xs sm:text-sm font-bold text-gray-600 hover:text-[#0D0D0D] transition-colors px-2"
              >
                Log In
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenTrialModal}
                className="bg-[#FF8107] hover:bg-[#e06f00] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-[#FF8107]/25 flex items-center space-x-2 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Free Trial</span>
              </motion.button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors focus:outline-none border border-gray-200"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#0D0D0D]" />
            ) : (
              <Menu className="w-6 h-6 text-[#0D0D0D]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white/98 border-t border-gray-200 px-4 pt-3 pb-6 space-y-2 shadow-2xl rounded-b-[24px]"
          >
            <div className="flex flex-col space-y-1.5 p-1 bg-gray-50 rounded-2xl border border-gray-200">
              <button
                onClick={() => handleMobileNavigate('HOME', 'analyzer')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between ${
                  currentPage === 'HOME' && activeSection === 'analyzer'
                    ? 'bg-white text-[#0D0D0D] shadow-sm border border-gray-200'
                    : 'text-gray-700 hover:bg-white/80'
                }`}
              >
                <span>Safety Analyzer</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">USDA Engine</span>
              </button>

              <button
                onClick={() => handleMobileNavigate('PANTRY', 'pantry')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between ${
                  currentPage === 'PANTRY'
                    ? 'bg-white text-[#0D0D0D] shadow-sm border border-gray-200'
                    : 'text-gray-700 hover:bg-white/80'
                }`}
              >
                <span>Digital Pantry</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Inventory & QR</span>
              </button>

              <button
                onClick={() => handleMobileNavigate('HOME', 'weekly-recipe')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between ${
                  currentPage === 'HOME' && activeSection === 'weekly-recipe'
                    ? 'bg-white text-[#0D0D0D] shadow-sm border border-gray-200'
                    : 'text-gray-700 hover:bg-white/80'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>Weekly Recipe</span>
                </div>
                <span className="text-[10px] text-amber-600 font-extrabold uppercase">Archive Search</span>
              </button>

              <button
                onClick={() => handleMobileNavigate('COMMUNITY', 'community')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between ${
                  currentPage === 'COMMUNITY' || activeSection === 'community'
                    ? 'bg-white text-[#0D0D0D] shadow-sm border border-gray-200'
                    : 'text-gray-700 hover:bg-white/80'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#FF8107]" />
                  <span>Community Hub</span>
                </div>
                <span className="text-[10px] text-orange-600 font-extrabold uppercase">Q&A & AI Chat</span>
              </button>
            </div>

            <div className="pt-2 space-y-2">
              {subscriberEmail ? (
                <button
                  onClick={() => handleMobileNavigate('DASHBOARD', 'dashboard')}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all"
                >
                  <UserCircle2 className="w-4 h-4" />
                  <span>My Dashboard</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onOpenTrialModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-[#FF8107] hover:bg-[#e06f00] text-white py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-[#FF8107]/25 flex items-center justify-center space-x-2 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Start 15-Day Free Trial</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuthModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-gray-600 py-3 rounded-2xl text-xs font-black flex items-center justify-center space-x-2"
                  >
                    <span>Already a subscriber? Log In</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};


