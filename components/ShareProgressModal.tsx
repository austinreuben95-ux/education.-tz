import React, { useState } from 'react';

export interface ShareProgressProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  points: number;
  streak: number;
  completedTopicsCount: number;
  recentAchievement?: string;
  quizResult?: {
    topicTitle: string;
    score: number;
  };
  customTitle?: string;
}

export const ShareProgressModal: React.FC<ShareProgressProps> = ({
  isOpen,
  onClose,
  studentName = 'EducationTZ Scholar',
  points,
  streak,
  completedTopicsCount,
  recentAchievement = 'Active Learning on EducationTZ',
  quizResult,
  customTitle = 'Share Student Progress',
}) => {
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!isOpen) return null;

  const displayName = studentName.includes('@') ? studentName.split('@')[0] : studentName;

  // Build formatted text message
  let message = `🎓 *EducationTZ Student Progress Report* 🇹🇿\n\n`;
  message += `👤 *Student:* ${displayName}\n`;
  message += `🏆 *Total Score:* ${points} EP\n`;
  message += `🔥 *Study Streak:* ${streak} Days\n`;
  message += `✅ *Topics Mastered:* ${completedTopicsCount}\n`;
  
  if (quizResult) {
    message += `📝 *Latest Quiz Result:* ${quizResult.topicTitle} (${quizResult.score}% Score)\n`;
  } else if (recentAchievement) {
    message += `🌟 *Latest Milestone:* ${recentAchievement}\n`;
  }
  
  message += `\n🚀 Powered by EducationTZ - Tanzania Digital Learning Platform!`;

  const shareUrl = window.location.origin || 'https://educationtz.app';
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message + '\n' + shareUrl)}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EducationTZ Progress Report',
          text: message,
          url: shareUrl,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (err) {
        // User cancelled or share failed, stay in fallback modal
        console.log('Share dismissed or unavailable', err);
      }
    } else {
      // Fallback: copy to clipboard
      handleCopyText();
    }
  };

  const handleCopyText = () => {
    const fullText = `${message}\n${shareUrl}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-indigo-100 overflow-hidden relative text-left">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-indigo-200 hover:text-white bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30">
              <i className="fa-solid fa-share-nodes"></i>
            </div>
            <div>
              <h3 className="text-xl font-black">{customTitle}</h3>
              <p className="text-xs text-indigo-200 font-medium">Share achievements with parents, teachers & classmates</p>
            </div>
          </div>
        </div>

        {/* Modal Body & Report Preview */}
        <div className="p-6 space-y-5">
          {/* Card Preview Container */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 font-mono text-xs text-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-extrabold text-indigo-600 font-sans uppercase tracking-wider text-[11px]">
                Report Preview
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold font-sans text-[10px]">
                Ready to Send
              </span>
            </div>

            <div className="space-y-1.5 whitespace-pre-line leading-relaxed font-sans">
              <p className="font-black text-sm text-indigo-950">🎓 EducationTZ Progress Report 🇹🇿</p>
              <p><span className="font-bold text-gray-700">👤 Student:</span> {displayName}</p>
              <p><span className="font-bold text-gray-700">🏆 Points:</span> <strong className="text-amber-600 font-black">{points} EP</strong></p>
              <p><span className="font-bold text-gray-700">🔥 Study Streak:</span> <strong className="text-orange-600 font-black">{streak} Days</strong></p>
              <p><span className="font-bold text-gray-700">✅ Topics Mastered:</span> <strong className="text-emerald-600 font-black">{completedTopicsCount}</strong></p>
              {quizResult && (
                <p><span className="font-bold text-gray-700">📝 Recent Quiz:</span> <span className="bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">{quizResult.topicTitle} ({quizResult.score}%)</span></p>
              )}
            </div>
          </div>

          {/* Toast feedback */}
          {copied && (
            <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <i className="fa-solid fa-circle-check text-emerald-600 text-base"></i>
              <span>Progress report copied to clipboard! Paste it into any app.</span>
            </div>
          )}

          {shareSuccess && (
            <div className="p-3 bg-indigo-100 text-indigo-900 border border-indigo-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <i className="fa-solid fa-circle-check text-indigo-600 text-base"></i>
              <span>Report shared successfully!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            {/* Native Web Share API Button (if supported) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2.5 active:scale-[0.99]"
              >
                <i className="fa-solid fa-[#000000] fa-share-nodes text-base"></i>
                <span>Share via App (Web Share API)</span>
              </button>
            )}

            {/* Direct WhatsApp Share Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-200 transition flex items-center justify-center gap-2.5 text-center active:scale-[0.99]"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
              <span>Share Directly via WhatsApp</span>
            </a>

            {/* Copy Text Button */}
            <button
              onClick={handleCopyText}
              className="w-full py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs transition flex items-center justify-center gap-2 border border-gray-200"
            >
              <i className="fa-solid fa-copy text-gray-600"></i>
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Report Text'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
