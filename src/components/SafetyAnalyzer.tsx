import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Sparkles, Loader2, AlertCircle, FileText, CheckCircle2, Flame, RefreshCw, Lock } from 'lucide-react';
import { PRESET_RECIPES } from '../data/usdaData';
import { SafetyAnalysisResult } from '../types';
import { SafetyShieldResult } from './SafetyShieldResult';

interface SafetyAnalyzerProps {
  onSaveBatch: (title: string, method: string) => void;
  presetToLoad?: string;
  isTrialActive: boolean;
  onOpenTrialModal: () => void;
}

const FREE_ANALYSIS_LIMIT = 3;
const FREE_ANALYSIS_STORAGE_KEY = 'jarcheck_free_analyses_used';

export const SafetyAnalyzer: React.FC<SafetyAnalyzerProps> = ({ onSaveBatch, presetToLoad, isTrialActive, onOpenTrialModal }) => {
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeText, setRecipeText] = useState('');
  const [selectedJarSize, setSelectedJarSize] = useState<string>('Pint (16 oz)');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SafetyAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [freeAnalysesUsed, setFreeAnalysesUsed] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const stored = parseInt(window.localStorage.getItem(FREE_ANALYSIS_STORAGE_KEY) || '0', 10);
    return Number.isNaN(stored) ? 0 : stored;
  });
  const freeAnalysesRemaining = Math.max(0, FREE_ANALYSIS_LIMIT - freeAnalysesUsed);

  const jarSizeOptions = [
    { label: '1/2 Pint (8 oz)', sub: 'Jams, Jellies & Spreads' },
    { label: 'Pint (16 oz)', sub: 'Salsas, Pickles & Relish' },
    { label: 'Quart (32 oz)', sub: 'Whole Fruits, Soups & Tomatoes' },
    { label: 'Half Gallon (64 oz)', sub: 'Clear High-Acid Juices Only' },
    { label: 'Gallon (128 oz)', sub: 'Not USDA Approved' },
  ];

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_RECIPES.find((p) => p.id === presetId);
    if (preset) {
      setRecipeTitle(preset.title);
      setRecipeText(preset.recipeText);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!recipeText.trim()) {
      setError('Please paste or type a canning recipe to analyze.');
      return;
    }

    // Real subscribers get unlimited use. Everyone else gets
    // FREE_ANALYSIS_LIMIT real analyses before we ask them to start
    // the free trial -- presets and typing are always free to try.
    if (!isTrialActive && freeAnalysesRemaining <= 0) {
      onOpenTrialModal();
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: recipeTitle || 'Custom Canning Recipe',
          recipeText,
          jarSize: selectedJarSize,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis request failed.');
      }

      const data: SafetyAnalysisResult = await response.json();

      // Count this against the free allotment, unless they're a full subscriber.
      if (!isTrialActive) {
        const nextCount = freeAnalysesUsed + 1;
        setFreeAnalysesUsed(nextCount);
        window.localStorage.setItem(FREE_ANALYSIS_STORAGE_KEY, String(nextCount));
      }

      // Simulate smooth loading animation for Safety Shield calculation
      setTimeout(() => {
        setAnalysisResult(data);
        setIsAnalyzing(false);
      }, 800);
    } catch (err) {
      console.error('Safety analyzer error:', err);
      // Local fallback in case of network issue
      setTimeout(() => {
        import('../data/usdaData').then(({ scanRecipeUSDA }) => {
          const fallback = scanRecipeUSDA(recipeTitle, recipeText, selectedJarSize);
          setAnalysisResult(fallback);
          setIsAnalyzing(false);
          if (!isTrialActive) {
            const nextCount = freeAnalysesUsed + 1;
            setFreeAnalysesUsed(nextCount);
            window.localStorage.setItem(FREE_ANALYSIS_STORAGE_KEY, String(nextCount));
          }
        });
      }, 800);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setRecipeTitle('');
    setRecipeText('');
    setError(null);
  };

  return (
    <section id="analyzer" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background Soft Orange Gradient Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#FF8107]/10 via-[#FFB267]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-orange-50 border border-[#FF8107]/30 px-4 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-[#FF8107]" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF8107]">
              USDA Safety Scanner Engine
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0D0D0D] tracking-tight">
            Safety Shield Recipe Analyzer
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-normal">
            Paste any home canning recipe below. Our algorithm scans for red-flag thickeners, low-acid hazards, missing acidifiers, and calculates exact PSI & headspace requirements.
          </p>
        </div>

        {/* Content View: Form or Results or Loading */}
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            /* Loading State Animation */
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto bg-white rounded-[32px] p-12 shadow-2xl border border-gray-100 text-center space-y-6"
            >
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#FF8107]/20 animate-ping" />
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FF8107] to-amber-500 flex items-center justify-center text-white shadow-xl shadow-[#FF8107]/30">
                  <ShieldCheck className="w-12 h-12 stroke-[2.5] animate-bounce" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#0D0D0D]">Evaluating Safety Shield...</h3>
                <p className="text-sm font-medium text-gray-500">
                  Scanning for low-acid veggies, butter, flour, and botulism risks...
                </p>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="bg-[#FF8107] h-full rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </motion.div>
          ) : analysisResult ? (
            /* Results View */
            <SafetyShieldResult
              key="result"
              result={analysisResult}
              onReset={handleReset}
              onSaveToPantry={() => onSaveBatch(analysisResult.recipeTitle, analysisResult.processingMethod)}
            />
          ) : (
            /* Input Form View */
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto bg-white rounded-[32px] p-6 sm:p-10 shadow-xl border border-gray-100 text-left space-y-6"
            >
              {/* Preset Loader Bar */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400 block">
                  Click a Preset Recipe to Test Safety Scanner:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_RECIPES.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.id)}
                      className="px-3.5 py-2 rounded-2xl bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-[#FF8107]/40 text-xs font-bold text-gray-800 transition-all duration-200 flex items-center space-x-1.5"
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        preset.badge === 'SAFE' ? 'bg-emerald-500' :
                        preset.badge === 'WARNING' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span>{preset.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipe Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#0D0D0D] block">
                  Recipe Title (Optional)
                </label>
                <input
                  type="text"
                  value={recipeTitle}
                  onChange={(e) => setRecipeTitle(e.target.value)}
                  placeholder="e.g., Grandma's Spiced Berry Preserves"
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#FF8107]/20 focus:border-[#FF8107] text-sm font-semibold text-[#0D0D0D] transition-all"
                />
              </div>

              {/* Target Jar Size Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-[#0D0D0D] block">
                    Target Jar Size (Mandatory for Cook Time & Headspace) *
                  </label>
                  <span className="text-[11px] font-bold text-[#FF8107]">
                    Selected: {selectedJarSize}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {jarSizeOptions.map((opt) => {
                    const isSelected = selectedJarSize === opt.label;
                    return (
                      <button
                        type="button"
                        key={opt.label}
                        onClick={() => setSelectedJarSize(opt.label)}
                        className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-orange-50 border-[#FF8107] ring-2 ring-[#FF8107]/30 shadow-sm'
                            : 'bg-gray-50/80 hover:bg-gray-100 border-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-black ${isSelected ? 'text-[#FF8107]' : 'text-[#0D0D0D]'}`}>
                            {opt.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8107]" />}
                        </div>
                        <span className="text-[10px] font-semibold text-gray-500 leading-snug">
                          {opt.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recipe Textarea Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#0D0D0D] block">
                  Recipe Ingredients & Preparation Steps *
                </label>
                <textarea
                  rows={8}
                  value={recipeText}
                  onChange={(e) => setRecipeText(e.target.value)}
                  placeholder="Paste your canning recipe here. Include ingredients, processing method, jar size, headspace, and processing time."
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#FF8107]/20 focus:border-[#FF8107] text-sm font-medium text-[#0D0D0D] leading-relaxed transition-all resize-y"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center space-x-3 text-red-700 text-sm font-semibold">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {!isTrialActive && (
                <div className="p-4 rounded-2xl bg-orange-50 border border-[#FF8107]/20 flex items-center space-x-3 text-[#9a3412] text-xs font-bold">
                  <Lock className="w-4 h-4 text-[#FF8107] flex-shrink-0" />
                  {freeAnalysesRemaining > 0 ? (
                    <span>
                      You have {freeAnalysesRemaining} free {freeAnalysesRemaining === 1 ? 'analysis' : 'analyses'} remaining. Start your 15-day free trial anytime for unlimited access.
                    </span>
                  ) : (
                    <span>You've used all {FREE_ANALYSIS_LIMIT} free analyses. Start your 15-day free trial to keep analyzing recipes.</span>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs font-semibold text-gray-500 flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-[#FF8107]" />
                  <span>Checks for common canning red flags. Always confirm with tested USDA/NCHFP guidance.</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAnalyze}
                  className="w-full sm:w-auto bg-[#FF8107] hover:bg-[#e06f00] text-white px-8 py-4 rounded-full text-base font-bold shadow-xl shadow-[#FF8107]/25 flex items-center justify-center space-x-2 transition-all"
                >
                  {isTrialActive || freeAnalysesRemaining > 0 ? (
                    <>
                      <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                      <span>{isTrialActive ? 'Analyze Recipe' : `Analyze Recipe (${freeAnalysesRemaining} Free Left)`}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 stroke-[2.5]" />
                      <span>Start Free Trial to Analyze</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
