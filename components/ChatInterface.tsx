import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { streamMessageToYunDetailed, sendMessageToYunDetailed } from '../services/geminiService';

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

  // Adjust textarea height dynamically
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  // Handle Speech-to-Text
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
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
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = (customPrompt || input).trim();
    if (!promptToSend || isLoading) return;

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
            <div className="text-center sm:text-left">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Explore with Gemini Prompt Starters
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

      {/* Signature Floating Gemini Prompt Bar */}
      <footer className="p-4 bg-white border-t border-stone-200">
        <div className="relative max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2 bg-stone-50 hover:bg-white focus-within:bg-white border border-stone-300 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-200 rounded-3xl p-2 transition-all shadow-xs">
            {/* Microphone button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2.5 rounded-full transition flex items-center justify-center cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/70'
              }`}
              title={isListening ? "Listening... click to stop" : "Voice input"}
              aria-label="Voice input"
            >
              <i className="fa-solid fa-microphone text-sm"></i>
            </button>

            {/* Input textarea */}
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Yun anything about your syllabus, NECTA past papers, or concepts..."
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

          <p className="text-[11px] text-stone-400 text-center mt-2">
            Yun AI provides curriculum explanations based on TIE & NECTA guidelines. Always verify with official syllabi.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;
