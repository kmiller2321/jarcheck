import React, { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Bot, Sparkles, Lock, X } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SafetyAnalyzer } from './components/SafetyAnalyzer';
import { DigitalPantry } from './components/DigitalPantry';
import { DigitalPantryTeaser } from './components/DigitalPantryTeaser';
import { WeeklyRecipe } from './components/WeeklyRecipe';
import { CommunityHub } from './components/CommunityHub';
import { AIChatAssistant } from './components/AIChatAssistant';
import { PricingSection } from './components/PricingSection';
import { Footer } from './components/Footer';
import { TrialModal } from './components/TrialModal';
import { AuthModal } from './components/AuthModal';
import { SubscriberDashboard } from './components/SubscriberDashboard';
import { INITIAL_PANTRY_BATCHES } from './data/usdaData';
import { CanningBatch } from './types';
import { supabase } from './lib/supabaseClient';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'HOME' | 'PANTRY' | 'COMMUNITY' | 'DASHBOARD'>('HOME');
  // Real gate: only true once a subscriber has actually completed Stripe Checkout.
  // (See SETUP.md "Known gaps" -- this is a best-effort browser flag, not a
  // verified server-side session, used for the public site's own gating.
  // The Dashboard below uses a real, server-verified subscription check instead.)
  const [isTrialActive, setIsTrialActive] = useState<boolean>(false);
  const [pantryBatches, setPantryBatches] = useState<CanningBatch[]>(INITIAL_PANTRY_BATCHES);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isTrialModalOpen, setIsTrialModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState<boolean>(false);
  const [isFloatingChatHidden, setIsFloatingChatHidden] = useState<boolean>(false);
  const [checkoutBanner, setCheckoutBanner] = useState<'success' | 'cancelled' | null>(null);

  // ---- Subscriber login / dashboard state ----
  const [session, setSession] = useState<Session | null>(null);
  const [isActiveSubscriber, setIsActiveSubscriber] = useState<boolean>(false);
  const [isStatusLoading, setIsStatusLoading] = useState<boolean>(false);
  const [dashboardPantryBatches, setDashboardPantryBatches] = useState<CanningBatch[]>([]);

  const subscriberEmail = session?.user?.email || null;

  // Helper: call our own API with the subscriber's Supabase auth token attached.
  const authFetch = useCallback(async (path: string, options: RequestInit = {}) => {
    const token = session?.access_token;
    return fetch(path, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }, [session]);

  // Restore/track the Supabase Auth session (magic-link login).
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === 'SIGNED_IN') {
        setIsAuthModalOpen(false);
        setCurrentPage('DASHBOARD');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Once logged in, check real subscription status + load the persisted online pantry.
  useEffect(() => {
    if (!session) {
      setIsActiveSubscriber(false);
      setDashboardPantryBatches([]);
      return;
    }

    setIsStatusLoading(true);
    authFetch('/api/account/status')
      .then((r) => r.json())
      .then((data) => setIsActiveSubscriber(!!data.isActiveSubscriber))
      .catch(() => setIsActiveSubscriber(false))
      .finally(() => setIsStatusLoading(false));

    authFetch('/api/account/pantry')
      .then((r) => r.json())
      .then((data) => setDashboardPantryBatches(data.batches || []))
      .catch(() => setDashboardPantryBatches([]));
  }, [session, authFetch]);

  const handleLogOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    setCurrentPage('HOME');
  };

  // Persisted online-pantry handlers used by the Dashboard (separate from
  // the public site's local-only pantry below).
  const handleDashboardAddBatch = async (batch: CanningBatch) => {
    setDashboardPantryBatches((prev) => [batch, ...prev]);
    await authFetch('/api/account/pantry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batch }),
    });
  };

  const handleDashboardUpdateBatch = async (batch: CanningBatch) => {
    setDashboardPantryBatches((prev) => prev.map((b) => (b.id === batch.id ? batch : b)));
    await authFetch('/api/account/pantry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batch }),
    });
  };

  const handleDashboardDeleteBatch = async (id: string) => {
    setDashboardPantryBatches((prev) => prev.filter((b) => b.id !== id));
    await authFetch(`/api/account/pantry?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  };

  // Restore trial status on this browser if they've already checked out,
  // and pick up the redirect back from Stripe Checkout.
  useEffect(() => {
    if (window.localStorage.getItem('jarcheck_trial_active') === 'true') {
      setIsTrialActive(true);
    }

    const params = new URLSearchParams(window.location.search);
    const checkoutResult = params.get('checkout');
    if (checkoutResult === 'success') {
      setIsTrialActive(true);
      window.localStorage.setItem('jarcheck_trial_active', 'true');
      setCheckoutBanner('success');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (checkoutResult === 'cancelled') {
      setCheckoutBanner('cancelled');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Smooth Navigation & Page Routing Handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);

    if (sectionId === 'pantry') {
      setCurrentPage('PANTRY');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'community') {
      setCurrentPage('COMMUNITY');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentPage !== 'HOME' && sectionId !== 'community' && sectionId !== 'pantry') {
      setCurrentPage('HOME');
    }

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  // Add new batch from analyzer or pantry form (public site, local-only)
  const handleAddBatch = (newBatch: CanningBatch) => {
    setPantryBatches((prev) => [newBatch, ...prev]);
    setCurrentPage('PANTRY');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBatch = (id: string) => {
    setPantryBatches((prev) => prev.filter((b) => b.id !== id));
  };

  const handleUpdateBatch = (updatedBatch: CanningBatch) => {
    setPantryBatches((prev) => prev.map((b) => (b.id === updatedBatch.id ? updatedBatch : b)));
  };

  // Quick save from Analyzer to Pantry
  const handleSaveBatchFromAnalyzer = (recipeTitle: string, processingMethod: string) => {
    const newBatch: CanningBatch = {
      id: `batch-${Date.now()}`,
      batchCode: `CP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      recipeName: recipeTitle || 'Custom Canning Recipe',
      canningDate: new Date().toISOString().split('T')[0],
      jarCount: 6,
      jarSize: 'Pint (16 oz)',
      processingMethod: processingMethod === 'PRESSURE_CANNER' ? 'Pressure Canner' : 'Water Bath Canner',
      psi: processingMethod === 'PRESSURE_CANNER' ? '11 PSI' : 'N/A (Water Bath)',
      headspace: processingMethod === 'PRESSURE_CANNER' ? '1 inch' : '1/2 inch',
      altitudeFeet: 650,
      phLevel: processingMethod === 'PRESSURE_CANNER' ? 5.2 : 3.8,
      status: 'Sealed & Shelf Ready',
      notes: 'Logged directly from Safety Shield analysis report.',
      expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      image: '/images/cans_on_shelf_1.png'
    };
    handleAddBatch(newBatch);
  };

  return (
    <div className="min-h-screen bg-white text-[#0D0D0D] font-sans antialiased selection:bg-[#FF8107]/20 selection:text-[#FF8107]">

      {/* Stripe Checkout Redirect Banner */}
      {checkoutBanner && (
        <div className={`w-full text-center text-xs font-bold py-2.5 px-4 ${checkoutBanner === 'success' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-200'}`}>
          {checkoutBanner === 'success' ? (
            <span>🎉 Trial activated! Your 15-day free trial has started — you won't be charged until Day 15.</span>
          ) : (
            <span>Checkout was cancelled — no charge was made. You can start your trial anytime.</span>
          )}
          <button onClick={() => setCheckoutBanner(null)} className="ml-3 underline">Dismiss</button>
        </div>
      )}

      {/* Sticky Top Navigation */}
      <Navbar
        isTrialActive={isTrialActive}
        onOpenTrialModal={() => setIsTrialModalOpen(true)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        subscriberEmail={subscriberEmail}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Page Content */}
      <main>
        {currentPage === 'HOME' ? (
          <>
            {/* A. Hero Section */}
            <HeroSection
              onStartAnalyze={() => handleNavigate('analyzer')}
              onOpenTrial={() => setIsTrialModalOpen(true)}
              onSelectPreset={() => handleNavigate('analyzer')}
            />

            {/* B. Safety Analyzer Section */}
            <SafetyAnalyzer
              onSaveBatch={handleSaveBatchFromAnalyzer}
              isTrialActive={isTrialActive}
              onOpenTrialModal={() => setIsTrialModalOpen(true)}
            />

            {/* C. Digital Pantry Teaser & Summary (Home Page) */}
            <DigitalPantryTeaser
              onGoToPantry={() => {
                setCurrentPage('PANTRY');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenTrialModal={() => setIsTrialModalOpen(true)}
              isTrialActive={isTrialActive}
            />

            {/* D. AI Weekly Recipe Section (current recipe is free; archive stays gated) */}
            <WeeklyRecipe
              isTrialActive={isTrialActive}
              onOpenTrialModal={() => setIsTrialModalOpen(true)}
            />
          </>
        ) : currentPage === 'PANTRY' ? (
          /* PAGE 2: DEDICATED DIGITAL PANTRY PAGE */
          <div className="bg-gray-50 min-h-screen">
            <DigitalPantry
              batches={pantryBatches}
              onAddBatch={handleAddBatch}
              onDeleteBatch={handleDeleteBatch}
              onUpdateBatch={handleUpdateBatch}
            />
          </div>
        ) : currentPage === 'COMMUNITY' ? (
          /* PAGE 3: COMMUNITY HUB */
          <CommunityHub
            isTrialActive={isTrialActive}
            onOpenTrialModal={() => setIsTrialModalOpen(true)}
          />
        ) : (
          /* PAGE 4: SUBSCRIBER DASHBOARD -- fully unlocked, no paywall */
          <div className="bg-gray-50 min-h-screen">
            {subscriberEmail ? (
              <SubscriberDashboard
                subscriberEmail={subscriberEmail}
                isActiveSubscriber={isActiveSubscriber}
                isStatusLoading={isStatusLoading}
                pantryBatches={dashboardPantryBatches}
                onAddBatch={handleDashboardAddBatch}
                onUpdateBatch={handleDashboardUpdateBatch}
                onDeleteBatch={handleDashboardDeleteBatch}
                onLogOut={handleLogOut}
                onOpenTrialModal={() => setIsTrialModalOpen(true)}
              />
            ) : (
              <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
                <div className="max-w-md w-full text-center bg-white border border-gray-100 shadow-xl rounded-[32px] p-10">
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Log In to View Your Dashboard</h2>
                  <p className="text-sm text-gray-500 font-medium mb-6">You're not logged in yet.</p>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full bg-[#FF8107] hover:bg-[#e06f00] text-white py-4 rounded-full text-base font-black shadow-xl shadow-[#FF8107]/30"
                  >
                    Log In
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* E. 15-Day Trial & Pricing Section (skip on Dashboard) */}
        {currentPage !== 'DASHBOARD' && (
          <PricingSection
            onOpenTrialModal={() => setIsTrialModalOpen(true)}
            isTrialActive={isTrialActive}
          />
        )}
      </main>

      {/* Footer & Mandatory Safety Disclaimer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating AI Canner Assistant Button */}
      {!isFloatingChatHidden && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-1">
          <button
            onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
            className="group relative flex items-center space-x-2 bg-[#0D0D0D] hover:bg-gray-800 text-white px-4 py-3.5 rounded-full shadow-2xl border-2 border-[#FF8107]/50 transition-all duration-300 transform hover:scale-105"
          >
            <div className="w-8 h-8 rounded-full bg-[#FF8107] flex items-center justify-center text-white font-bold shadow-md">
              <Bot className="w-5 h-5" />
            </div>

            <div className="text-left hidden sm:block pr-1">
              <div className="text-xs font-black leading-tight flex items-center space-x-1">
                <span>Ask Master Canner AI</span>
                {!isTrialActive && <Lock className="w-3 h-3 text-amber-400" />}
              </div>
              <div className="text-[10px] text-gray-300 font-medium">24/7 USDA Safety Guide</div>
            </div>

            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8107] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#FF8107]"></span>
            </span>
          </button>

          {/* Direct Dismiss Button */}
          <button
            onClick={() => setIsFloatingChatHidden(true)}
            className="p-2 bg-gray-900/90 hover:bg-black text-gray-400 hover:text-white rounded-full border border-gray-700 shadow-md transition-all text-xs"
            title="Hide AI Canner Widget"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating AI Chat Modal Popup */}
      {isFloatingChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl my-auto">
            <AIChatAssistant
              isTrialActive={isTrialActive}
              onOpenTrialModal={() => {
                setIsFloatingChatOpen(false);
                setIsTrialModalOpen(true);
              }}
              isOpen={isFloatingChatOpen}
              onClose={() => setIsFloatingChatOpen(false)}
              onHide={() => {
                setIsFloatingChatOpen(false);
                setIsFloatingChatHidden(true);
              }}
            />
          </div>
        </div>
      )}

      {/* 15-Day Free Trial Modal */}
      <TrialModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
        onActivateTrial={() => setIsTrialModalOpen(true)}
      />

      {/* Subscriber Log In Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}
