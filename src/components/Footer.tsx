import React, { useState } from 'react';
import { Flame, HeartHandshake, AlertTriangle } from 'lucide-react';
import { JarCheckLogo } from './JarCheckLogo';
import { ShareSection } from './ShareSection';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [isManagingBilling, setIsManagingBilling] = useState(false);

  const handleManageBilling = async () => {
    const email = window.prompt('Enter the email you subscribed with to manage your billing:');
    if (!email) return;

    setIsManagingBilling(true);
    try {
      const res = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        window.alert(data.error || 'No subscription found for that email.');
      }
    } catch (e) {
      window.alert('Something went wrong opening the billing portal.');
    } finally {
      setIsManagingBilling(false);
    }
  };

  return (
    <footer className="bg-[#080808] text-gray-400 text-left border-t border-gray-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('hero')}>
              <JarCheckLogo size="md" variant="dark" showTagline={true} />
            </div>

            <p className="text-xs text-gray-400 max-w-sm leading-relaxed font-normal">
              The premier AI-assisted USDA food safety platform designed for safe home canning, jam making, pickling, and pressure canning.
            </p>

            <div className="flex items-center space-x-2 text-xs font-bold text-gray-300">
              <Flame className="w-4 h-4 text-[#FF8107]" />
              <span>USDA NCHFP Scientific Safety Engine</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-widest">Platform</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button onClick={() => onNavigate('analyzer')} className="hover:text-white transition-colors">
                  Safety Shield Analyzer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pantry')} className="hover:text-white transition-colors">
                  Digital Pantry Cloud Logs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('weekly-recipe')} className="hover:text-white transition-colors">
                  Weekly Tested Recipe
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">
                  15-Day Free Trial
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-widest">Safety Guidelines</h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-400">
              <li>USDA Complete Guide to Home Canning</li>
              <li>National Center for Home Food Preservation</li>
              <li>Acidification & pH Safety Thresholds</li>
              <li>Altitude Pressure Adjustment Rules</li>
            </ul>
          </div>

        </div>

        <div className="p-6 rounded-3xl bg-gray-950 border border-gray-800 space-y-2">
          <div className="flex items-center space-x-2 text-[#FF8107]">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider">Mandatory Safety Disclaimer</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-normal">
            JarCheck provides recipe safety analysis based on published USDA and National Center for Home Food Preservation (NCHFP) guidelines. Never alter tested acidity ratios, thickeners, or density parameters in home canning. Home canners assume full responsibility for following proper sterilization, headspace, seal inspection, and processing procedures.
          </p>
        </div>

        <ShareSection />

        <div className="border-t border-gray-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} JarCheck. All Rights Reserved.</p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <a href="/privacy.html" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="/terms.html" className="hover:text-white transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="/usda-safety-standards.html" className="hover:text-white transition-colors">USDA Safety Standards</a>
            <span>•</span>
            <button onClick={handleManageBilling} disabled={isManagingBilling} className="hover:text-white transition-colors underline decoration-dotted">
              {isManagingBilling ? 'Loading…' : 'Manage Subscription'}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};