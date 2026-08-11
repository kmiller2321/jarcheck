import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, ShieldCheck, Clock, CheckCircle2, AlertTriangle, BookOpen, Loader2
} from 'lucide-react';
import { WEEKLY_RECIPE } from '../data/usdaData';
import { WeeklyRecipeArchive } from './WeeklyRecipeArchive';

interface WeeklyRecipeProps {
  isTrialActive: boolean;
  onOpenTrialModal: () => void;
}

interface LiveWeeklyRecipe {
  weekKey: string;
  title: string;
  subtitle: string;
  description: string;
  processingTime: string;
  yieldJars: string;
  method: string;
  headspace: string;
  ingredients: string[];
  instructions: { stepNumber: number; title: string; detail: string; safetyNote?: string }[];
  safetyChecklist: string[];
}

export const WeeklyRecipe: React.FC<WeeklyRecipeProps> = ({
  isTrialActive,
  onOpenTrialModal
}) => {
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [liveRecipe, setLiveRecipe] = useState<LiveWeeklyRecipe | null>(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(true);

  // The Recipe of the Week is free for everyone to see in full -- only the
  // past-recipe archive (below) is behind the subscriber paywall. This
  // fetches this week's AI-generated recipe; falls back to a static
  // recipe if the live one can't be reached.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/weekly-recipe')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('failed'))))
      .then((data) => {
        if (!cancelled) setLiveRecipe(data);
      })
      .catch(() => {
        /* silently fall back to the static WEEKLY_RECIPE below */
      })
      .finally(() => {
        if (!cancelled) setIsLoadingRecipe(false);
      });
    return () => { cancelled = true; };
  }, []);

  const recipe = liveRecipe || WEEKLY_RECIPE;

  // Timer helper
  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startTimer = (minutes: number) => {
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(true);
  };

  return (
    <section id="weekly-recipe" className="py-16 md:py-24 bg-[#0D0D0D] text-white relative overflow-hidden">

      {/* Background Hero Image Container with Glassmorphism Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={WEEKLY_RECIPE.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover opacity-25 filter blur-xs"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/90 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">

        {/* Header Badge */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#FF8107]/20 to-amber-500/10 border border-[#FF8107]/40 px-4 py-1.5 rounded-full backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#FF8107]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#FF8107]">
              {isLoadingRecipe ? 'Loading This Week\'s AI-Generated Recipe' : 'Recipe of the Week \u00b7 AI-Generated Fresh Each Week'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {recipe.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-300 font-normal">
            {recipe.subtitle}
          </p>
        </div>

        {/* Recipe Glassmorphism Container -- fully visible to everyone, no paywall */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[36px] p-6 sm:p-10 shadow-2xl relative overflow-hidden text-left">

          {/* Top Info Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-8 border-b border-white/15">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase block">Difficulty</span>
              <span className="text-base sm:text-lg font-black text-white">Easy / Beginner</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase block">Method</span>
              <span className="text-base sm:text-lg font-black text-white">{recipe.method}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase block">Estimated Yield</span>
              <span className="text-base sm:text-lg font-black text-white">{recipe.yieldJars}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase block">Safety Note</span>
              <span className="text-xs font-bold text-amber-300 block leading-snug">
                Always use 5% bottled lemon juice to maintain proper pH balance.
              </span>
            </div>
          </div>

          {isLoadingRecipe ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF8107]" />
              <span className="text-sm font-semibold">Fetching this week's recipe...</span>
            </div>
          ) : (
            <div className="pt-8 space-y-10">

              {/* Ingredients List */}
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white flex items-center space-x-2">
                  <BookOpen className="w-6 h-6 text-[#FF8107]" />
                  <span>Ingredients</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/10 border border-white/10 text-sm font-medium text-gray-100 flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-[#FF8107] flex-shrink-0" />
                      <span>{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Canning Directions */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white flex items-center space-x-2">
                    <ShieldCheck className="w-6 h-6 text-[#FF8107]" />
                    <span>USDA Canning Directions & Timing</span>
                  </h3>

                  <button
                    onClick={() => startTimer(10)}
                    className="px-4 py-2 rounded-full bg-[#FF8107] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Quick 10-Min Timer ({timerSeconds > 0 ? `${Math.floor(timerSeconds/60)}:${(timerSeconds%60).toString().padStart(2,'0')}` : 'Start'})</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {recipe.instructions.map((step) => (
                    <div key={step.stepNumber} className="p-6 rounded-3xl bg-white/5 border border-white/15 space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 rounded-full bg-[#FF8107] text-white font-black flex items-center justify-center text-sm">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-lg font-bold text-white">{step.title}</h4>
                      </div>

                      <p className="text-sm text-gray-300 leading-relaxed font-normal">
                        {step.detail}
                      </p>

                      {step.safetyNote && (
                        <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-xs text-amber-200 font-medium flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{step.safetyNote}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Checklist Footer */}
              <div className="p-6 rounded-3xl bg-emerald-950/60 border border-emerald-500/30 space-y-3">
                <h4 className="text-sm font-black uppercase text-emerald-400 tracking-wider">
                  Final Inspection Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-200">
                  {recipe.safetyChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Searchable Past Weekly Recipes Archive -- this part stays behind the paywall */}
        <div className="pt-12 border-t border-white/10">
          <WeeklyRecipeArchive
            isTrialActive={isTrialActive}
            onOpenTrialModal={onOpenTrialModal}
          />
        </div>

      </div>
    </section>
  );
};
