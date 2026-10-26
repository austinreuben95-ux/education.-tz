import React, { useState, useEffect } from 'react';
import { useVoiceToText, VOICE_LANGUAGES } from '../src/hooks/useVoiceToText';

interface VoiceNoteRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLanguage?: string;
  defaultTopic?: string;
  defaultSubject?: string;
  onPostToStudyRoom?: (data: {
    title: string;
    content: string;
    type: 'question' | 'tip' | 'trap' | 'formula';
    subjectId?: string;
  }) => void;
  onAskYunAI?: (spokenPrompt: string) => void;
}

export const VoiceNoteRecorderModal: React.FC<VoiceNoteRecorderModalProps> = ({
  isOpen,
  onClose,
  initialLanguage = 'sw',
  defaultTopic = '',
  defaultSubject = 'Physics',
  onPostToStudyRoom,
  onAskYunAI,
}) => {
  const [noteType, setNoteType] = useState<'question' | 'tip' | 'formula'>('question');
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    recordingSeconds,
    selectedLangCode,
    setSelectedLangCode,
    setTranscript,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
  } = useVoiceToText({
    initialLanguage,
    continuous: true,
  });

  // When opening modal, start with empty transcript or topic if provided
  useEffect(() => {
    if (isOpen) {
      if (defaultTopic && !noteTitle) {
        setNoteTitle(`Question regarding: ${defaultTopic}`);
      }
    } else {
      if (isListening) {
        stopListening();
      }
    }
  }, [isOpen, defaultTopic]);

  if (!isOpen) return null;

  const activeLang = VOICE_LANGUAGES.find((l) => l.code === selectedLangCode) || VOICE_LANGUAGES[0];

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleCopy = () => {
    const fullText = `${noteTitle ? noteTitle + '\n\n' : ''}${transcript}${
      interimTranscript ? ' ' + interimTranscript : ''
    }`;
    navigator.clipboard.writeText(fullText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostToRoom = () => {
    const content = (transcript + (interimTranscript ? ' ' + interimTranscript : '')).trim();
    if (!content) return;

    if (onPostToStudyRoom) {
      onPostToStudyRoom({
        title: noteTitle.trim() || `${noteType === 'question' ? 'Voice Question' : 'Voice Study Note'} (${activeLang.name})`,
        content,
        type: noteType,
      });
      onClose();
    }
  };

  const handleSendToYun = () => {
    const content = (transcript + (interimTranscript ? ' ' + interimTranscript : '')).trim();
    if (!content) return;

    if (onAskYunAI) {
      const fullPrompt = noteTitle.trim()
        ? `[Voice Recorded Question on ${noteTitle.trim()}]: ${content}`
        : content;
      onAskYunAI(fullPrompt);
      onClose();
    }
  };

  return (
    <div
      id="voice-note-recorder-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl w-full max-w-2xl text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400 text-lg shadow-inner">
              <i className="fa-solid fa-microphone-lines"></i>
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white flex items-center gap-2">
                <span>Voice Question & Note Studio</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  Voice-to-Text
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Speak your question or note into your microphone in Swahili, English, or any language
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-sm"
            title="Close modal"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Support Warning if not supported */}
          {!isSupported && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5">
              <i className="fa-solid fa-circle-exclamation text-rose-400 text-base"></i>
              <span>
                Speech recognition is not fully supported in this browser. Please try Google Chrome or Safari for speech recording.
              </span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2.5">
              <i className="fa-solid fa-triangle-exclamation text-amber-400 text-base"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Language and Post Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Language Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <i className="fa-solid fa-language text-indigo-400"></i>
                <span>Spoken Language:</span>
              </label>
              <select
                value={selectedLangCode}
                onChange={(e) => setSelectedLangCode(e.target.value)}
                disabled={isListening}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
              >
                {VOICE_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name} ({l.bcp47})
                  </option>
                ))}
              </select>
            </div>

            {/* Note Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <i className="fa-solid fa-tag text-amber-400"></i>
                <span>Target Action / Category:</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'question', label: 'Question ❓' },
                  { id: 'tip', label: 'Study Tip 💡' },
                  { id: 'formula', label: 'Formula 📐' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setNoteType(type.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-black transition cursor-pointer text-center ${
                      noteType === type.id
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Title / Topic Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Title / Topic (Optional):</span>
              <span className="text-[11px] text-slate-500 font-normal">e.g. Newton's 2nd Law, Organic Hydrocarbons</span>
            </label>
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="e.g. Swali la Kiswahili: Ushairi wa Kisasa..."
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* Central Recording Console */}
          <div
            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center space-y-4 ${
              isListening
                ? 'bg-rose-950/30 border-rose-500/80 ring-4 ring-rose-500/20'
                : 'bg-slate-800/50 border-slate-700'
            }`}
          >
            {/* Big Pulsing Mic Button */}
            <div className="relative">
              {isListening && (
                <>
                  <span className="absolute -inset-3 rounded-full bg-rose-500/30 animate-ping"></span>
                  <span className="absolute -inset-6 rounded-full bg-rose-500/10 animate-pulse"></span>
                </>
              )}
              <button
                type="button"
                onClick={() => toggleListening()}
                className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center gap-1 transition-all shadow-2xl cursor-pointer ${
                  isListening
                    ? 'bg-gradient-to-tr from-rose-600 to-red-500 text-white scale-105 ring-4 ring-white/30'
                    : 'bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white hover:scale-105 ring-4 ring-indigo-400/20'
                }`}
                title={isListening ? 'Tap to finish recording' : 'Tap to start recording voice'}
              >
                <i className={`fa-solid fa-microphone text-2xl sm:text-3xl ${isListening ? 'animate-pulse' : ''}`}></i>
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {isListening ? 'Stop' : 'Record'}
                </span>
              </button>
            </div>

            {/* Timer & Live Audio Status */}
            <div>
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isListening ? 'bg-rose-500 animate-ping' : 'bg-slate-600'
                  }`}
                ></span>
                <span className="text-base sm:text-lg font-mono font-black text-amber-300">
                  {isListening ? `Recording ${formatTimer(recordingSeconds)}` : 'Microphone Ready'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isListening
                  ? `Speaking in ${activeLang.name} ${activeLang.flag}. Yun is transcribing your words live...`
                  : `Tap the microphone button and start speaking your ${noteType}`}
              </p>
            </div>

            {/* Live Audio Visualizer Equalizer Waves */}
            {isListening && (
              <div className="flex items-center justify-center gap-1.5 h-8">
                {[
                  'h-3 bg-indigo-400',
                  'h-6 bg-rose-400',
                  'h-8 bg-amber-400',
                  'h-5 bg-emerald-400',
                  'h-7 bg-cyan-400',
                  'h-4 bg-purple-400',
                  'h-8 bg-rose-500',
                  'h-5 bg-amber-300',
                  'h-3 bg-indigo-400',
                ].map((cls, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 rounded-full animate-pulse ${cls}`}
                    style={{ animationDuration: `${0.4 + (idx % 3) * 0.2}s` }}
                  ></span>
                ))}
              </div>
            )}
          </div>

          {/* Real-Time Transcribed Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <i className="fa-solid fa-align-left text-indigo-400"></i>
                <span>Transcribed Speech (Editable):</span>
              </span>
              <div className="flex items-center gap-2">
                {transcript && (
                  <button
                    type="button"
                    onClick={resetTranscript}
                    className="text-slate-400 hover:text-rose-400 text-xs font-semibold transition cursor-pointer"
                  >
                    Clear text
                  </button>
                )}
                <span className="text-[11px] text-slate-500">
                  {transcript.length} chars
                </span>
              </div>
            </div>

            <div className="relative">
              <textarea
                rows={4}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={
                  isListening
                    ? "Listening... Your spoken words will appear here in real-time..."
                    : "Tap 'Record' above to speak, or type additional details here..."
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
              />

              {interimTranscript && (
                <div className="mt-1 px-2 text-xs font-semibold text-emerald-400 italic">
                  Live interim: {interimTranscript}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!transcript.trim()}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 disabled:opacity-40 cursor-pointer"
              title="Copy transcribed text to clipboard"
            >
              <i className={`fa-solid ${copied ? 'fa-check text-emerald-400' : 'fa-copy'}`}></i>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onAskYunAI && (
              <button
                type="button"
                onClick={handleSendToYun}
                disabled={!transcript.trim() && !interimTranscript.trim()}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 disabled:opacity-40 cursor-pointer active:scale-95"
              >
                <i className="fa-solid fa-brain text-amber-300"></i>
                <span>Ask Yun AI 💬</span>
              </button>
            )}

            {onPostToStudyRoom && (
              <button
                type="button"
                onClick={handlePostToRoom}
                disabled={!transcript.trim() && !interimTranscript.trim()}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/30 disabled:opacity-40 cursor-pointer active:scale-95"
              >
                <i className="fa-solid fa-paper-plane text-xs"></i>
                <span>Post to Study Room 🚀</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
