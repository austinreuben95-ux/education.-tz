import React, { useState } from 'react';
import { VOICE_LANGUAGES } from '../src/hooks/useVoiceToText';

interface VoiceToTextButtonProps {
  isListening: boolean;
  onToggle: () => void;
  langCode?: string;
  onLangChange?: (code: string) => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  showLangSelector?: boolean;
  className?: string;
}

export const VoiceToTextButton: React.FC<VoiceToTextButtonProps> = ({
  isListening,
  onToggle,
  langCode = 'sw',
  onLangChange,
  title = 'Record question or note with microphone',
  size = 'md',
  showLangSelector = false,
  className = '',
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  }[size];

  const currentLang = VOICE_LANGUAGES.find((l) => l.code === langCode) || VOICE_LANGUAGES[0];

  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      {/* Microphone Toggle Button */}
      <button
        type="button"
        onClick={onToggle}
        className={`relative rounded-2xl flex items-center justify-center transition-all cursor-pointer font-bold select-none ${sizeClasses} ${
          isListening
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 ring-4 ring-rose-400/30 active:scale-95'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 active:scale-95'
        }`}
        title={isListening ? 'Stop recording (Listening...)' : title}
        aria-label={isListening ? 'Stop recording' : title}
      >
        {isListening && (
          <span className="absolute inset-0 rounded-2xl bg-rose-400 animate-ping opacity-60 pointer-events-none"></span>
        )}
        <i
          className={`fa-solid fa-microphone ${
            isListening ? 'animate-pulse text-white' : ''
          }`}
        ></i>
      </button>

      {/* Language Indicator / Dropdown */}
      {showLangSelector && onLangChange && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-black text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition cursor-pointer"
            title="Change speech recognition language"
          >
            <span>{currentLang.flag}</span>
            <span className="uppercase">{currentLang.code}</span>
            <i className="fa-solid fa-chevron-down text-[8px] opacity-60"></i>
          </button>

          {showDropdown && (
            <div className="absolute right-0 bottom-full mb-1.5 z-50 w-36 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Spoken Language
              </div>
              <div className="max-h-48 overflow-y-auto">
                {VOICE_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      onLangChange(l.code);
                      setShowDropdown(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                      l.code === langCode
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </span>
                    {l.code === langCode && (
                      <i className="fa-solid fa-check text-[10px]"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
