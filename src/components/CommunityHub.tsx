import React, { useState, useRef } from 'react';
import { 
  Search, ShieldCheck, Lock, Sparkles, MessageSquare, Heart, Star, 
  HelpCircle, UserCheck, Plus, Upload, ImageIcon, Check, Globe, AlertTriangle, 
  Eye, ThumbsUp, Filter, CheckCircle2, Award, X, RefreshCw, Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TestimonialItem, CommunityQAItem, CommunityPhotoPost, PhotoModerationResult 
} from '../types';
import { 
  INITIAL_TESTIMONIALS, INITIAL_COMMUNITY_QA, INITIAL_COMMUNITY_PHOTOS, STOCK_COMMUNITY_PHOTOS 
} from '../data/communityData';
import { AIChatAssistant } from './AIChatAssistant';

interface CommunityHubProps {
  isTrialActive: boolean;
  onOpenTrialModal: () => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({
  isTrialActive,
  onOpenTrialModal
}) => {
  const [activeTab, setActiveTab] = useState<'QA' | 'TESTIMONIALS' | 'PHOTOS' | 'CHAT'>('QA');
  
  // Q&A State
  const [qaSearch, setQaSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [qaList, setQaList] = useState<CommunityQAItem[]>(INITIAL_COMMUNITY_QA);
  const [unlockedAnswers, setUnlockedAnswers] = useState<Record<string, boolean>>({});
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState<CommunityQAItem['category']>('Botulism Safety');
  const [askSuccessMsg, setAskSuccessMsg] = useState(false);

  // Testimonial State
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(INITIAL_TESTIMONIALS);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestRole, setNewTestRole] = useState('Home Food Preserver');
  const [newTestLocation, setNewTestLocation] = useState('');
  const [newTestQuote, setNewTestQuote] = useState('');
  const [newTestYears, setNewTestYears] = useState<number>(5);

  // Photo Sharing State
  const [photoPosts, setPhotoPosts] = useState<CommunityPhotoPost[]>(INITIAL_COMMUNITY_PHOTOS);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoAuthor, setNewPhotoAuthor] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<CommunityPhotoPost['categoryTag']>('Jams & Preserves');
  const [newPhotoImage, setNewPhotoImage] = useState<string>('/images/cans_on_shelf_1.png');
  const [photoImageSource, setPhotoImageSource] = useState<'STOCK' | 'URL' | 'UPLOAD'>('STOCK');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  // AI Moderation State
  const [isModerating, setIsModerating] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);

  // Selected Photo Detail Modal
  const [selectedPhoto, setSelectedPhoto] = useState<CommunityPhotoPost | null>(null);

  // Filtered Q&A
  const filteredQA = qaList.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesQuery = item.question.toLowerCase().includes(qaSearch.toLowerCase()) ||
                         item.previewAnswer.toLowerCase().includes(qaSearch.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Toggle Q&A Upvote
  const handleUpvoteQA = (id: string) => {
    setQaList(prev => prev.map(item => item.id === id ? { ...item, helpfulCount: item.helpfulCount + 1 } : item));
  };

  // Submit new Q&A question
  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const createdQA: CommunityQAItem = {
      id: `qa-${Date.now()}`,
      question: newQuestionText,
      category: newQuestionCategory,
      askedBy: 'Community Homesteader',
      askedDate: 'Just now',
      previewAnswer: 'Master Food Preservers are reviewing this question. The answer will be indexed shortly...',
      fullAnswer: 'VERIFIED ANSWER:\nFollow USDA NCHFP tested processing guidelines. Always measure acid and headspace carefully.',
      usdaReference: 'USDA Complete Guide to Home Canning',
      viewsCount: 1,
      helpfulCount: 0,
      isPaywalled: true
    };

    setQaList(prev => [createdQA, ...prev]);
    setNewQuestionText('');
    setIsAskingQuestion(false);
    setAskSuccessMsg(true);
    setTimeout(() => setAskSuccessMsg(false), 4000);
  };

  // Submit new Testimonial
  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim() || !newTestQuote.trim()) return;

    const newTest: TestimonialItem = {
      id: `test-${Date.now()}`,
      name: newTestName,
      role: newTestRole,
      location: newTestLocation || 'United States',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      quote: newTestQuote,
      rating: 5,
      yearsCanning: Number(newTestYears),
      verifiedUser: true,
      batchType: 'Home Preserving'
    };

    setTestimonials(prev => [newTest, ...prev]);
    setIsAddingTestimonial(false);
    setNewTestName('');
    setNewTestQuote('');
  };

  // Select Photo File
  const handlePhotoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewPhotoImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Photo with AI Moderation
  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle.trim()) return;

    setIsModerating(true);
    setModerationError(null);

    try {
      const isBase64 = newPhotoImage.startsWith('data:');
      const payload = isBase64 
        ? { imageBase64: newPhotoImage, title: newPhotoTitle }
        : { imageUrl: newPhotoImage, title: newPhotoTitle };

      const res = await fetch('/api/moderate-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data: PhotoModerationResult = await res.json();

      if (!data.isSafe) {
        setModerationError(
          data.flaggedReason || 'AI Safety Rejection: Image flagged for explicit or non-community content. Please ensure photos feature wholesome home canning jars, harvest, or kitchen food prep.'
        );
        setIsModerating(false);
        return;
      }

      // Safe! Add to Community Posts
      const newPost: CommunityPhotoPost = {
        id: `post-${Date.now()}`,
        title: newPhotoTitle,
        caption: newPhotoCaption || 'Fresh batch ready for the pantry shelf!',
        author: newPhotoAuthor || 'Community Homesteader',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        location: 'United States',
        imageUrl: newPhotoImage,
        categoryTag: newPhotoCategory,
        postedDate: 'Just now',
        likesCount: 1,
        aiVerified: true,
        detectedObjects: data.detectedObjects || ['Home Canning Jars', 'Preserves']
      };

      setPhotoPosts(prev => [newPost, ...prev]);
      setIsUploadingPhoto(false);
      setNewPhotoTitle('');
      setNewPhotoCaption('');
      setNewPhotoAuthor('');
      setNewPhotoImage('/images/cans_on_shelf_1.png');
    } catch (err) {
      console.error('Error moderating photo:', err);
      setModerationError('Unable to connect to AI moderation server. Please try again.');
    } finally {
      setIsModerating(false);
    }
  };

  const handleToggleLike = (id: string) => {
    setLikedPosts(prev => {
      const currentlyLiked = !!prev[id];
      const nextState = { ...prev, [id]: !currentlyLiked };
      
      setPhotoPosts(posts => posts.map(p => {
        if (p.id === id) {
          return { ...p, likesCount: currentlyLiked ? p.likesCount - 1 : p.likesCount + 1 };
        }
        return p;
      }));

      return nextState;
    });
  };

  return (
    <section id="community" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header & Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-orange-100/80 border border-[#FF8107]/20 text-[#FF8107] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#FF8107]" />
            <span>AI-Moderated Master Community</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0D0D0D] tracking-tight leading-tight">
            Community Q&A, Testimonials & Photo Showcase
          </h2>

          <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
            Search 500+ verified Master Canner answers, read experiences from certified extension agents, and share AI-screened photos of your pantry harvest.
          </p>

          {/* Tab Navigation Controls */}
          <div className="flex items-center justify-center p-1.5 bg-gray-200/60 backdrop-blur-md rounded-2xl max-w-2xl mx-auto space-x-1 border border-gray-300/50 shadow-inner mt-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('QA')}
              className={`flex-1 min-w-[100px] py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                activeTab === 'QA'
                  ? 'bg-white text-[#0D0D0D] shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-[#FF8107]" />
              <span>Master Q&A</span>
            </button>

            <button
              onClick={() => setActiveTab('CHAT')}
              className={`flex-1 min-w-[110px] py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                activeTab === 'CHAT'
                  ? 'bg-white text-[#0D0D0D] shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bot className="w-4 h-4 text-[#FF8107]" />
              <span>AI Chat</span>
              {!isTrialActive && <Lock className="w-3 h-3 text-amber-500 ml-0.5" />}
            </button>

            <button
              onClick={() => setActiveTab('TESTIMONIALS')}
              className={`flex-1 min-w-[90px] py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                activeTab === 'TESTIMONIALS'
                  ? 'bg-white text-[#0D0D0D] shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Star className="w-4 h-4 text-[#FF8107]" />
              <span>Reviews</span>
            </button>

            <button
              onClick={() => setActiveTab('PHOTOS')}
              className={`flex-1 min-w-[110px] py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                activeTab === 'PHOTOS'
                  ? 'bg-white text-[#0D0D0D] shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#FF8107]" />
              <span>Photo Gallery</span>
            </button>
          </div>
        </div>

        {/* ================= TAB 0: AI CANNER GUIDANCE CHAT (PAYWALLED) ================= */}
        {activeTab === 'CHAT' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <AIChatAssistant
              isTrialActive={isTrialActive}
              onOpenTrialModal={onOpenTrialModal}
              onClose={() => setActiveTab('QA')}
              onHide={() => setActiveTab('QA')}
            />
          </motion.div>
        )}

        {/* ================= TAB 1: MASTER Q&A WITH PAYWALL ================= */}
        {activeTab === 'QA' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Search & Filter Bar */}
            <div className="bg-white p-6 rounded-[28px] border border-gray-200/80 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={qaSearch}
                    onChange={(e) => setQaSearch(e.target.value)}
                    placeholder="Search Q&A (e.g. botulism, pressure PSI, false seal, flour, citric acid)..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 text-sm font-semibold focus:ring-2 focus:ring-[#FF8107] focus:border-transparent outline-none shadow-sm"
                  />
                  {qaSearch && (
                    <button 
                      onClick={() => setQaSearch('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Ask Question CTA */}
                <button
                  onClick={() => setIsAskingQuestion(true)}
                  className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-[#0D0D0D] hover:bg-gray-800 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 shadow-md transition-all shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#FF8107]" />
                  <span>Ask Master Canner</span>
                </button>
              </div>

              {/* Category Filter Badges */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
                {['ALL', 'Botulism Safety', 'Pressure Canning', 'Acid & pH', 'Jams & Jellies', 'Equipment & Lids'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap border ${
                      selectedCategory === cat
                        ? 'bg-[#FF8107] text-white border-[#FF8107] shadow-sm'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {askSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Your question has been submitted to certified Master Food Preservers for indexing!</span>
              </div>
            )}

            {/* Q&A Cards List */}
            <div className="grid grid-cols-1 gap-6">
              {filteredQA.map((item) => {
                const isUnlocked = isTrialActive || unlockedAnswers[item.id];

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-[28px] border border-gray-200/90 shadow-md p-6 sm:p-8 space-y-5 hover:shadow-xl transition-all text-left relative overflow-hidden"
                  >
                    {/* Top Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-full bg-orange-50 border border-[#FF8107]/30 text-[#FF8107] text-[10px] font-black uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-400 font-semibold">• Asked by {item.askedBy} ({item.askedDate})</span>
                      </div>

                      <div className="flex items-center space-x-4 text-xs font-bold text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5 text-gray-400" />
                          <span>{item.viewsCount} views</span>
                        </span>
                        <button
                          onClick={() => handleUpvoteQA(item.id)}
                          className="flex items-center space-x-1 text-[#FF8107] hover:text-[#e06f00] bg-orange-50 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{item.helpfulCount} Helpful</span>
                        </button>
                      </div>
                    </div>

                    {/* Question Title */}
                    <h3 className="text-lg sm:text-xl font-black text-[#0D0D0D] flex items-start space-x-2.5">
                      <HelpCircle className="w-5 h-5 text-[#FF8107] shrink-0 mt-1" />
                      <span>{item.question}</span>
                    </h3>

                    {/* Public Preview Teaser Answer */}
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-xs font-medium text-gray-700 leading-relaxed">
                      <span className="font-extrabold text-gray-900 block mb-1">Public Answer Summary:</span>
                      <p>{item.previewAnswer}</p>
                    </div>

                    {/* Verified Master Answer Box - PAYWALLED IF NOT PRO */}
                    {isUnlocked ? (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-5 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-emerald-800 font-black text-xs uppercase tracking-wide">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Master Canner Verified Safety Protocol</span>
                          </div>
                          <span className="text-[10px] font-bold bg-emerald-200/60 text-emerald-900 px-2.5 py-0.5 rounded-full">
                            PRO UNLOCKED
                          </span>
                        </div>

                        <p className="text-xs font-bold text-gray-800 whitespace-pre-line leading-relaxed">
                          {item.fullAnswer}
                        </p>

                        <div className="pt-2 border-t border-emerald-200/60 text-[11px] font-bold text-emerald-700 flex items-center space-x-1.5">
                          <Award className="w-3.5 h-3.5 shrink-0" />
                          <span>Official USDA Reference: {item.usdaReference}</span>
                        </div>
                      </motion.div>
                    ) : (
                      /* PAYWALL LOCKED CARD */
                      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-200 bg-amber-50/50 p-6 text-center space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-full">
                            <Lock className="w-6 h-6 stroke-[2.5]" />
                          </div>
                          <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
                            Master Canner Verified Answer Paywalled
                          </span>
                        </div>

                        <div className="max-w-md mx-auto space-y-1">
                          <p className="text-xs font-bold text-gray-800">
                            Detailed NCHFP step-by-step procedures, PSI correction tables, and safety guidelines are reserved for PreserveCheck Pro members.
                          </p>
                          <p className="text-[11px] text-gray-500 font-medium">
                            Join 12,000+ homesteaders who protect their cellar with USDA-tested protocols.
                          </p>
                        </div>

                        <div className="flex items-center justify-center gap-3 pt-1">
                          <button
                            onClick={() => {
                              setUnlockedAnswers(prev => ({ ...prev, [item.id]: true }));
                            }}
                            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md transition-all flex items-center space-x-1.5"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Instant Unlock Answer</span>
                          </button>

                          <button
                            onClick={onOpenTrialModal}
                            className="px-5 py-2.5 rounded-xl bg-[#0D0D0D] hover:bg-gray-800 text-white text-xs font-black shadow-md transition-all"
                          >
                            <span>Start 15-Day Free Trial</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </motion.div>
        )}

        {/* ================= TAB 2: HOMESTEADER TESTIMONIALS ================= */}
        {activeTab === 'TESTIMONIALS' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-xl font-black text-[#0D0D0D]">Homesteader & Extension Agent Reviews</h3>
                <p className="text-xs text-gray-500 font-medium">Real experiences from home food preservers using PreserveCheck.</p>
              </div>

              <button
                onClick={() => setIsAddingTestimonial(true)}
                className="px-5 py-2.5 rounded-full bg-[#FF8107] hover:bg-[#e06f00] text-white text-xs font-extrabold flex items-center space-x-2 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Write a Testimonial</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[28px] border border-gray-200/90 shadow-md p-6 sm:p-8 space-y-4 text-left relative flex flex-col justify-between hover:shadow-xl transition-all"
                >
                  <div className="space-y-3">
                    {/* Star Rating & Verified Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-amber-400">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>

                      <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified Food Preserver</span>
                      </span>
                    </div>

                    {/* Quote */}
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-relaxed italic">
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Author Card Footer */}
                  <div className="flex items-center space-x-3.5 pt-4 border-t border-gray-100">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#FF8107]/30 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-[#0D0D0D] truncate">{item.name}</h4>
                      <p className="text-[11px] font-bold text-gray-500 truncate">{item.role}</p>
                      <p className="text-[10px] text-[#FF8107] font-extrabold mt-0.5">
                        {item.location} • {item.yearsCanning} Years Canning
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        )}

        {/* ================= TAB 3: AI-MODERATED PHOTO GALLERY ================= */}
        {activeTab === 'PHOTOS' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Top Bar with AI Safety Banner */}
            <div className="bg-white p-6 rounded-[28px] border border-gray-200/90 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-left">
                <div className="p-3 bg-orange-100 text-[#FF8107] rounded-2xl shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0D0D0D] flex items-center space-x-2">
                    <span>Community Canning Photo Showcase</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">AI Safety Guard Active</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    All submitted photos are analyzed by server-side AI (Gemini 3.6 Flash) to ensure explicit/inappropriate content is strictly blocked.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsUploadingPhoto(true)}
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-[#FF8107] hover:bg-[#e06f00] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 shadow-lg transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Share Jar Photo</span>
              </button>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {photoPosts.map((post) => {
                const isLiked = !!likedPosts[post.id];

                return (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPhoto(post)}
                    className="group bg-white rounded-[24px] border border-gray-200/90 shadow-md overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer text-left"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/cans_on_shelf_1.png';
                        }}
                      />

                      {/* AI Verified Safe Badge */}
                      <div className="absolute top-3 left-3 bg-black/65 backdrop-blur-md text-emerald-300 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center space-x-1 border border-emerald-400/30">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>AI Verified Safe</span>
                      </div>

                      {/* Category Tag */}
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-[#0D0D0D] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm">
                        {post.categoryTag}
                      </div>
                    </div>

                    {/* Content Box */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-[#0D0D0D] line-clamp-1">{post.title}</h4>
                        <p className="text-xs text-gray-600 line-clamp-2 font-medium">{post.caption}</p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img
                            src={post.authorAvatar}
                            alt={post.author}
                            className="w-6 h-6 rounded-full object-cover border border-gray-200"
                          />
                          <span className="text-[11px] font-bold text-gray-700 truncate max-w-[90px]">{post.author}</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLike(post.id);
                          }}
                          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                            isLiked
                              ? 'bg-rose-50 text-rose-600 border border-rose-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span>{post.likesCount}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </motion.div>
        )}

      </div>

      {/* ================= MODAL: ASK QUESTION ================= */}
      <AnimatePresence>
        {isAskingQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-xl font-black text-[#0D0D0D] flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5 text-[#FF8107]" />
                  <span>Ask Master Canner & Community</span>
                </h3>
                <button onClick={() => setIsAskingQuestion(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAskSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-700 block">Topic Category</label>
                  <select
                    value={newQuestionCategory}
                    onChange={(e) => setNewQuestionCategory(e.target.value as CommunityQAItem['category'])}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                  >
                    <option value="Botulism Safety">Botulism Safety</option>
                    <option value="Pressure Canning">Pressure Canning</option>
                    <option value="Acid & pH">Acid & pH</option>
                    <option value="Jams & Jellies">Jams & Jellies</option>
                    <option value="Equipment & Lids">Equipment & Lids</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-700 block">Your Canning Question</label>
                  <textarea
                    required
                    rows={4}
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Describe your recipe, method, or equipment question in detail..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#FF8107]"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAskingQuestion(false)}
                    className="px-4 py-2 rounded-full border border-gray-300 text-xs font-bold text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#FF8107] hover:bg-[#e06f00] text-white text-xs font-extrabold shadow-md"
                  >
                    Submit Question
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ================= MODAL: ADD TESTIMONIAL ================= */}
        {isAddingTestimonial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-xl font-black text-[#0D0D0D] flex items-center space-x-2">
                  <Star className="w-5 h-5 text-[#FF8107]" />
                  <span>Share Your PreserveCheck Story</span>
                </h3>
                <button onClick={() => setIsAddingTestimonial(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleTestimonialSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-700 block">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newTestName}
                    onChange={(e) => setNewTestName(e.target.value)}
                    placeholder="e.g. Sarah Thorne"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Role / Title</label>
                    <input
                      type="text"
                      value={newTestRole}
                      onChange={(e) => setNewTestRole(e.target.value)}
                      placeholder="e.g. Master Food Preserver"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Years Canning</label>
                    <input
                      type="number"
                      min="1"
                      value={newTestYears}
                      onChange={(e) => setNewTestYears(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-700 block">Location</label>
                  <input
                    type="text"
                    value={newTestLocation}
                    onChange={(e) => setNewTestLocation(e.target.value)}
                    placeholder="e.g. Shenandoah Valley, VA"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-700 block">Your Experience Quote</label>
                  <textarea
                    required
                    rows={3}
                    value={newTestQuote}
                    onChange={(e) => setNewTestQuote(e.target.value)}
                    placeholder="How has PreserveCheck helped you can safely?"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingTestimonial(false)}
                    className="px-4 py-2 rounded-full border border-gray-300 text-xs font-bold text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#FF8107] hover:bg-[#e06f00] text-white text-xs font-extrabold shadow-md"
                  >
                    Post Testimonial
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ================= MODAL: SHARE PHOTO WITH AI MODERATION ================= */}
        {isUploadingPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 space-y-6 text-left my-8"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-[#FF8107]" />
                  <h3 className="text-xl font-black text-[#0D0D0D]">Share Jar Photo</h3>
                </div>
                <button onClick={() => setIsUploadingPhoto(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* AI Moderation Alert Box */}
              {moderationError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs font-bold space-y-1">
                  <div className="flex items-center space-x-2 font-black text-red-900">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>AI Safety Guard Rejection</span>
                  </div>
                  <p className="font-medium text-red-700 leading-relaxed">{moderationError}</p>
                </div>
              )}

              <form onSubmit={handlePhotoSubmit} className="space-y-4 text-xs font-semibold">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-700 block">Photo Title</label>
                  <input
                    type="text"
                    required
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    placeholder="e.g. Spiced Peach Preserves 2026 Batch"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Your Name / Handle</label>
                    <input
                      type="text"
                      value={newPhotoAuthor}
                      onChange={(e) => setNewPhotoAuthor(e.target.value)}
                      placeholder="e.g. Hannah Miller"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Category Tag</label>
                    <select
                      value={newPhotoCategory}
                      onChange={(e) => setNewPhotoCategory(e.target.value as CommunityPhotoPost['categoryTag'])}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    >
                      <option value="Jams & Preserves">Jams & Preserves</option>
                      <option value="Pressure Canned">Pressure Canned</option>
                      <option value="Pickling & Ferments">Pickling & Ferments</option>
                      <option value="Pantry Shelf Showcase">Pantry Shelf Showcase</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-700 block">Caption / Recipe Notes</label>
                  <textarea
                    rows={2}
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    placeholder="Share headspace, processing time, or garden harvest details..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                  />
                </div>

                {/* Photo Selector */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="text-xs font-bold uppercase text-gray-700 flex items-center justify-between">
                    <span>Select Photo</span>
                    <span className="text-[10px] text-gray-400 font-semibold">Will be AI-screened</span>
                  </label>

                  {/* Mode Tabs */}
                  <div className="flex items-center p-1 bg-gray-100 rounded-xl space-x-1 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setPhotoImageSource('STOCK')}
                      className={`flex-1 py-1.5 rounded-lg transition-all ${photoImageSource === 'STOCK' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                    >
                      Library
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoImageSource('URL')}
                      className={`flex-1 py-1.5 rounded-lg transition-all ${photoImageSource === 'URL' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoImageSource('UPLOAD')}
                      className={`flex-1 py-1.5 rounded-lg transition-all ${photoImageSource === 'UPLOAD' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                    >
                      Upload File
                    </button>
                  </div>

                  {photoImageSource === 'STOCK' && (
                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 border rounded-xl">
                      {STOCK_COMMUNITY_PHOTOS.map((stock, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setNewPhotoImage(stock.url)}
                          className={`relative rounded-xl overflow-hidden border-2 aspect-video ${newPhotoImage === stock.url ? 'border-[#FF8107]' : 'border-transparent'}`}
                        >
                          <img src={stock.url} alt={stock.title} className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] p-1 truncate">{stock.title}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {photoImageSource === 'URL' && (
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={customPhotoUrl}
                        onChange={(e) => setCustomPhotoUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 rounded-xl border text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customPhotoUrl.trim()) setNewPhotoImage(customPhotoUrl.trim());
                        }}
                        className="px-3 py-2 bg-[#FF8107] text-white rounded-xl text-xs font-bold"
                      >
                        Use
                      </button>
                    </div>
                  )}

                  {photoImageSource === 'UPLOAD' && (
                    <div className="p-3 bg-gray-50 border-2 border-dashed rounded-2xl text-center space-y-1">
                      <input type="file" ref={photoFileInputRef} accept="image/*" onChange={handlePhotoFileSelect} className="hidden" />
                      <Upload className="w-5 h-5 text-gray-400 mx-auto" />
                      <p className="text-xs text-gray-600 font-bold">Choose a jar image file from device</p>
                      <button
                        type="button"
                        onClick={() => photoFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white border rounded-xl text-xs font-bold"
                      >
                        Browse File
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Action Button */}
                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsUploadingPhoto(false)}
                    className="px-4 py-2 rounded-full border border-gray-300 text-xs font-bold text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isModerating}
                    className="px-6 py-2.5 rounded-full bg-[#FF8107] hover:bg-[#e06f00] text-white text-xs font-extrabold shadow-md flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isModerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>AI Scanning Content...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>AI Scan & Post Photo</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}

        {/* ================= MODAL: ENLARGED PHOTO DETAIL ================= */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[32px] max-w-2xl w-full overflow-hidden shadow-2xl relative text-left"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video bg-black">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1 shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>AI Content Safety Verified</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-[#FF8107] text-xs font-black uppercase">
                    {selectedPhoto.categoryTag}
                  </span>
                  <span className="text-xs text-gray-400 font-bold">{selectedPhoto.postedDate}</span>
                </div>

                <h3 className="text-xl font-black text-[#0D0D0D]">{selectedPhoto.title}</h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{selectedPhoto.caption}</p>

                {selectedPhoto.detectedObjects && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400 mr-1">AI Detected Elements:</span>
                    {selectedPhoto.detectedObjects.map((obj, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-bold">
                        {obj}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedPhoto.authorAvatar}
                      alt={selectedPhoto.author}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <h5 className="text-xs font-black text-[#0D0D0D]">{selectedPhoto.author}</h5>
                      <p className="text-[10px] text-gray-400 font-bold">{selectedPhoto.location}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleLike(selectedPhoto.id)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold"
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    <span>{selectedPhoto.likesCount} Likes</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
