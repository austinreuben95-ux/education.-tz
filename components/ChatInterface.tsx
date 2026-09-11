import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { streamMessageToYunDetailed, sendMessageToYunDetailed } from '../services/geminiService';
import { INITIAL_GREETING } from '../constants';
import { YunAvatar3D } from './YunAvatar3D';

interface ChatInterfaceProps {
  initialContext?: string; // Context passed if student clicked "Ask Yun" or quiz mistake diagnosis
  initialPrompt?: string; // Pre-populated prompt for the input
  onClose?: () => void;
}

// Clean markdown text before speaking with speech synthesis
const sanitizeTextForSpeech = (rawText: string): string => {
  return rawText
    // Remove fenced code blocks
    .replace(/```[\s\S]*?```/g, 'Code block omitted.')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold and italics
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove bullet points
    .replace(/^[-*+]\s+/gm, '')
    // Remove numbered lists markers
    .replace(/^\d+\.\s+/gm, '')
    // Remove links [title](url) -> title
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove horizontal rules
    .replace(/[-*_]{3,}/g, '')
    // Replace multiple spaces/newlines
    .replace(/\n+/g, '. ')
    .trim();
};

// Helper to render markdown nicely for Yun AI responses
const FormattedYunMessage: React.FC<{ text: string; textSize: 'normal' | 'large' }> = ({ text, textSize }) => {
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

  return (
    <div className={`space-y-3 leading-relaxed ${textSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
      {segments.map((seg, segIdx) => {
        if (seg.type === 'code') {
          return (
            <div key={segIdx} className="my-3 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950/90 shadow-md">
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
                <span className="uppercase text-[10px] font-bold tracking-wider text-cyan-400">{seg.language || 'Code / Formula'}</span>
                <button
                  onClick={() => copyCode(seg.content, segIdx)}
                  className="hover:text-cyan-300 transition flex items-center gap-1 text-[11px]"
                >
                  <i className={`fa-solid ${copiedCodeIdx === segIdx ? 'fa-check text-emerald-400' : 'fa-copy'}`}></i>
                  <span>{copiedCodeIdx === segIdx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3.5 text-xs sm:text-sm font-mono text-cyan-200 overflow-x-auto scrollbar-thin">
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

              // Horizontal divider
              if (trimmed === '---' || trimmed === '***') {
                return <hr key={idx} className="my-3 border-slate-800" />;
              }

              // Heading 3 / Subheading
              if (trimmed.startsWith('### ')) {
                const headingText = trimmed.replace(/^###\s+/, '');
                return (
                  <h4 key={idx} className="text-cyan-300 font-extrabold text-sm sm:text-base tracking-wide mt-3 mb-1 flex items-center gap-1.5">
                    {renderInlineStyles(headingText)}
                  </h4>
                );
              }

              // Heading 2
              if (trimmed.startsWith('## ')) {
                const headingText = trimmed.replace(/^##\s+/, '');
                return (
                  <h3 key={idx} className="text-white font-black text-base sm:text-lg tracking-wide mt-3.5 mb-1.5 border-b border-indigo-500/20 pb-1">
                    {renderInlineStyles(headingText)}
                  </h3>
                );
              }

              // Heading 1
              if (trimmed.startsWith('# ')) {
                const headingText = trimmed.replace(/^#\s+/, '');
                return (
                  <h2 key={idx} className="text-white font-black text-lg sm:text-xl tracking-wide mt-4 mb-2">
                    {renderInlineStyles(headingText)}
                  </h2>
                );
              }

              // Blockquote / Tip callout
              if (trimmed.startsWith('> ')) {
                const quoteText = trimmed.replace(/^>\s+/, '');
                return (
                  <div key={idx} className="my-2 p-3 rounded-xl bg-cyan-950/40 border-l-4 border-cyan-400 text-cyan-100 text-xs sm:text-sm">
                    {renderInlineStyles(quoteText)}
                  </div>
                );
              }

              // Bullet list item
              if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                const itemText = trimmed.replace(/^[*|-]\s+/, '');
                return (
                  <div key={idx} className="flex items-start gap-2 pl-2">
                    <span className="text-cyan-400 mt-1 text-xs">•</span>
                    <div className="flex-1 text-slate-200">{renderInlineStyles(itemText)}</div>
                  </div>
                );
              }

              // Numbered list item
              const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
              if (numberedMatch) {
                return (
                  <div key={idx} className="flex items-start gap-2 pl-2">
                    <span className="text-xs font-bold text-amber-300 mt-0.5 shrink-0 bg-amber-400/10 px-1.5 py-0.5 rounded-md border border-amber-400/30">
                      {numberedMatch[1]}.
                    </span>
                    <div className="flex-1 text-slate-200">{renderInlineStyles(numberedMatch[2])}</div>
                  </div>
                );
              }

              // Blank line
              if (!trimmed) {
                return <div key={idx} className="h-1.5" />;
              }

              // Regular paragraph
              return (
                <p key={idx} className="text-slate-100">
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

// Parse bold, italics, inline code, and mathematical formulas
const renderInlineStyles = (content: string) => {
  const parts = content.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*|\$.*?\$)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-cyan-200">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-xs border border-slate-700">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      return (
        <span key={i} className="px-1.5 py-0.5 rounded bg-indigo-950/70 text-cyan-300 font-mono text-xs border border-indigo-500/40">
          {part.slice(1, -1)}
        </span>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} className="italic text-cyan-100/90">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
};

const CURIOSITY_CHIPS = [
  "🧠 Why is Lake Natron alkaline & red from first principles?",
  "📐 Step-by-step NECTA proof: Circle Theorems & tangent rules",
  "⚡ How does Julius Nyerere Hydropower Dam generate electricity?",
  "🚀 Derive the Quadratic Formula step-by-step",
  "🇹🇿 NECTA Examiner: Where do students lose marks in Kiswahili Sarufi?",
  "🧬 How does human DNA transcribe genetic code into proteins?",
  "💡 Give me a high-yield NECTA calculation shortcut!",
  "👋 Habari Yun! Nipangie ratiba ya masomo ya wiki hii"
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialContext, initialPrompt, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: initialContext 
        ? `Jambo! I see you are exploring "${initialContext}". What specific question, derivation, or concept would you like to unpack step-by-step today?` 
        : INITIAL_GREETING,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');
  const [notification, setNotification] = useState<string | null>(null);

  // Gemini Intelligence & Cognitive Reasoning Settings
  const [selectedModel, setSelectedModel] = useState<'gemini-3.1-flash-lite' | 'gemini-3.8-flash' | 'gemini-3.1-pro-preview'>('gemini-3.8-flash');
  const [selectedRole, setSelectedRole] = useState<'default' | 'necta_examiner' | 'stem_mentor' | 'kiswahili_fasihi'>('default');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(false);
  const [deepThinking, setDeepThinking] = useState<boolean>(true); // User requested Yun to think more deeper!

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastProcessedContextRef = useRef<string | undefined>(undefined);
  const lastProcessedPromptRef = useRef<string | undefined>(initialPrompt);

  // Smart auto-scroll: only scrolls if user is already near bottom
  const scrollToBottom = useCallback((force: boolean = false) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 160;

    if (force || isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Handle updates to initialPrompt (e.g. from "Ask Yun for a Deeper Dive")
  useEffect(() => {
    if (initialPrompt && initialPrompt !== lastProcessedPromptRef.current) {
      lastProcessedPromptRef.current = initialPrompt;
      setInput(initialPrompt);
      setDeepThinking(true); // Deeper dive prompts engage deep reasoning
    }
  }, [initialPrompt]);

  // Handle updates to initialContext (e.g. from quiz mistake feedback or syllabus click)
  useEffect(() => {
    if (initialContext && initialContext !== lastProcessedContextRef.current) {
      lastProcessedContextRef.current = initialContext;
      const contextMsg: ChatMessage = {
        id: `ctx-${Date.now()}`,
        role: 'model',
        text: `Jambo! I received your context: "${initialContext}". How would you like me to break this down for you?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, contextMsg]);
      // If the context looks like an actionable prompt and no initialPrompt is present, also pre-fill the input
      if (!initialPrompt && initialContext.length < 150) {
        setInput(`Explain ${initialContext} in detail`);
      }
    }
  }, [initialContext, initialPrompt]);

  // Speech synthesis with robust garbage-collection prevention and markdown stripping
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      showNotification("Speech synthesis is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = sanitizeTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    // Prefer English/Swahili voices if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('sw') || v.lang.startsWith('en'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      speechUtteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      speechUtteranceRef.current = null;
    };

    // Store in ref to prevent Chrome/Edge GC pause bug
    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showNotification("Voice input is not supported in this browser iframe. Please type your message.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          showNotification("Microphone access was denied. Please allow microphone permissions or type your question.");
        } else {
          showNotification(`Voice input: ${event.error || 'Could not recognize audio. Please try again.'}`);
        }
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (e: any) {
      showNotification("Could not initialize voice recognition in this environment.");
      setIsListening(false);
    }
  };

  // High-speed real-time streaming send handler
  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: promptToSend,
      timestamp: new Date()
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

    // Prepare message history
    const history = messages.map(m => ({ role: m.role, text: m.text }));

    try {
      // Use real-time Server-Sent Events stream for near-instant TTFT (<400ms)
      const response = await streamMessageToYunDetailed(
        userMsg.text,
        history,
        {
          model: selectedModel,
          role: selectedRole,
          useSearchGrounding,
          deepThinking,
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

      // Finalize bot message
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
      // Fallback message
      setMessages(prev =>
        prev.map(m =>
          m.id === botMsgId
            ? {
                ...m,
                text: "Jambo! Asante kwa kuniuliza. Yun amepata changamoto ndogo ya kiufundi, lakini nipo tayari kukusaidia. Tafadhali jaribu kutuma tena swali lako!",
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setMessages([
      {
        id: 'new-start',
        role: 'model',
        text: 'Jambo! Conversation refreshed. What subject or NECTA exam topic would you like to explore now?',
        timestamp: new Date()
      }
    ]);
  };

  const downloadTranscript = () => {
    const content = messages
      .map(m => {
        const time = (m.timestamp instanceof Date ? m.timestamp : new Date(m.timestamp)).toLocaleTimeString();
        return `[${m.role.toUpperCase()}] (${time}):\n${m.text}\n\n`;
      })
      .join('--------------------------------------------------\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Yun_AI_Chat_Transcript_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  return (
    <div className="flex flex-col h-[88vh] md:h-[720px] w-full max-w-4xl mx-auto bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 text-slate-100">
      {/* Siri 3D Animated Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-indigo-500/20 shadow-md gap-3">
        <div className="flex items-center gap-3">
          <YunAvatar3D size="md" state={isLoading ? 'thinking' : isSpeaking ? 'speaking' : 'idle'} showLabel={false} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-black text-lg text-white tracking-wide">Yun AI 3D</h2>
              <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                {selectedModel === 'gemini-3.1-pro-preview' ? 'Pro Reasoning' : selectedModel === 'gemini-3.1-flash-lite' ? 'Fast Lite' : '3.8 Flash'}
              </span>
              {deepThinking && (
                <span className="bg-fuchsia-950/80 border border-fuchsia-500/50 text-fuchsia-300 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <i className="fa-solid fa-brain text-fuchsia-400"></i> Deep Thinking
                </span>
              )}
            </div>
            <p className="text-xs text-cyan-300/80 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Tanzania Education & NECTA AI Tutor • Real-Time Streaming
            </p>
          </div>
        </div>

        {/* Controls Header Tools */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Deep Thinking Toggle Button */}
          <button
            onClick={() => setDeepThinking(!deepThinking)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm ${
              deepThinking
                ? 'bg-gradient-to-r from-fuchsia-900/60 to-indigo-900/60 text-fuchsia-200 border-fuchsia-400/60 ring-1 ring-fuchsia-400/50 shadow-fuchsia-500/20'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border-slate-700'
            }`}
            title="Toggle Deep Cognitive Thinking (Extended Reasoning Level for proofs, derivations, and NECTA criteria)"
          >
            <i className={`fa-solid fa-brain ${deepThinking ? 'text-fuchsia-300 animate-pulse' : 'text-slate-400'}`}></i>
            <span>{deepThinking ? '🧠 Deep Thinking' : '⚡ Fast Mode'}</span>
          </button>

          {/* Role selector */}
          <select
            value={selectedRole}
            onChange={(e: any) => setSelectedRole(e.target.value)}
            className="bg-slate-950 border border-indigo-500/40 text-xs text-cyan-300 rounded-xl px-2.5 py-1.5 outline-none font-semibold focus:border-cyan-400 cursor-pointer"
            title="Change AI Tutor Persona / Role"
          >
            <option value="default">🌟 Role: Curiosity Catalyst (Warm)</option>
            <option value="necta_examiner">📝 Role: NECTA Examiner (Step Marks)</option>
            <option value="stem_mentor">🔬 Role: STEM Mentor (Proofs)</option>
            <option value="kiswahili_fasihi">🇹🇿 Role: Mwalimu wa Kiswahili</option>
          </select>

          {/* Model selector */}
          <select
            value={selectedModel}
            onChange={(e: any) => setSelectedModel(e.target.value)}
            className="bg-slate-950 border border-fuchsia-500/40 text-xs text-fuchsia-300 rounded-xl px-2.5 py-1.5 outline-none font-semibold focus:border-fuchsia-400 cursor-pointer"
            title="Select Gemini Intelligence Engine"
          >
            <option value="gemini-3.8-flash">⚡ Gemini 3.8 Flash (High Speed & Deep)</option>
            <option value="gemini-3.1-pro-preview">🧠 Gemini 3.1 Pro (Heavy Proofs)</option>
            <option value="gemini-3.1-flash-lite">🚀 Gemini 3.1 Flash-Lite (Sub-second)</option>
          </select>

          {/* Google Search Grounding Toggle Button */}
          <button
            onClick={() => setUseSearchGrounding(!useSearchGrounding)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm ${
              useSearchGrounding
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60 ring-1 ring-emerald-400'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Toggle Real-Time Google Search Grounding for live web answers"
          >
            <i className={`fa-solid fa-globe ${useSearchGrounding ? 'text-emerald-400 animate-spin-slow' : 'text-slate-400'}`}></i>
            <span className="hidden sm:inline">Search Grounded</span>
          </button>

          {/* Text Size Toggle */}
          <button
            onClick={() => setTextSize(prev => prev === 'normal' ? 'large' : 'normal')}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition border border-cyan-500/30"
            title="Toggle Text Size"
          >
            <i className="fa-solid fa-text-height"></i>
          </button>

          {/* Clear / New Conversation Button */}
          <button
            onClick={clearChat}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-amber-900/60 text-amber-300 hover:text-amber-200 text-xs font-bold transition border border-amber-500/30"
            title="Start New Topic / Clear Chat"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>

          {/* Download Transcript */}
          <button
            onClick={downloadTranscript}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition border border-cyan-500/30"
            title="Download Chat Transcript"
          >
            <i className="fa-solid fa-download"></i>
          </button>

          {onClose && (
            <button 
              onClick={onClose} 
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-rose-900/80 text-slate-300 hover:text-white transition border border-slate-700"
            >
              <i className="fa-solid fa-xmark text-base"></i>
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 text-xs text-amber-300 flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-circle-info text-amber-400"></i>
            {notification}
          </span>
          <button onClick={() => setNotification(null)} className="text-amber-300 hover:text-white">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Curiosity Starter Chips */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2.5 overflow-x-auto flex items-center gap-2 scrollbar-hide">
        <span className="text-[10px] font-black uppercase text-cyan-400 shrink-0 flex items-center gap-1 tracking-wider">
          <i className="fa-solid fa-bolt text-yellow-400"></i> Spark Curiosity:
        </span>
        {CURIOSITY_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            disabled={isLoading}
            className="text-xs font-medium bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-500/30 rounded-full px-3 py-1 whitespace-nowrap transition-all shadow-sm shrink-0 hover:scale-105 active:scale-95"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/90 space-y-6"
      >
        {messages.map((msg) => {
          const isModel = msg.role === 'model';
          const timeStr = (msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}
            >
              {isModel && (
                <YunAvatar3D size="sm" state={msg.isStreaming ? 'speaking' : isLoading ? 'thinking' : 'idle'} />
              )}

              <div className={`group relative max-w-[88%] sm:max-w-[80%] rounded-3xl p-4 sm:p-5 shadow-lg border ${
                isModel
                  ? 'bg-slate-900/95 border-indigo-500/30 text-slate-100 rounded-tl-sm'
                  : 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-cyan-400/30 rounded-tr-sm'
              }`}>
                {/* Text Formatting */}
                {isModel ? (
                  <div>
                    {msg.text ? (
                      <FormattedYunMessage text={msg.text} textSize={textSize} />
                    ) : (
                      <div className="flex items-center gap-2 text-cyan-300 text-xs py-1">
                        <span className="animate-spin text-sm">✦</span>
                        <span>Yun is thinking and formulating response...</span>
                      </div>
                    )}
                    {msg.isStreaming && (
                      <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse align-middle rounded-sm"></span>
                    )}
                  </div>
                ) : (
                  <div className={`whitespace-pre-wrap leading-relaxed ${textSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                    {msg.text}
                  </div>
                )}

                {/* Search Grounding Sources / Citations */}
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <i className="fa-solid fa-google text-emerald-400"></i> Verified Google Search Sources:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.groundingSources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-medium transition hover:scale-105"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                          <span className="truncate max-w-[200px]">{src.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{timeStr}</span>

                  {isModel && (
                    <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => speakText(msg.text)}
                        className={`p-1.5 rounded-lg hover:bg-slate-800 transition ${isSpeaking ? 'text-amber-400 animate-pulse' : 'text-slate-400 hover:text-cyan-300'}`}
                        title={isSpeaking ? 'Stop reading aloud' : 'Read aloud'}
                      >
                        <i className={`fa-solid ${isSpeaking ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
                      </button>

                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition"
                        title="Copy to clipboard"
                      >
                        <i className={`fa-solid ${copiedId === msg.id ? 'fa-check text-emerald-400' : 'fa-copy'}`}></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && !messages.some(m => m.isStreaming && m.text.length > 0) && (
          <div className="flex items-center gap-3">
            <YunAvatar3D size="sm" state="thinking" />
            <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl rounded-tl-sm px-5 py-4 shadow-lg flex items-center gap-3">
              <span className="text-xs font-bold text-cyan-300 animate-pulse">
                {deepThinking 
                  ? 'Yun is reasoning deeply through first principles & NECTA criteria...' 
                  : `Yun (${selectedModel}) is preparing answer...`}
              </span>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Console */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        {/* Pre-populated Prompt Banner (e.g. Ask Yun for a Deeper Dive) */}
        {input && initialPrompt && input.trim() === initialPrompt.trim() && (
          <div className="mb-2.5 p-3 bg-gradient-to-r from-fuchsia-950/90 via-indigo-950/90 to-slate-900 border border-fuchsia-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-lg">
            <div className="flex items-center gap-2.5 text-xs text-fuchsia-200">
              <span className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 shrink-0">
                <i className="fa-solid fa-brain text-sm"></i>
              </span>
              <div>
                <span className="font-black text-white block">Ask Yun for a Deeper Dive</span>
                <span className="text-[11px] text-fuchsia-300/90 font-medium">Historical context, real-world experiments & NECTA challenge questions pre-populated below.</span>
              </div>
            </div>
            <button
              onClick={() => handleSend()}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-1.5 bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-600 hover:to-indigo-600 text-white font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5 shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Ask Yun Now</span>
              <i className="fa-solid fa-paper-plane text-[10px]"></i>
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 bg-slate-950 p-2.5 rounded-2xl border border-indigo-500/30 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400 transition-all">
          <button
            onClick={startVoiceInput}
            className={`p-3 rounded-xl transition ${isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-cyan-400'}`}
            title="Ask by Voice"
          >
            <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={deepThinking ? "Ask a deep question (Math proofs, Physics laws, NECTA questions, Kiswahili)..." : "Ask Yun anything..."}
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-slate-100 placeholder-slate-500 max-h-40 py-2 px-2 text-sm sm:text-base outline-none"
            rows={input.length > 150 ? 4 : input.length > 70 ? 2 : 1}
            disabled={isLoading}
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>{deepThinking ? 'Reason' : 'Ask'}</span>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 mt-2 px-1 gap-2">
          <div className="flex items-center gap-2">
            <span>Yun AI Engine: <strong className="text-cyan-300">{selectedModel}</strong></span>
            {deepThinking && (
              <span className="text-fuchsia-300 font-semibold flex items-center gap-1">
                <i className="fa-solid fa-brain text-[10px]"></i> Deep Thinking Active
              </span>
            )}
            {useSearchGrounding && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <i className="fa-solid fa-check"></i> Search Grounding Active
              </span>
            )}
          </div>
          <span className="text-cyan-400/80 font-semibold">Tanzania Curriculum Aligned</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
