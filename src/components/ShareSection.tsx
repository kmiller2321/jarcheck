import React, { useState } from 'react';
import { Share2, Mail, Link2, Check } from 'lucide-react';

const SITE_URL = 'https://jarcheck.com';
const SHARE_TEXT = 'JarCheck - check your home canning recipes for safety before you can, get printable labels, a digital pantry, and a new USDA-guided recipe every week.';
export const ShareSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', SITE_URL);
    }
  };

  const shareLinks = [
    {
      label: 'Facebook',
      bg: 'bg-[#1877F2] hover:bg-[#1465d1]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`,
      initial: 'f',
    },
    {
      label: 'X',
      bg: 'bg-black hover:bg-gray-800',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`,
      initial: 'X',
    },
    {
      label: 'Pinterest',
      bg: 'bg-[#E60023] hover:bg-[#c4001d]',
      href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(SITE_URL)}&description=${encodeURIComponent(SHARE_TEXT)}`,
      initial: 'P',
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-gray-950 border border-gray-800 space-y-4">
      <div className="flex items-center space-x-2 text-white">
        <Share2 className="w-4 h-4 text-[#FF8107]" />
        <span className="text-xs font-black uppercase tracking-wider">Know someone who cans? Share JarCheck</span>
      </div>

<div className="flex flex-wrap items-center gap-3">
        {shareLinks.map((link) => (
          
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.label}`}
            className={`w-10 h-10 rounded-full ${link.bg} text-white font-black text-sm flex items-center justify-center transition-colors shrink-0`}
          >
            {link.initial}
          </a>
        ))}
        
          href={`mailto:?subject=${encodeURIComponent('Check this out: JarCheck')}&body=${encodeURIComponent(`${SHARE_TEXT}\n\n${SITE_URL}`)}`}
          aria-label="Share via Email"
          className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors shrink-0"
        >
          <Mail className="w-4 h-4" />
        </a>

        <button
          onClick={handleCopyLink}
          className="flex items-center space-x-2 px-4 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold transition-colors shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
};