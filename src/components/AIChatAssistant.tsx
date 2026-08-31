import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, Lock, ShieldCheck, User, RefreshCw, X, HelpCircle, 
  ChevronDown, MessageSquare, AlertCircle, Award, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIChatAssistantProps {
  isTrialActive: boolean;
  onOpenTrialModal: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  onHide?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  isTrialActive,
  onOpenTrialModal,
  isOpen = true,
  onClose,
  onHide
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      content: `Hello! I am **Master Canner AI**, your certified USDA & NCHFP food preservation guide.\n\nHow can I help you today? Ask me anything about:\n- Altitude PSI & timing adjustments\n- Low-acid vs. high-acid safety thresholds\n- Lid seals & siphoning troubleshooting\n- Recipe conversions & batching guidelines`,
      timestamp: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    if (!isTrialActive) {
      onOpenTrialModal();
      return;
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/canning-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });

      const data = await res.json();
      const replyText = data.reply || "Thank you for your question. Always verify recipe pH and altitude PSI guidelines.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat request failed:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: "I am having trouble connecting to the safety server right now. Please check your network connection or refer to the Master Q&A library.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const SUGGESTED_PROMPTS = [
    "What PSI do I need for pressure canning green beans at 4,500 ft elevation?",
    "How do I properly acidify tomato juice before water-bath canning?",
    "My jar lid made a soft click instead of a loud ping. Is it sealed?",
    "Can I safely add flour or butter to thicken my canned soup recipe?"
  ];

  return (
    <div className="bg-white rounded-[32px] border border-gray-200/90 shadow-2xl overflow-hidden flex flex-col h-[650px] max-w-4xl mx-auto text-left relative">
      
      {/* Top Header Bar */}
      <div className="bg-[#0D0D0D] text-white p-5 px-6 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-[#FF8107] flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0D0D0D] rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-sm text-white tracking-wide">Master Canner AI Guidance</h3>
              <span className="bg-orange-500/20 text-[#FF8107] border border-[#FF8107]/40 px-2 py-0.5 rounded-full text-[9px] font-black uppercase">
                USDA Certified Model
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">
              Real-time answers for pressure, acidity, processing times & siphoning
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isTrialActive ? (
            <span className="hidden sm:inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PRO ACTIVE</span>
            </span>
          ) : (
            <button
              onClick={onOpenTrialModal}
              className="inline-flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black px-3 py-1 rounded-full transition-colors shadow-sm"
            >
              <Lock className="w-3 h-3" />
              <span>UNLOCK AI CHAT</span>
            </button>
          )}

          {(onClose || onHide) && (
            <button
              type="button"
              onClick={onClose || onHide}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1 border border-white/10"
              title="Hide AI Canner Chat"
            >
              <X className="w-4 h-4" />
              <span>Hide Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Paywall Overlay Banner when NOT active trial */}
      {!isTrialActive && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-b border-amber-300/50 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-amber-900">
                Master Canner AI Live Chat is Locked Behind Pro
              </p>
              <p className="text-[11px] font-medium text-amber-800">
                Get unlimited instant 24/7 AI canning guidance, altitude calculators & USDA recipe checks.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenTrialModal}
            className="w-full sm:w-auto px-5 py-2 bg-[#FF8107] hover:bg-[#e06f00] text-white text-xs font-extrabold rounded-xl shadow-md transition-all shrink-0 flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start 15-Day Free Trial</span>
          </button>
        </div>
      )}

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-[#0D0D0D] text-white'
                  : 'bg-[#FF8107] text-white'
              }`}
            >
              {msg.role === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            {/* Bubble Content */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-[#0D0D0D] text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line">{msg.content}</div>
              <div
                className={`text-[9px] mt-1.5 font-semibold text-right ${
                  msg.role === 'user' ? 'text-gray-400' : 'text-gray-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-2xl bg-[#FF8107] text-white flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-2 text-xs font-bold text-gray-600">
              <RefreshCw className="w-4 h-4 text-[#FF8107] animate-spin" />
              <span>Master Canner AI is consulting USDA safety tables...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-gray-100/80 border-t border-gray-200/60 overflow-x-auto whitespace-nowrap space-x-2 no-scrollbar">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Quick Prompts:</span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-white hover:bg-orange-50 hover:text-[#FF8107] hover:border-[#FF8107]/40 border border-gray-200 rounded-full text-[11px] font-bold text-gray-700 transition-all shadow-2xs"
          >
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={!isTrialActive}
            placeholder={
              isTrialActive
                ? "Ask Master Canner AI about altitude, canning times, botulism, jar seals..."
                : "🔒 Chat is paywalled — Start 15-Day Free Trial to send messages"
            }
            className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#FF8107] focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          {isTrialActive ? (
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-5 py-3 rounded-2xl bg-[#FF8107] hover:bg-[#e06f00] text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-40"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenTrialModal}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock</span>
            </button>
          )}
        </form>
      </div>

    </div>
  );
};
