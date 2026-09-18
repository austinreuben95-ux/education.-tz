import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { streamMessageToYunDetailed, sendMessageToYunDetailed } from '../services/geminiService';
import { playMicStartSound, playMicStopSound } from '../src/utils/soundEffects';

interface ChatInterfaceProps {
  initialContext?: string;
  initialPrompt?: string;
  onClose?: () => void;
}

// Clean markdown text before speaking with speech synthesis
const sanitizeTextForSpeech = (rawText: string): string => {
  return rawText
    .replace(/```[\s\S]*?```/g, 'Code block omitted.')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[-*_]{3,}/g, '')
    .replace(/\n+/g, '. ')
    .trim();
};

// Formatted Markdown component for Gemini-style responses
const FormattedGeminiMessage: React.FC<{ text: string }> = ({ text }) => {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Pre-process fenced code blocks
  const segments: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.substring(lastIndex, match.index) });
    }
    segments.push({
      type: 'code',
      language: match[1] || 'code',
      content: match[2].trimEnd(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.substring(lastIndex) });
  }

  const renderInlineStyles = (lineText: string): React.ReactNode => {
    const parts = lineText.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code key={pIdx} className="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded text-xs font-mono border border-stone-200">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={pIdx} className="font-bold text-stone-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={pIdx} className="italic text-stone-800">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-3 leading-relaxed text-sm sm:text-base text-stone-800 font-sans">
      {segments.map((seg, segIdx) => {
        if (seg.type === 'code') {
          return (
            <div key={segIdx} className="my-3 rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 text-stone-100 shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 bg-stone-800/90 border-b border-stone-700/80 text-xs font-mono">
                <span className="uppercase text-[11px] font-semibold tracking-wider text-amber-300">{seg.language || 'Code / Formula'}</span>
                <button
                  type="button"
                  onClick={() => copyCode(seg.content, segIdx)}
                  className="hover:text-amber-200 text-stone-300 transition flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  <i className={`fa-solid ${copiedCodeIdx === segIdx ? 'fa-check text-emerald-400' : 'fa-copy'}`}></i>
                  <span>{copiedCodeIdx === segIdx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto scrollbar-thin">
                <code>{seg.content}</code>
              </pre>
            </div>
          );
        }

        const lines = seg.content.split('\n');
        return (
          <div key={segIdx} className="space-y-2">
            {lines.map((line, idx) => {
              const trimmed = line.trim();

              if (trimmed === '---' || trimmed === '***') {
                return <hr key={idx} className="my-3 border-stone-200" />;
              }

              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={idx} className="text-stone-900 font-bold text-base mt-3 mb-1">
                    {renderInlineStyles(trimmed.replace(/^###\s+/, ''))}
                  </h4>
                );
              }

              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={idx} className="text-stone-900 font-bold text-lg mt-4 mb-2 pb-1 border-b border-stone-200">
                    {renderInlineStyles(trimmed.replace(/^##\s+/, ''))}
                  </h3>
                );
              }

              if (trimmed.startsWith('# ')) {
                return (
                  <h2 key={idx} className="text-stone-900 font-extrabold text-xl mt-4 mb-2">
                    {renderInlineStyles(trimmed.replace(/^#\s+/, ''))}
                  </h2>
                );
              }

              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div key={idx} className="flex items-start gap-2.5 ml-2 my-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-500 mt-2 shrink-0"></span>
                    <span className="text-stone-700 leading-relaxed flex-1">
                      {renderInlineStyles(trimmed.replace(/^[-*]\s+/, ''))}
                    </span>
                  </div>
                );
              }

              const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
              if (numberedMatch) {
                return (
                  <div key={idx} className="flex items-start gap-2.5 ml-2 my-1">
                    <span className="font-semibold text-stone-900 text-xs px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 shrink-0">
                      {numberedMatch[1]}
                    </span>
                    <span className="text-stone-700 leading-relaxed flex-1">
                      {renderInlineStyles(numberedMatch[2])}
                    </span>
                  </div>
                );
              }

              if (trimmed === '') {
                return <div key={idx} className="h-1.5" />;
              }

              return (
                <p key={idx} className="leading-relaxed text-stone-800">
                  {renderInlineStyles(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// Gemini Sparkle Icon component
const GeminiSparkle: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z"
      fill="url(#gemini-sparkle-grad)"
    />
    <defs>
      <linearGradient id="gemini-sparkle-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4285F4" />
        <stop offset="0.5" stopColor="#9B72CB" />
        <stop offset="1" stopColor="#D96570" />
      </linearGradient>
    </defs>
  </svg>
);

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  initialContext,
  initialPrompt,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'initial-gemini-welcome',
        role: 'model',
        text: initialContext
          ? `Jambo! I'm Yun AI, your NECTA & secondary syllabus assistant powered by Gemini. I see you're studying:\n\n> ${initialContext}\n\nHow can I help you master this concept today?`
          : "Jambo! I'm Yun AI, your Tanzanian curriculum study companion powered by Gemini. You can ask me to explain any topic from Form 1 to Form 6, solve NECTA exam questions step-by-step, generate practice quizzes, or translate academic terms in Kiswahili. What would you like to explore today?",
        timestamp: new Date(),
      },
    ];
  });

  const [input, setInput] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState<'en-US' | 'sw-TZ'>('en-US');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [autoSpeakReplies, setAutoSpeakReplies] = useState(false);
  const [lastInputWasVoice, setLastInputWasVoice] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, scrollToBottom]);

  // Cleanup speech synthesis & recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  // Start Speech-to-Text with microphone permission check & real-time interim recognition
  const startListening = async () => {
    // Stop any active speech synthesis so it doesn't feed into the microphone
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setVoiceError(null);
    setInterimTranscript('');

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setVoiceError('Voice speech recognition is not supported in this browser. Please use Chrome, Edge, Safari, or a compatible mobile browser to speak to Yun.');
      return;
    }

    // Verify microphone hardware & user permission
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Close audio track immediately after verification; SpeechRecognition will open its own session
        stream.getTracks().forEach(t => t.stop());
      } catch (err: any) {
        console.warn('Microphone permission check warning:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setVoiceError('Microphone permission was denied. Please allow microphone access in your browser address bar to speak to Yun.');
          return;
        }
      }
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLang;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        playMicStartSound();
      };

      recognition.onresult = (event: any) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalStr += res[0].transcript + ' ';
          } else {
            interimStr += res[0].transcript;
          }
        }

        if (finalStr) {
          setInput(prev => {
            const clean = prev.trim();
            return clean ? `${clean} ${finalStr.trim()}` : finalStr.trim();
          });
          setLastInputWasVoice(true);
        }

        setInterimTranscript(interimStr);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setVoiceError('Microphone access is blocked. Please tap the lock/tune icon in your browser address bar to allow microphone access.');
        } else if (event.error === 'no-speech') {
          setVoiceError('No speech detected. Please speak closer to your device and try again!');
        } else if (event.error === 'audio-capture') {
          setVoiceError('No microphone detected. Please connect or enable your microphone.');
        } else if (event.error !== 'aborted') {
          setVoiceError(`Microphone issue (${event.error}). Please try again!`);
        }
        setIsListening(false);
        playMicStopSound();
      };

      recognition.onend = () => {
        setIsListening(false);
        playMicStopSound();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Speech recognition initiation error:', err);
      setVoiceError('Unable to start speech recognition. Please check your microphone settings.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
    playMicStopSound();
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Text-to-Speech (Read aloud like Gemini)
  const speakMessage = (text: string) => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = sanitizeTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // Slightly slower, crystal clear for younger learners
    utterance.pitch = 1.0;
    if (speechLang === 'sw-TZ') {
      utterance.lang = 'sw-TZ';
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = (customPrompt || input).trim();
    if (!promptToSend || isLoading) return;

    // If microphone is active, stop it before sending
    if (isListening) {
      stopListening();
    }
    setInterimTranscript('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: promptToSend,
      timestamp: new Date(),
    };

    const botMsgId = (Date.now() + 1).toString();
    const placeholderBotMsg: ChatMessage = {
      id: botMsgId,
      role: 'model',
      text: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, placeholderBotMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));

    try {
      const response = await streamMessageToYunDetailed(
        userMsg.text,
        history,
        {
          model: 'gemini-3.1-flash-lite',
          role: 'default',
          useSearchGrounding: false,
          deepThinking: false,
          onChunk: (_delta, accumulatedText) => {
            setMessages(prev =>
              prev.map(m =>
                m.id === botMsgId
                  ? { ...m, text: accumulatedText, isStreaming: true }
                  : m
              )
            );
            scrollToBottom(false);
          },
        }
      );

      setMessages(prev =>
        prev.map(m =>
          m.id === botMsgId
            ? {
                ...m,
                text: response.text,
                isStreaming: false,
                groundingSources: response.groundingSources,
                modelUsed: response.modelUsed,
              }
            : m
        )
      );

      // Auto-read response aloud for younger learners or when voice mode was used
      if (autoSpeakReplies || lastInputWasVoice) {
        speakMessage(response.text);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages(prev =>
        prev.map(m =>
          m.id === botMsgId
            ? {
                ...m,
                text: "Jambo! Asante kwa kuniuliza. Yun amepata changamoto ndogo ya mtandao, lakini nipo tayari kukusaidia. Tafadhali bonyeza kitufe cha 'Regenerate' au jaribu kutuma tena swali lako!",
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      scrollToBottom(true);
    }
  };

  // Immediate send from voice mode
  const handleVoiceSend = () => {
    stopListening();
    const promptToSend = (input.trim() || interimTranscript.trim());
    if (promptToSend) {
      setLastInputWasVoice(true);
      handleSend(promptToSend);
      setInterimTranscript('');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRegenerate = () => {
    // Find last user message
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.text);
    }
  };

  const clearChat = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setMessages([
      {
        id: 'new-start-gemini',
        role: 'model',
        text: 'Jambo! Conversation refreshed. What subject or NECTA exam topic would you like to explore now?',
        timestamp: new Date(),
      },
    ]);
  };

  const promptSuggestions = [
    {
      title: 'Solve Math Step-by-Step',
      desc: 'Form 4 Quadratic Equations & Quadratic Formula',
      icon: 'fa-square-root-variable',
      prompt: 'Show me step-by-step working for solving quadratic equations using the quadratic formula with 2 examples common in NECTA CSEE exams.',
    },
    {
      title: 'Form 4 Biology Summary',
      desc: 'Leaf Internal Structure & Photosynthesis',
      icon: 'fa-leaf',
      prompt: 'Explain the internal structure of a dicotyledonous leaf and how each cell layer is adapted for photosynthesis.',
    },
    {
      title: 'NECTA Chemistry Quiz',
      desc: '3 Practice Questions on Acids, Bases & Salts',
      icon: 'fa-flask-vial',
      prompt: 'Generate 3 realistic NECTA Form 4 exam questions on Acids, Bases, and Salts with complete marking schemes and model answers.',
    },
    {
      title: 'Fasihi ya Kiswahili',
      desc: 'Tamathali za Semi na Mifano Yake',
      icon: 'fa-book-open',
      prompt: 'Eleza kwa kina maana ya tamathali za semi (tashbiha, sitiari, tashhisi) na mifano mitatu kwa kila moja kama inavyotahiniwa na NECTA.',
    },
  ];

  return (
    <div className="flex flex-col h-[85vh] md:h-[760px] w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden font-sans">
      {/* Top Gemini-Style Header */}
      <header className="px-5 py-3.5 bg-white/95 backdrop-blur-md border-b border-stone-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-50 via-indigo-50 to-purple-50 border border-stone-200 flex items-center justify-center shadow-xs">
            <GeminiSparkle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-900 text-base leading-tight flex items-center gap-1.5">
                Yun AI
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Gemini 3.1 Flash
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-normal">
              Tanzanian Secondary Education & NECTA Syllabus Tutor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Read Aloud Toggle for Younger Learners */}
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) {
                window.speechSynthesis?.cancel();
                setIsSpeaking(false);
              }
              setAutoSpeakReplies(prev => !prev);
            }}
            className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 border ${
              autoSpeakReplies
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 border-stone-200'
            }`}
            title={autoSpeakReplies ? "Auto-reading answers aloud is ON" : "Enable auto-reading answers aloud for younger learners"}
            aria-label="Auto-read answers aloud"
          >
            <i className={`fa-solid ${autoSpeakReplies ? 'fa-volume-high text-amber-600' : 'fa-volume-slash text-stone-400'}`}></i>
            <span className="hidden md:inline">{autoSpeakReplies ? 'Read Aloud: On' : 'Read Aloud'}</span>
          </button>

          {/* Clear chat */}
          <button
            type="button"
            onClick={clearChat}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-transparent hover:border-stone-200 transition cursor-pointer flex items-center gap-1.5"
            title="Start fresh conversation"
          >
            <i className="fa-solid fa-rotate-right text-xs"></i>
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {/* Close / Exit if provided */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-100 flex items-center justify-center transition cursor-pointer"
              title="Close chat"
              aria-label="Close chat"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          )}
        </div>
      </header>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 scrollbar-thin bg-[#faf9f5]/40">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-[75%] bg-stone-100 text-stone-900 rounded-3xl rounded-tr-md px-5 py-3.5 border border-stone-200 shadow-2xs">
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal">
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex items-start gap-3.5 max-w-[92%] sm:max-w-[88%]">
              <div className="w-8 h-8 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-center shrink-0 mt-1">
                <GeminiSparkle className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="bg-white rounded-3xl rounded-tl-md p-5 sm:p-6 border border-stone-200/90 shadow-xs">
                  {msg.isStreaming && !msg.text ? (
                    <div className="flex items-center gap-2 text-stone-400 py-2">
                      <GeminiSparkle className="w-4 h-4 animate-spin text-indigo-500" />
                      <span className="text-sm font-medium animate-pulse">Yun is thinking...</span>
                    </div>
                  ) : (
                    <FormattedGeminiMessage text={msg.text} />
                  )}

                  {msg.isStreaming && msg.text && (
                    <span className="inline-block w-2 h-4 ml-1 bg-indigo-500 animate-pulse rounded-xs" />
                  )}
                </div>

                {/* Gemini Action Bar below AI message */}
                {!msg.isStreaming && msg.text && (
                  <div className="flex items-center gap-1 text-stone-400 text-xs px-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="p-1.5 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition flex items-center gap-1 cursor-pointer"
                      title="Copy response"
                    >
                      <i className={`fa-solid ${copiedId === msg.id ? 'fa-check text-emerald-600' : 'fa-copy'}`}></i>
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => speakMessage(msg.text)}
                      className="p-1.5 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition flex items-center gap-1 cursor-pointer"
                      title={isSpeaking ? "Stop speaking" : "Listen to answer"}
                    >
                      <i className={`fa-solid ${isSpeaking ? 'fa-stop text-red-500' : 'fa-volume-high'}`}></i>
                      <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRegenerate}
                      className="p-1.5 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition flex items-center gap-1 cursor-pointer"
                      title="Regenerate response"
                    >
                      <i className="fa-solid fa-arrows-rotate"></i>
                      <span>Retry</span>
                    </button>

                    <div className="h-3 w-px bg-stone-200 mx-1" />

                    <button
                      type="button"
                      onClick={() => setFeedbackGiven(prev => ({ ...prev, [msg.id]: 'up' }))}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        feedbackGiven[msg.id] === 'up' ? 'text-emerald-600 font-bold' : 'hover:text-stone-700 hover:bg-stone-100'
                      }`}
                      title="Helpful response"
                    >
                      <i className="fa-solid fa-thumbs-up"></i>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFeedbackGiven(prev => ({ ...prev, [msg.id]: 'down' }))}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        feedbackGiven[msg.id] === 'down' ? 'text-rose-600 font-bold' : 'hover:text-stone-700 hover:bg-stone-100'
                      }`}
                      title="Needs improvement"
                    >
                      <i className="fa-solid fa-thumbs-down"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Suggestion Cards when conversation is fresh */}
        {messages.length <= 1 && (
          <div className="pt-4 space-y-3">
            {/* Primary Young Learner Voice Question Starter */}
            <button
              type="button"
              onClick={startListening}
              className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.008] active:scale-[0.99] cursor-pointer group flex items-center justify-between gap-4 border border-emerald-500/40 shadow-sm"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-xl shadow-inner group-hover:scale-110 group-hover:bg-white/25 transition-transform shrink-0">
                  <i className="fa-solid fa-microphone"></i>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="font-extrabold text-sm sm:text-base text-white">
                      Speak Your Question to Yun
                    </h5>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-stone-900 uppercase tracking-wide shadow-2xs">
                      Young Learners 🎙️
                    </span>
                  </div>
                  <p className="text-xs text-white/90 mt-0.5">
                    Don't want to type? Tap here and speak your question in English or Kiswahili — Yun will listen and answer!
                  </p>
                </div>
              </div>
              <span className="px-3.5 py-2 rounded-xl bg-white text-emerald-900 font-extrabold text-xs shrink-0 group-hover:bg-amber-300 transition-colors shadow-xs flex items-center gap-1.5">
                <span>Start Speaking</span>
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </span>
            </button>

            <div className="text-center sm:text-left pt-2">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Or Explore with Gemini Prompt Starters
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {promptSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(item.prompt)}
                  className="p-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-left transition-all duration-200 hover:shadow-sm cursor-pointer group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-stone-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 text-stone-600 flex items-center justify-center shrink-0 text-sm transition-colors">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-stone-900 text-xs sm:text-sm group-hover:text-indigo-600 transition-colors truncate">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Signature Floating Gemini Prompt Bar with Microphone Access */}
      <footer className="p-4 bg-white border-t border-stone-200">
        <div className="relative max-w-4xl mx-auto">
          {/* Microphone Permission / Recognition Error Banner */}
          {voiceError && (
            <div className="mb-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start justify-between gap-3 text-xs shadow-xs animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5">
                <i className="fa-solid fa-triangle-exclamation text-amber-600 mt-0.5 text-base"></i>
                <div>
                  <p className="font-bold text-amber-950">Microphone Notice</p>
                  <p className="text-amber-800 mt-0.5 leading-relaxed">{voiceError}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={startListening}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition shadow-2xs cursor-pointer"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceError(null)}
                  className="w-6 h-6 rounded-full hover:bg-amber-200/80 text-amber-700 flex items-center justify-center transition cursor-pointer"
                  title="Dismiss error"
                  aria-label="Dismiss error"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              </div>
            </div>
          )}

          {/* Interactive Live Voice Overlay for Younger Learners */}
          {isListening && (
            <div className="mb-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-rose-500 text-white shadow-sm shrink-0">
                    <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-75"></span>
                    <i className="fa-solid fa-microphone text-sm relative z-10"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs sm:text-sm text-emerald-950">
                        {speechLang === 'sw-TZ' ? 'Yun anakusikiliza... Ongea sasa!' : 'Yun is listening... Speak now!'}
                      </span>
                      {/* Animated live sound wave equalizer */}
                      <div className="flex items-center gap-1 h-3.5" aria-hidden="true">
                        <span className="w-1 bg-emerald-600 rounded-full animate-pulse h-3"></span>
                        <span className="w-1 bg-teal-600 rounded-full animate-pulse h-4 delay-75"></span>
                        <span className="w-1 bg-sky-600 rounded-full animate-pulse h-2.5 delay-150"></span>
                        <span className="w-1 bg-emerald-600 rounded-full animate-pulse h-4 delay-100"></span>
                        <span className="w-1 bg-rose-500 rounded-full animate-pulse h-3 delay-200"></span>
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      {speechLang === 'sw-TZ' ? 'Ongea swali lako kwa sauti ya kawaida' : 'Speak your question clearly into your microphone'}
                    </p>
                  </div>
                </div>

                {/* Speech Language Switcher */}
                <div className="flex items-center gap-1 bg-white/90 p-1 rounded-xl border border-emerald-200 text-xs font-bold shadow-2xs">
                  <span className="text-[10px] text-stone-400 uppercase px-1">Lang:</span>
                  <button
                    type="button"
                    onClick={() => setSpeechLang('en-US')}
                    className={`px-2 py-0.5 rounded-lg transition text-xs ${
                      speechLang === 'en-US'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeechLang('sw-TZ')}
                    className={`px-2 py-0.5 rounded-lg transition text-xs ${
                      speechLang === 'sw-TZ'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    🇹🇿 Kiswahili
                  </button>
                </div>
              </div>

              {/* Real-time speech transcript bubble */}
              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs min-h-[50px] flex items-center">
                <p className="text-sm sm:text-base font-medium text-stone-900 leading-snug">
                  {input || interimTranscript ? (
                    <span>
                      {input}{' '}
                      <span className="text-emerald-700 font-semibold italic">
                        {interimTranscript}
                      </span>
                    </span>
                  ) : (
                    <span className="text-stone-400 italic">
                      {speechLang === 'sw-TZ'
                        ? 'Mfano: "Eleza kazi ya moyo" au "Nini maana ya gravity?"'
                        : 'Example: "What causes tides?" or "Explain the carbon cycle"...'}
                    </span>
                  )}
                </p>
              </div>

              {/* Action Buttons for Young Learners */}
              <div className="flex items-center justify-between gap-2 mt-2.5">
                <button
                  type="button"
                  onClick={() => {
                    stopListening();
                    setInterimTranscript('');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/60 transition cursor-pointer"
                >
                  <i className="fa-solid fa-xmark mr-1"></i>
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={stopListening}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 transition shadow-2xs cursor-pointer"
                    title="Stop microphone and keep recognized text in prompt box"
                  >
                    <i className="fa-solid fa-pen-to-square mr-1 text-stone-500"></i>
                    Keep Text
                  </button>

                  <button
                    type="button"
                    onClick={handleVoiceSend}
                    disabled={!(input.trim() || interimTranscript.trim())}
                    className={`px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition cursor-pointer ${
                      input.trim() || interimTranscript.trim()
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Send to Yun</span>
                    <i className="fa-solid fa-paper-plane text-[10px]"></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="relative flex items-end gap-2 bg-stone-50 hover:bg-white focus-within:bg-white border border-stone-300 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-200 rounded-3xl p-2 transition-all shadow-xs">
            {/* Microphone button & Language indicator */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2.5 rounded-full transition flex items-center justify-center cursor-pointer shrink-0 relative ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                }`}
                title={isListening ? "Yun is listening... Tap to finish" : "Speak to Yun (Voice input for young learners)"}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening && (
                  <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-60"></span>
                )}
                <i className={`fa-solid fa-microphone text-sm relative z-10 ${isListening ? 'animate-pulse' : ''}`}></i>
              </button>

              {/* Quick Language Pill toggle */}
              <button
                type="button"
                onClick={() => setSpeechLang(prev => prev === 'en-US' ? 'sw-TZ' : 'en-US')}
                className="px-2 py-1 rounded-full bg-stone-200/80 hover:bg-stone-300/80 text-[10px] font-black text-stone-700 transition cursor-pointer"
                title={`Speech recognition language: ${speechLang === 'en-US' ? 'English' : 'Kiswahili'}. Click to toggle.`}
                aria-label={`Toggle speech language, currently ${speechLang === 'en-US' ? 'English' : 'Kiswahili'}`}
              >
                {speechLang === 'en-US' ? 'EN' : 'SW'}
              </button>
            </div>

            {/* Input textarea */}
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening to your voice..." : "Ask Yun anything, or tap the microphone to speak..."}
              className="flex-1 max-h-36 bg-transparent border-0 resize-none px-2 py-1.5 text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-0 leading-relaxed font-sans"
            />

            {/* Send button */}
            <button
              type="button"
              disabled={!input.trim() || isLoading}
              onClick={() => handleSend()}
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                input.trim() && !isLoading
                  ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-sm'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
              title="Send message"
              aria-label="Send message"
            >
              <i className="fa-solid fa-arrow-up text-xs font-bold"></i>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 text-[11px] text-stone-400 text-center mt-2 px-1">
            <span>
              Yun AI provides curriculum explanations based on TIE & NECTA guidelines.
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <i className="fa-solid fa-microphone text-[10px]"></i>
              Voice Question Enabled
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;
