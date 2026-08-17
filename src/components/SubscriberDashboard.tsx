import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Archive, Users, PackageSearch, LogOut, CreditCard, Loader2, Sparkles } from 'lucide-react';
import { SafetyAnalyzer } from './SafetyAnalyzer';
import { DigitalPantry } from './DigitalPantry';
import { WeeklyRecipeArchive } from './WeeklyRecipeArchive';
import { CommunityHub } from './CommunityHub';
import { CanningBatch } from '../types';

type DashboardTab = 'ANALYZER' | 'PANTRY' | 'ARCHIVE' | 'COMMUNITY';

interface SubscriberDashboardProps {
  subscriberEmail: string;
  isActiveSubscriber: boolean;
  isStatusLoading: boolean;
  pantryBatches: CanningBatch[];
  onAddBatch: (batch: CanningBatch) => void;
  onUpdateBatch: (batch: CanningBatch) => void;
  onDeleteBatch: (id: string) => void;
  onLogOut: () => void;
  onOpenTrialModal: () => void;
  initialTab?: DashboardTab;
}

const TABS: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
  { id: 'ANALYZER', label: 'Recipe Analyzer', icon: ShieldCheck },
  { id: 'PANTRY', label: 'My Online Pantry', icon: PackageSearch },
  { id: 'ARCHIVE', label: 'Recipe Archive', icon: Archive },
  { id: 'COMMUNITY', label: 'Community Hub', icon: Users },
];

export const SubscriberDashboard: React.FC<SubscriberDashboardProps> = ({
  subscriberEmail,
  isActiveSubscriber,
  isStatusLoading,
  pantryBatches,
  onAddBatch,
  onUpdateBatch,
  onDeleteBatch,
  onLogOut,
  onOpenTrialModal,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab || 'ANALYZER');
  const [isManagingBilling, setIsManagingBilling] = useState(false);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const handleManageBilling = async () => {
    setIsManagingBilling(true);
    try {
      const res = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscriberEmail }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        window.alert(data.error || 'No active subscription found for that email.');
      }
    } catch (e) {
      window.alert('Something went wrong opening the billing portal.');
    } finally {
      setIsManagingBilling(false);
    }
  };

  if (isStatusLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF8107]" />
        <span className="text-sm font-semibold">Loading your account...</span>
      </div>
    );
  }

  if (!isActiveSubscriber) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center bg-white border border-gray-100 shadow-xl rounded-[32px] p-10">
          <div className="w-16 h-16 rounded-2xl bg-[#FF8107]/10 flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-8 h-8 text-[#FF8107]" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">You're Logged In!</h2>
          <p className="text-sm text-gray-500 font-medium mb-6">
            Signed in as <span className="font-bold text-gray-800">{subscriberEmail}</span>, but this email doesn't have an active subscription yet. Start your 15-day free trial to unlock your dashboard -- unlimited recipe analysis, your online pantry, the full recipe archive, and the community hub.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenTrialModal}
            className="w-full bg-[#FF8107] hover:bg-[#e06f00] text-white py-4 rounded-full text-base font-black shadow-xl shadow-[#FF8107]/30 mb-3"
          >
            Start Free Trial
          </motion.button>
          <button onClick={onLogOut} className="text-xs font-bold text-gray-400 hover:text-gray-600">
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#FF8107]">Subscriber Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">Welcome back!</h1>
          <p className="text-sm text-gray-500 font-medium">{subscriberEmail} - Full access unlocked, nothing paywalled</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleManageBilling}
            disabled={isManagingBilling}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-full border border-gray-200 text-xs font-bold text-gray-600 hover:border-gray-300 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            <span>{isManagingBilling ? 'Loading...' : 'Manage Billing'}</span>
          </button>
          <button
            onClick={onLogOut}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-full border border-gray-200 text-xs font-bold text-gray-600 hover:border-gray-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? 'bg-[#0D0D0D] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === 'ANALYZER' && (
          <SafetyAnalyzer
            onSaveBatch={(recipeTitle, processingMethod) => {
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
              };
              onAddBatch(newBatch);
              setActiveTab('PANTRY');
            }}
            isTrialActive={true}
            onOpenTrialModal={onOpenTrialModal}
          />
        )}

        {activeTab === 'PANTRY' && (
          <DigitalPantry
            batches={pantryBatches}
            onAddBatch={onAddBatch}
            onUpdateBatch={onUpdateBatch}
            onDeleteBatch={onDeleteBatch}
          />
        )}

        {activeTab === 'ARCHIVE' && (
          <div className="bg-[#0D0D0D] rounded-[36px] p-6 sm:p-10">
            <WeeklyRecipeArchive isTrialActive={true} onOpenTrialModal={onOpenTrialModal} />
          </div>
        )}

        {activeTab === 'COMMUNITY' && (
          <CommunityHub isTrialActive={true} onOpenTrialModal={onOpenTrialModal} />
        )}
      </div>
    </div>
  );
};