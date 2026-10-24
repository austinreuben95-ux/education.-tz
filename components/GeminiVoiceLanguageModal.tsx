import React, { useState } from 'react';
import {
  GEMINI_PREBUILT_VOICES,
  SUPPORTED_LANGUAGES,
  GeminiVoice,
  SupportedLanguage
} from '../src/data/geminiVoicesAndLanguages';
import { playGeminiVoiceAudio, stopGeminiVoiceAudio } from '../services/geminiService';

interface GeminiVoiceLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVoiceId: string;
  selectedLanguageCode: string;
  onSelectVoice: (voiceId: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr') => void;
  onSelectLanguage: (langCode: 'sw' | 'en' | 'fr' | 'ar' | 'zh' | 'de' | 'es') => void;
}

export const GeminiVoiceLanguageModal: React.FC<GeminiVoiceLanguageModalProps> = ({
  isOpen,
  onClose,
  selectedVoiceId,
  selectedLanguageCode,
  onSelectVoice,
  onSelectLanguage
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'language'>('voice');
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentVoice = GEMINI_PREBUILT_VOICES.find(v => v.id === selectedVoiceId) || GEMINI_PREBUILT_VOICES[0];
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguageCode) || SUPPORTED_LANGUAGES[0];

  const handlePreviewVoice = (voice: GeminiVoice) => {
    if (previewingVoiceId === voice.id) {
      stopGeminiVoiceAudio();
      setPreviewingVoiceId(null);
      return;
    }

    setPreviewingVoiceId(voice.id);
    const phrase = currentLang.code === 'sw'
      ? `Jambo! Mimi ni sauti ya Gemini ya ${voice.name}. Ninafurahi kujifunza pamoja nawe leo!`
      : voice.samplePhrase;

    playGeminiVoiceAudio({
      text: phrase,
      voiceName: voice.id,
      language: currentLang.code,
      onStart: () => setPreviewingVoiceId(voice.id),
      onEnd: () => setPreviewingVoiceId(null),
      onError: () => setPreviewingVoiceId(null),
    });
  };

  const handlePreviewLanguage = (lang: SupportedLanguage) => {
    stopGeminiVoiceAudio();
    playGeminiVoiceAudio({
      text: lang.sampleGreeting,
      voiceName: currentVoice.id,
      language: lang.code,
      onStart: () => setPreviewingVoiceId(`lang-${lang.code}`),
      onEnd: () => setPreviewingVoiceId(null),
      onError: () => setPreviewingVoiceId(null),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Liquid Glass aesthetic */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <i className="fa-solid fa-waveform-lines text-base"></i>
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>Gemini Voice & Language Studio</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Google Gemini 2.5
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize Yun AI's official Gemini neural voice and curriculum languages
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopGeminiVoiceAudio();
              onClose();
            }}
            className="w-9 h-9 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-5 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('voice')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'voice'
                ? 'border-blue-600 text-blue-600 dark:text-cyan-400 dark:border-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <i className="fa-solid fa-microphone-lines"></i>
            <span>Gemini Voices ({GEMINI_PREBUILT_VOICES.length})</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black">
              {currentVoice.name}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('language')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'language'
                ? 'border-blue-600 text-blue-600 dark:text-cyan-400 dark:border-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <i className="fa-solid fa-language"></i>
            <span>Curriculum Languages ({SUPPORTED_LANGUAGES.length})</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black">
              {currentLang.flag} {currentLang.name}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'voice' ? (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50/80 dark:bg-blue-950/30 rounded-2xl border border-blue-200/60 dark:border-blue-800/40 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                  <i className="fa-solid fa-sparkles text-blue-600 dark:text-blue-400 text-sm"></i>
                  <span>
                    Powered by <strong>Gemini 3.8 Flash TTS</strong> neural speech synthesis. Select a voice below:
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreviewVoice(currentVoice)}
                  className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shrink-0 flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <i className={`fa-solid ${previewingVoiceId === currentVoice.id ? 'fa-square' : 'fa-play'}`}></i>
                  <span>{previewingVoiceId === currentVoice.id ? 'Stop' : 'Test Active'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GEMINI_PREBUILT_VOICES.map((voice) => {
                  const isSelected = selectedVoiceId === voice.id;
                  const isPlaying = previewingVoiceId === voice.id;

                  return (
                    <div
                      key={voice.id}
                      onClick={() => onSelectVoice(voice.id)}
                      className={`relative p-4 rounded-2xl border-2 transition cursor-pointer text-left flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-50/60 dark:bg-slate-800/90 border-blue-600 dark:border-cyan-400 shadow-md'
                          : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {/* Top Bar of Card */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${voice.gradient} text-white flex items-center justify-center text-sm shadow-xs`}>
                            <i className={voice.icon}></i>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                                {voice.displayName}
                              </h4>
                              {isSelected && (
                                <i className="fa-solid fa-circle-check text-blue-600 dark:text-cyan-400 text-xs"></i>
                              )}
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              {voice.genderTone}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {voice.badge}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                        {voice.description}
                      </p>

                      {/* Action buttons at bottom */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewVoice(voice);
                          }}
                          className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition ${
                            isPlaying
                              ? 'bg-rose-500 text-white animate-pulse'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <i className={`fa-solid ${isPlaying ? 'fa-stop' : 'fa-volume-high'}`}></i>
                          <span>{isPlaying ? 'Playing...' : 'Preview Voice'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectVoice(voice.id);
                          }}
                          className={`px-3 py-1 rounded-lg font-extrabold transition ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isSelected ? 'Active Voice ✓' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
                  <i className="fa-solid fa-globe text-emerald-600 dark:text-emerald-400 text-sm"></i>
                  <span>
                    Choose how Yun communicates. Speech recognition and Gemini output will adapt to this language!
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguageCode === lang.code;
                  const isPlaying = previewingVoiceId === `lang-${lang.code}`;

                  return (
                    <div
                      key={lang.code}
                      onClick={() => onSelectLanguage(lang.code)}
                      className={`p-3.5 rounded-2xl border-2 transition cursor-pointer text-left flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-emerald-50/60 dark:bg-slate-800/90 border-emerald-500 dark:border-emerald-400 shadow-md'
                          : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{lang.flag}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                              {lang.name}
                            </h4>
                            {isSelected && (
                              <i className="fa-solid fa-circle-check text-emerald-600 dark:text-emerald-400 text-xs"></i>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {lang.localName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewLanguage(lang);
                          }}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition ${
                            isPlaying
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                          title="Listen to sample greeting"
                        >
                          <i className={`fa-solid ${isPlaying ? 'fa-stop' : 'fa-volume-high'}`}></i>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLanguage(lang.code);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isSelected ? 'Active' : 'Choose'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>Active Settings:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {currentVoice.displayName} • {currentLang.flag} {langLabel(currentLang.code)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              stopGeminiVoiceAudio();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-sm transition active:scale-95 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const langLabel = (code: string) => {
  switch (code) {
    case 'sw': return 'Kiswahili';
    case 'en': return 'English';
    case 'fr': return 'Français';
    case 'ar': return 'العربية';
    case 'zh': return '中文';
    case 'de': return 'Deutsch';
    case 'es': return 'Español';
    default: return code;
  }
};
