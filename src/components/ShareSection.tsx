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
      setTimeout(function() { setCopied(false); }, 2000);
    } catch (err) {
      window.prompt('Copy this link:', SITE_URL);
    }
  };

  const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(SITE_URL);
  const twitterUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(SITE_URL) + '&text=' + encodeURIComponent(SHARE_TEXT);
  const pinterestUrl = 'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(SITE_URL) + '&description=' + encodeURIComponent(SHARE_TEXT);
  const emailBody = SHARE_TEXT + '\n\n' + SITE_URL;
  const emailUrl = 'mailto:?subject=' + encodeURIComponent('Check this out: JarCheck') + '&body=' + encodeURIComponent(emailBody);

  return (
    <div className="p-6 rounded-3xl bg-gray-950 border border-gray-800 space-y-4">
      <div className="flex items-center space-x-2 text-white">
        <Share2 className="w-4 h-4 text-[#FF8107]" />
        <span className="text-xs font-black uppercase tracking-wider">Know someone who cans? Share JarCheck</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">

        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center justify-center transition-colors shrink-0">
          f
        </a>

        <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 text-white font-black text-sm flex items-center justify-center transition-colors shrink-0">
          X
        </a>

        <a href={pinterestUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Pinterest" className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-sm flex items-center justify-center transition-colors shrink-0">
          P
        </a>

        <a href={emailUrl} aria-label="Share via Email" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors shrink-0">
          <Mail className="w-4 h-4" />
        </a>

        <button onClick={handleCopyLink} className="flex items-center space-x-2 px-4 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold transition-colors shrink-0">
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>

      </div>
    </div>
  );
};