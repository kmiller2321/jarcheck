import React, { useState } from 'react';
import { 
  Search, Lock, Unlock, Sparkles, Filter, CheckCircle2, 
  Calendar, BookOpen, ExternalLink, Mail, Check, Send, Bot, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PAST_WEEKLY_RECIPES, PastWeeklyRecipeItem } from '../data/pastRecipesData';

interface WeeklyRecipeArchiveProps {
  isTrialActive: boolean;
  onOpenTrialModal: () => void;
}

export const WeeklyRecipeArchive: React.FC<WeeklyRecipeArchiveProps> = ({
  isTrialActive,
  onOpenTrialModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRecipe, setSelectedRecipe] = useState<PastWeeklyRecipeItem | null>(null);

  // Email Newsletter Opt-in form state
  const [optInEmail, setOptInEmail] = useState('');
  const [optInSuccess, setOptInSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Email Generator Preview Modal
  const [isAiEmailModalOpen, setIsAiEmailModalOpen] = useState(false);
  const [generatedEmailHtml, setGeneratedEmailHtml] = useState<string | null>(null);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const categories = ['ALL', 'Fruit Preserves', 'Pickles & Relish', 'Salsa & Tomatoes', 'Soups & Meats', 'Jams & Jellies'];

  // Category Filter and 3-Recipe Preview Limit
  const matchingCategoryRecipes = PAST_WEEKLY_RECIPES.filter(recipe => {
    const matchesSearch = 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'ALL' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Display top 3 recipes per category for clean interface (or all if subscriber requested view all)
  const [showAllInCategory, setShowAllInCategory] = useState(false);
  const displayedRecipes = showAllInCategory && isTrialActive
    ? matchingCategoryRecipes 
    : matchingCategoryRecipes.slice(0, 3);

  const [welcomeEmailInfo, setWelcomeEmailInfo] = useState<{ subject: string; recipient: string; sentAt: string } | null>(null);

  const handleSubscribeNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!optInEmail || !optInEmail.includes('@')) return;

    const emailToSub = optInEmail;
    setIsSubmitting(true);
    setIsGeneratingEmail(true);
    setIsAiEmailModalOpen(true);
    setDispatchStatus(null);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSub, optInWeeklyEmail: true })
      });
      const data = await res.json();
      if (res.ok) {
        setOptInSuccess(true);
        setOptInEmail('');
        if (data.welcomeEmail) {
          setWelcomeEmailInfo({
            subject: data.welcomeEmail.subject,
            recipient: data.welcomeEmail.recipient,
            sentAt: data.welcomeEmail.sentAt
          });
          setGeneratedEmailHtml(data.welcomeEmail.html);
          setDispatchStatus(`🎉 Instant Delivery Success! Welcome email with this week's recipe was dispatched immediately to ${data.welcomeEmail.recipient}.`);
        }
      }
    } catch (err) {
      console.error('Newsletter subscribe failed:', err);
      setDispatchStatus('Failed to subscribe or send welcome email.');
    } finally {
      setIsSubmitting(false);
      setIsGeneratingEmail(false);
    }
  };

  const handlePreviewWelcomeEmail = async () => {
    setIsAiEmailModalOpen(true);
    setIsGeneratingEmail(true);
    setDispatchStatus(null);
    try {
      const targetEmail = optInEmail || 'new.subscriber@example.com';
      const res = await fetch('/api/newsletter/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await res.json();
      if (data.welcomeEmail) {
        setWelcomeEmailInfo({
          subject: data.welcomeEmail.subject,
          recipient: data.welcomeEmail.recipient,
          sentAt: data.welcomeEmail.sentAt
        });
        setGeneratedEmailHtml(data.welcomeEmail.html);
        setDispatchStatus(`✉️ Welcome email generated & sent immediately to ${targetEmail}`);
      }
    } catch (err) {
      console.error('Welcome email generation failed:', err);
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const handleGenerateAiEmail = async (recipe: PastWeeklyRecipeItem) => {
    setIsAiEmailModalOpen(true);
    setIsGeneratingEmail(true);
    setDispatchStatus(null);
    try {
      const res = await fetch('/api/newsletter/generate-weekly-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeTitle: recipe.title,
          season: recipe.season,
          ctaUrl: window.location.origin
        })
      });
      const data = await res.json();
      setGeneratedEmailHtml(data.html);
    } catch (err) {
      console.error('AI email generation failed:', err);
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  return (
    <div className="space-y-10 text-left">
      
      {/* 1. Newsletter Opt-in Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-[#FF8107] to-amber-600 rounded-[32px] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>Weekly Newsletter & Welcome Email Engine</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-black">
            Get Every New USDA Tested Recipe Emailed Free
          </h3>

          <p className="text-xs sm:text-sm text-orange-100 font-medium leading-relaxed">
            Never miss a seasonal preserve! Subscribe below to instantly receive our <strong>Welcome Email featuring this week's tested recipe ("Citrus Honey Peach Jam")</strong> delivered straight to your inbox, with links to our past recipe archive and AI safety tools.
          </p>

          {optInSuccess ? (
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white font-bold text-xs sm:text-sm">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0" />
                <span>You're subscribed! Your welcome email with this week's recipe was sent immediately.</span>
              </div>
              <button
                onClick={handlePreviewWelcomeEmail}
                className="px-4 py-2 bg-white text-orange-600 hover:bg-orange-50 font-black rounded-xl text-xs shrink-0 shadow-md"
              >
                View Sent Welcome Email
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <form onSubmit={handleSubscribeNewsletter} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={optInEmail}
                  onChange={(e) => setOptInEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="flex-1 px-5 py-3.5 rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-xs sm:text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-300/50"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-black hover:bg-gray-900 text-white text-xs sm:text-sm font-black rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 shrink-0"
                >
                  <span>Subscribe & Get Email Now</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center justify-between text-xs text-orange-100 font-medium px-1">
                <span>⚡ Triggers instant welcome email with current week's tested recipe</span>
                <button
                  type="button"
                  onClick={handlePreviewWelcomeEmail}
                  className="underline hover:text-white font-bold flex items-center space-x-1"
                >
                  <span>Preview Welcome Email Sample</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Past Recipe Database Header & Search Bar */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-500 text-xs font-black uppercase mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Searchable Recipe Database</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Past Archived Weekly Recipes
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              Past weekly recipes are protected behind the Pro paywall. Subscribed members get unlimited search access.
            </p>
          </div>

          {!isTrialActive && (
            <button
              onClick={onOpenTrialModal}
              className="px-5 py-2.5 bg-[#FF8107] hover:bg-[#e06f00] text-white text-xs font-extrabold rounded-full shadow-lg flex items-center space-x-2 self-start md:self-auto"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Archive ($9.99/mo)</span>
            </button>
          )}
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search past recipes by ingredient (e.g. peach, garlic, tomato, chicken)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-gray-400 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-[#FF8107]"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowAllInCategory(false);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#FF8107] text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Category Count & Preview Indicator */}
          <div className="flex items-center justify-between pt-1 text-xs text-gray-400">
            <span className="font-semibold">
              Showing {displayedRecipes.length} of {matchingCategoryRecipes.length} recipes in <strong className="text-amber-400">{selectedCategory}</strong>
            </span>
            {matchingCategoryRecipes.length > 3 && !isTrialActive && (
              <button
                onClick={onOpenTrialModal}
                className="text-[#FF8107] hover:underline font-extrabold flex items-center space-x-1"
              >
                <Lock className="w-3 h-3" />
                <span>Subscribe to see all {matchingCategoryRecipes.length} recipes</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Past Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedRecipes.map((recipe) => {
          const isLocked = recipe.isPaywalled && !isTrialActive;

          return (
            <div
              key={recipe.id}
              className="bg-white/5 border border-white/10 hover:border-[#FF8107]/50 rounded-3xl p-5 shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="space-y-4">
                {/* Image / Header Teaser */}
                <div className="relative h-44 rounded-2xl overflow-hidden bg-black/40">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      isLocked ? 'filter blur-xs opacity-50' : 'opacity-85'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1 border border-white/20">
                    <Calendar className="w-3 h-3 text-[#FF8107]" />
                    <span>{recipe.weekDate}</span>
                  </span>

                  {isLocked ? (
                    <span className="absolute top-3 right-3 bg-amber-500/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-md">
                      <Lock className="w-3 h-3" />
                      <span>PRO PAYWALL</span>
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 bg-emerald-500/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-md">
                      <Unlock className="w-3 h-3" />
                      <span>UNLOCKED</span>
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF8107] block">
                      {recipe.category}
                    </span>
                    <h4 className="text-base font-black text-white leading-snug line-clamp-1">
                      {recipe.title}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 font-normal leading-relaxed">
                  {recipe.description}
                </p>

                <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 pt-2 border-t border-white/10">
                  <span>Method: <strong className="text-white">{recipe.method}</strong></span>
                  <span>Yield: <strong className="text-white">{recipe.yieldJars}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-2">
                {isLocked ? (
                  <button
                    onClick={onOpenTrialModal}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Subscribe to Unlock Recipe</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedRecipe(recipe)}
                    className="w-full py-2.5 bg-[#FF8107] hover:bg-[#e06f00] text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Full Recipe & Timing</span>
                  </button>
                )}

                <button
                  onClick={() => handleGenerateAiEmail(recipe)}
                  className="w-full py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[10px] font-extrabold rounded-xl transition-all flex items-center justify-center space-x-1"
                >
                  <Bot className="w-3 h-3 text-[#FF8107]" />
                  <span>Preview AI Auto-Email Draft</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Full Recipe Detail Modal (for Unlocked Recipes) */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141414] text-white border border-white/20 rounded-[32px] max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-black text-[#FF8107] uppercase">{selectedRecipe.category} • {selectedRecipe.weekDate}</span>
                <h3 className="text-2xl font-black">{selectedRecipe.title}</h3>
                <p className="text-xs text-gray-400 font-medium">{selectedRecipe.subtitle}</p>
              </div>
              <button onClick={() => setSelectedRecipe(null)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase text-[#FF8107]">Ingredients</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-gray-200">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="p-2 bg-white/5 rounded-xl border border-white/5 flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8107]" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>

              <h4 className="text-sm font-black uppercase text-[#FF8107] pt-2">Directions</h4>
              <div className="space-y-3">
                {selectedRecipe.instructions.map((step) => (
                  <div key={step.stepNumber} className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-xs space-y-1">
                    <div className="font-bold text-white">Step {step.stepNumber}: {step.title}</div>
                    <p className="text-gray-300">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedRecipe(null)}
              className="w-full py-3 bg-[#FF8107] text-white font-extrabold rounded-xl text-xs"
            >
              Close Recipe View
            </button>
          </div>
        </div>
      )}

      {/* 5. AI Email Preview Modal */}
      {isAiEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-white text-gray-900 rounded-[32px] max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#FF8107] text-white rounded-2xl shadow-md">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Welcome Newsletter Email Dispatcher</h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {welcomeEmailInfo 
                      ? `Generated & Sent Immediately to ${welcomeEmailInfo.recipient}`
                      : 'Includes this week\'s tested recipe & subscription encouragement'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsAiEmailModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 font-bold text-lg">✕</button>
            </div>

            {isGeneratingEmail ? (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#FF8107] animate-spin mx-auto" />
                <p className="text-xs font-bold text-gray-600">Gemini AI is generating custom Welcome Email with this week's recipe ("Citrus Honey Peach Jam")...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dispatchStatus && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{dispatchStatus}</span>
                  </div>
                )}

                <div className="border border-gray-200 rounded-2xl overflow-hidden max-h-[480px] overflow-y-auto bg-gray-50 p-2 shadow-inner">
                  <div dangerouslySetInnerHTML={{ __html: generatedEmailHtml || '' }} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handlePreviewWelcomeEmail}
                    className="flex-1 py-3 bg-[#FF8107] hover:bg-[#e06f00] text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Re-Send Welcome Email Immediately</span>
                  </button>
                  <button
                    onClick={() => setIsAiEmailModalOpen(false)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold rounded-xl"
                  >
                    Close Email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
