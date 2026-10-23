import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import {
  streamMessageToYunDetailed,
  sendMessageToYunDetailed,
  solveStepByStepWithAI,
  gradeAnswerWithAI,
  generateFlashcardsWithAI,
  fetchNectaExamStrategy,
  StepByStepSolution,
  ExamAnswerGrade,
  FlashcardDeckResult,
  NectaExamStrategyResult
} from '../services/geminiService';
import { playMicStartSound, playMicStopSound } from '../src/utils/soundEffects';

interface ChatInterfaceProps {
  initialContext?: string;
  initialPrompt?: string;
  onClose?: () => void;
  activeSubject?: string;
  activeGrade?: string;
  defaultTab?: 'chat' | 'strategy' | 'solver' | 'examiner' | 'flashcards';
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
  activeSubject,
  activeGrade,
  defaultTab = 'chat',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'initial-gemini-welcome',
        role: 'model',
        text: initialContext
          ? `Jambo! I'm Yun AI, your NECTA & secondary syllabus assistant powered by Gemini. I see you're studying:\n\n> ${initialContext}\n\nHow can I help you master this concept today?`
          : "Jambo! I'm Yun AI, your Tanzanian curriculum study companion powered by Gemini. You can ask me to explain any topic from Form 1 to Form 6, solve NECTA exam questions step-by-step, generate practice quizzes, analyze past paper trends, or translate academic terms in Kiswahili. What would you like to explore today?",
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

  // Active AI Feature Tab
  const [activeTab, setActiveTab] = useState<'chat' | 'strategy' | 'solver' | 'examiner' | 'flashcards'>(defaultTab);

  // NECTA Exam Strategy State
  const [stratSubject, setStratSubject] = useState<string>(activeSubject || 'Physics');
  const [stratGrade, setStratGrade] = useState<string>(activeGrade || 'Form 4');
  const [stratTargetGrade, setStratTargetGrade] = useState<'A' | 'B' | 'C'>('A');
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [strategyResult, setStrategyResult] = useState<NectaExamStrategyResult | null>(null);
  const [copiedStrategyToast, setCopiedStrategyToast] = useState(false);

  // Sync when activeSubject or activeGrade changes
  useEffect(() => {
    if (activeSubject) setStratSubject(activeSubject);
    if (activeGrade) setStratGrade(activeGrade);
  }, [activeSubject, activeGrade]);

  // AI Step-by-Step Solver State
  const [solverProblem, setSolverProblem] = useState('');
  const [solverSubject, setSolverSubject] = useState(activeSubject || 'Physics');
  const [solverGrade, setSolverGrade] = useState(activeGrade || 'Form 4');
  const [isSolving, setIsSolving] = useState(false);
  const [solverResult, setSolverResult] = useState<StepByStepSolution | null>(null);

  // AI Examiner Answer Grading State
  const [gradeQuestion, setGradeQuestion] = useState('');
  const [gradeAnswer, setGradeAnswer] = useState('');
  const [gradeSubject, setGradeSubject] = useState(activeSubject || 'Biology');
  const [gradeLevel, setGradeLevel] = useState(activeGrade || 'Form 4');
  const [gradeMaxMarks, setGradeMaxMarks] = useState(10);
  const [isGrading, setIsGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<ExamAnswerGrade | null>(null);

  // AI Flashcards Generator State
  const [fcTopic, setFcTopic] = useState('');
  const [fcSubject, setFcSubject] = useState(activeSubject || 'Chemistry');
  const [fcGrade, setFcGrade] = useState(activeGrade || 'Form 4');
  const [isGeneratingFc, setIsGeneratingFc] = useState(false);
  const [fcDeck, setFcDeck] = useState<FlashcardDeckResult | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

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

  const handleRunStrategy = async (customSubject?: string, customGrade?: string) => {
    const subj = customSubject || stratSubject;
    const grd = customGrade || stratGrade;
    setIsGeneratingStrategy(true);
    try {
      const lowerGrd = (grd || '').toLowerCase();
      let examCode = 'CSEE';
      let targetExamDate = '2026-11-09T08:00:00';
      let daysRemaining = 18;

      if (lowerGrd.includes('2') || lowerGrd.includes('ftna')) {
        examCode = 'FTNA';
        targetExamDate = '2026-11-02T08:00:00';
        daysRemaining = 11;
      } else if (lowerGrd.includes('6') || lowerGrd.includes('acsee')) {
        examCode = 'ACSEE';
        targetExamDate = '2027-05-03T08:00:00';
        daysRemaining = 193;
      } else if (lowerGrd.includes('7') || lowerGrd.includes('standard 7') || lowerGrd.includes('psle')) {
        examCode = 'PSLE';
        targetExamDate = '2027-09-08T08:00:00';
        daysRemaining = 321;
      }

      const res = await fetchNectaExamStrategy({
        subject: subj,
        grade: grd,
        examCode,
        targetExamDate,
        daysRemaining,
        studentTargetGrade: stratTargetGrade,
      });
      setStrategyResult(res);
    } catch (err) {
      console.error('Error generating NECTA strategy:', err);
    } finally {
      setIsGeneratingStrategy(false);
    }
  };

  const handleRunSolver = async (customProblem?: string) => {
    const textToSolve = customProblem || solverProblem;
    if (!textToSolve.trim()) return;
    setIsSolving(true);
    try {
      const res = await solveStepByStepWithAI(textToSolve, solverSubject, solverGrade);
      setSolverResult(res);
    } catch (err) {
      console.error('Error running step solver:', err);
    } finally {
      setIsSolving(false);
    }
  };

  const handleRunGrading = async () => {
    if (!gradeQuestion.trim() || !gradeAnswer.trim()) return;
    setIsGrading(true);
    try {
      const res = await gradeAnswerWithAI(gradeQuestion, gradeAnswer, gradeSubject, gradeLevel, gradeMaxMarks);
      setGradeResult(res);
    } catch (err) {
      console.error('Error grading answer:', err);
    } finally {
      setIsGrading(false);
    }
  };

  const handleGenerateFlashcards = async (customTopic?: string) => {
    const topicToGen = customTopic || fcTopic;
    if (!topicToGen.trim()) return;
    setIsGeneratingFc(true);
    try {
      const res = await generateFlashcardsWithAI(topicToGen, fcSubject, fcGrade);
      setFcDeck(res);
      setFlippedCards({});
    } catch (err) {
      console.error('Error generating flashcards:', err);
    } finally {
      setIsGeneratingFc(false);
    }
  };

  const toggleCardFlip = (id: string) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
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

      {/* AI Modes & Capabilities Navigation Bar */}
      <div className="bg-stone-50 border-b border-stone-200 px-4 sm:px-8 py-2.5 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <i className="fa-regular fa-comment-dots text-amber-400"></i>
          <span>Yun Chat</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('strategy');
            if (!strategyResult) {
              handleRunStrategy(stratSubject, stratGrade);
            }
          }}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'strategy'
              ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <i className="fa-solid fa-chess-knight text-amber-300"></i>
          <span>NECTA Exam Strategy</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-amber-400 text-slate-950">TRENDS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('solver')}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'solver'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <i className="fa-solid fa-square-root-variable text-indigo-300"></i>
          <span>Step-by-Step Solver</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-indigo-500/40 text-indigo-100">AI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('examiner')}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'examiner'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <i className="fa-solid fa-file-pen text-emerald-300"></i>
          <span>NECTA Examiner Grading</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-emerald-500/40 text-emerald-100">AI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('flashcards')}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'flashcards'
              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <i className="fa-solid fa-layer-group text-amber-700"></i>
          <span>AI Flashcard Deck</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-amber-400 text-slate-950">AI</span>
        </button>
      </div>

      {activeTab === 'chat' && (
        <>
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
        </>
      )}

      {/* ========================================================= */}
      {/* AI FEATURE 0: NECTA EXAM STRATEGY & PAST PAPER TRENDS ANALYZER */}
      {/* ========================================================= */}
      {activeTab === 'strategy' && (
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 bg-[#faf9f5]/50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
            {/* Header & Mode Intro */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-100 text-purple-800">
                    NECTA Exam Strategy & Past Paper Trends ♟️
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    Official NECTA 2018–2025 Trend Synthesis
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                  {stratSubject} ({stratGrade}) Examination Strategy
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
                  Analyze recurring questions, section weights, and examiner CIRA pitfalls for <strong className="text-stone-900">{stratSubject}</strong>, then follow a customized study roadmap tailored to your upcoming exam date.
                </p>
              </div>

              {/* Quick Re-Analyze Button */}
              <div className="shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  disabled={isGeneratingStrategy}
                  onClick={() => handleRunStrategy(stratSubject, stratGrade)}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-xs transition shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isGeneratingStrategy ? (
                    <>
                      <GeminiSparkle className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Analyzing Trends...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-arrows-rotate text-amber-300"></i>
                      <span>Refresh Strategy Plan</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Subject, Grade & Target Controls */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-sliders text-indigo-600"></i>
                  Tailor Strategy by Active Subject & Cohort:
                </span>
                {activeSubject && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Active Syllabus: {activeSubject} ({activeGrade || 'Form 4'})
                  </span>
                )}
              </div>

              {/* Quick Subject Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Physics',
                  'Basic Mathematics',
                  'Chemistry',
                  'Biology',
                  'Geography',
                  'History',
                  'Civics',
                  'Kiswahili',
                  'English'
                ].map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => {
                      setStratSubject(subj);
                      handleRunStrategy(subj, stratGrade);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                      stratSubject.toLowerCase() === subj.toLowerCase()
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
                    }`}
                  >
                    <span>{subj}</span>
                  </button>
                ))}
              </div>

              {/* Cohort & Target Grade Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    NECTA Level / Exam:
                  </label>
                  <select
                    value={stratGrade}
                    onChange={(e) => {
                      setStratGrade(e.target.value);
                      handleRunStrategy(stratSubject, e.target.value);
                    }}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    <option value="Form 4">Form 4 (CSEE National Exam)</option>
                    <option value="Form 2">Form 2 (FTNA National Assessment)</option>
                    <option value="Form 6">Form 6 (ACSEE National Exam)</option>
                    <option value="Standard 7">Standard 7 (PSLE Primary Final)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Student Target Result:
                  </label>
                  <select
                    value={stratTargetGrade}
                    onChange={(e) => {
                      const val = e.target.value as 'A' | 'B' | 'C';
                      setStratTargetGrade(val);
                      handleRunStrategy(stratSubject, stratGrade);
                    }}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    <option value="A">Grade A (Distinction 75% – 100%)</option>
                    <option value="B">Grade B (Merit 65% – 74%)</option>
                    <option value="C">Grade C (Credit 45% – 64%)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    disabled={isGeneratingStrategy}
                    onClick={() => handleRunStrategy(stratSubject, stratGrade)}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles text-amber-300"></i>
                    <span>Generate Tailored Plan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Loading Indicator */}
            {isGeneratingStrategy && (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <GeminiSparkle className="w-8 h-8 mx-auto animate-spin text-purple-600" />
                <h4 className="font-extrabold text-stone-900 text-sm">
                  Yun AI is synthesizing NECTA past paper trends for {stratSubject}...
                </h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Cross-referencing question distributions, mark weightings, and examiner CIRA reports to build your high-yield study calendar.
                </p>
              </div>
            )}

            {/* Strategy Content Display */}
            {!isGeneratingStrategy && strategyResult && (
              <div className="space-y-6 animate-fadeIn">
                {/* Hero Target Banner with Live Countdown */}
                <div className="bg-gradient-to-r from-stone-950 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-purple-500/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
                          {strategyResult.examCode} Examination Roadmap
                        </span>
                        <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-500/40 text-purple-200 border border-purple-400/30">
                          Target: Grade {stratTargetGrade}
                        </span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-black text-white">
                        {strategyResult.subject} ({strategyResult.grade})
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
                        {strategyResult.executiveSummary}
                      </p>
                    </div>

                    {/* Countdown Metric Badge */}
                    <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[160px]">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-purple-300">
                        Exam Date
                      </div>
                      <div className="text-xs font-extrabold text-white mt-0.5">
                        {strategyResult.examDateFormatted}
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <span className="text-3xl font-mono font-black text-amber-300">
                          {strategyResult.daysRemaining}
                        </span>
                        <span className="text-[11px] font-bold text-stone-300 ml-1">Days Left</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1. NECTA Paper Structure & Time Allocation */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <i className="fa-solid fa-stopwatch text-indigo-600"></i>
                      1. Examination Paper Blueprint & Timing ({strategyResult.paperFormat.paperCode} • {strategyResult.paperFormat.duration})
                    </h4>
                    <span className="text-xs text-stone-500 font-bold">Total: {strategyResult.paperFormat.totalMarks} Marks</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {strategyResult.paperFormat.sections.map((sec, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-stone-900">{sec.section}</span>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-indigo-50 text-indigo-700">
                            {sec.totalMarks} Mks
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
                          <i className="fa-regular fa-clock"></i>
                          <span>Target: {sec.recommendedTimeMinutes} Minutes</span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed font-medium">
                          {sec.scoringTactic}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. High-Yield Question Topics Ranked by Weight */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <i className="fa-solid fa-chart-pie text-purple-600"></i>
                      2. Past Paper Weight Analysis (Top 75%+ Guaranteed Areas)
                    </h4>
                    <span className="text-xs text-stone-500 font-medium">Historical trends 2018–2025</span>
                  </div>

                  <div className="space-y-3">
                    {strategyResult.highYieldTopics.map((topicItem, tIdx) => (
                      <div key={tIdx} className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200 space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <div>
                            <span className="font-black text-sm text-stone-900">
                              {tIdx + 1}. {topicItem.topic}
                            </span>
                            <span className="text-xs text-stone-500 ml-2">({topicItem.questionType})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {topicItem.frequencyScore}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800">
                              ~{topicItem.averageMarks} Marks
                            </span>
                          </div>
                        </div>

                        {/* Weight bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold text-stone-500">
                            <span>Paper Contribution Weight:</span>
                            <span className="text-indigo-600 font-extrabold">{topicItem.weightPercentage}%</span>
                          </div>
                          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, topicItem.weightPercentage * 3.5)}%` }}
                            />
                          </div>
                        </div>

                        {/* Must-Know Concepts Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-bold uppercase text-stone-400">Must-Master:</span>
                          {topicItem.mustKnowConcepts.map((concept, cIdx) => (
                            <span
                              key={cIdx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white text-stone-700 border border-stone-200"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Official Examiner Pitfalls & CIRA Trap Warnings */}
                <div className="space-y-3">
                  <h4 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-triangle-exclamation text-rose-600"></i>
                    3. Critical Examiner Pitfalls (Reported in NECTA CIRA Reviews)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {strategyResult.examinerPitfalls.map((pit, pIdx) => (
                      <div key={pIdx} className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 space-y-2 text-xs">
                        <div className="font-extrabold text-rose-950 flex items-center gap-1.5">
                          <i className="fa-solid fa-circle-xmark text-rose-600"></i>
                          <span>{pit.topicOrArea}</span>
                        </div>
                        <p className="text-rose-900 leading-relaxed font-medium">
                          <strong>Common Error:</strong> {pit.commonMistake}
                        </p>
                        <div className="p-2.5 rounded-xl bg-white border border-rose-200/80 text-emerald-900 font-semibold leading-relaxed">
                          <i className="fa-solid fa-check text-emerald-600 mr-1"></i>
                          <strong>How to Secure Full Marks:</strong> {pit.howToAvoid}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Personalized Phased Study Plan */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <i className="fa-solid fa-calendar-check text-emerald-600"></i>
                      4. Personalized Study Schedule for {strategyResult.daysRemaining} Days
                    </h4>

                    {/* Copy Strategy Plan Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const planSummary = `NECTA EXAM STRATEGY - ${strategyResult.subject} (${strategyResult.grade})\nTarget Exam Date: ${strategyResult.examDateFormatted} (${strategyResult.daysRemaining} Days Left)\n\nEXECUTIVE ROADMAP:\n${strategyResult.executiveSummary}\n\nHIGH-YIELD TOPICS:\n${strategyResult.highYieldTopics.map(t => `- ${t.topic} (~${t.averageMarks} Marks, Weight: ${t.weightPercentage}%)`).join('\n')}\n\nSTUDY PHASES:\n${strategyResult.personalizedStudyPlan.phases.map(p => `[${p.phaseName}]\n${p.dailyFocus.map(d => `* ${d.dayRange} (${d.focusTopic}): ${d.taskDescription} (${d.recommendedHours} hrs/day)`).join('\n')}`).join('\n\n')}\n\nDAILY ROUTINE:\n- ${strategyResult.personalizedStudyPlan.dailyRoutineRecommended.morningSprint}\n- ${strategyResult.personalizedStudyPlan.dailyRoutineRecommended.afternoonDrill}\n- ${strategyResult.personalizedStudyPlan.dailyRoutineRecommended.eveningReview}`;
                        navigator.clipboard?.writeText(planSummary);
                        setCopiedStrategyToast(true);
                        setTimeout(() => setCopiedStrategyToast(false), 2500);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                    >
                      <i className={`fa-solid ${copiedStrategyToast ? 'fa-check text-emerald-600' : 'fa-copy'}`}></i>
                      <span>{copiedStrategyToast ? 'Plan Copied!' : 'Copy Study Plan 📋'}</span>
                    </button>
                  </div>

                  {/* Phased Roadmap Timeline */}
                  <div className="space-y-3">
                    {strategyResult.personalizedStudyPlan.phases.map((phase, phIdx) => (
                      <div key={phIdx} className="bg-white p-5 rounded-3xl border-2 border-indigo-100 shadow-sm space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-150">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                              {phase.timeframe}
                            </span>
                            <h5 className="font-black text-base text-stone-900 mt-0.5">{phase.phaseName}</h5>
                          </div>
                          <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full self-start sm:self-auto">
                            Goal: {phase.objective}
                          </span>
                        </div>

                        {/* Daily Focus Items */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {phase.dailyFocus.map((focus, fIdx) => (
                            <div key={fIdx} className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                                  {focus.dayRange}
                                </span>
                                <span className="font-bold text-stone-500 flex items-center gap-1">
                                  <i className="fa-regular fa-clock text-amber-500"></i>
                                  {focus.recommendedHours} hrs/day
                                </span>
                              </div>
                              <div className="font-bold text-stone-900 text-xs sm:text-sm">
                                {focus.focusTopic}
                              </div>
                              <p className="text-stone-600 leading-relaxed font-medium">
                                {focus.taskDescription}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Daily Routine Bar */}
                  <div className="bg-gradient-to-r from-amber-50 via-indigo-50 to-purple-50 p-4 rounded-2xl border border-amber-200/80 space-y-2">
                    <div className="text-xs font-black uppercase text-amber-900 flex items-center gap-1.5">
                      <i className="fa-solid fa-sun text-amber-500"></i>
                      Target Daily Revision Rhythm:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                      <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60">
                        <div className="font-bold text-amber-900">🌅 Morning Active Sprint:</div>
                        <p className="text-stone-600 mt-0.5">{strategyResult.personalizedStudyPlan.dailyRoutineRecommended.morningSprint}</p>
                      </div>
                      <div className="bg-white/80 p-3 rounded-xl border border-indigo-200/60">
                        <div className="font-bold text-indigo-900">☀️ Afternoon Timed Drill:</div>
                        <p className="text-stone-600 mt-0.5">{strategyResult.personalizedStudyPlan.dailyRoutineRecommended.afternoonDrill}</p>
                      </div>
                      <div className="bg-white/80 p-3 rounded-xl border border-purple-200/60">
                        <div className="font-bold text-purple-900">🌙 Evening Mistake Review:</div>
                        <p className="text-stone-600 mt-0.5">{strategyResult.personalizedStudyPlan.dailyRoutineRecommended.eveningReview}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Bilingual Kiswahili Pro-Tip Banner */}
                <div className="bg-amber-400/15 border-2 border-amber-400/40 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 text-lg shadow-sm">
                    <i className="fa-solid fa-flag"></i>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-black uppercase text-amber-900 dark:text-amber-300">
                      Ushauri wa Kimkakati wa NECTA (Kiswahili):
                    </div>
                    <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                      {strategyResult.kiswahiliProTip}
                    </p>
                  </div>
                </div>

                {/* Quick Action Navigation in Strategy Mode */}
                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      const topTopic = strategyResult.highYieldTopics[0]?.topic || strategyResult.subject;
                      setActiveTab('chat');
                      handleSend(`Please provide 3 realistic NECTA Form 4 exam questions on ${topTopic} with marking scheme breakdown and step marks!`);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
                  >
                    <i className="fa-solid fa-comments text-amber-300"></i>
                    <span>Quiz Me on Top Topic in Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('solver');
                      setSolverSubject(strategyResult.subject);
                      setSolverGrade(strategyResult.grade);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer"
                  >
                    <i className="fa-solid fa-square-root-variable text-amber-300"></i>
                    <span>Open Step Solver</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('flashcards');
                      setFcTopic(strategyResult.highYieldTopics[0]?.topic || strategyResult.subject);
                      setFcSubject(strategyResult.subject);
                      setFcGrade(strategyResult.grade);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-500/30 cursor-pointer"
                  >
                    <i className="fa-solid fa-layer-group text-slate-950"></i>
                    <span>Generate Topic Flashcards</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'solver' && (
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 bg-[#faf9f5]/50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700">
                  NECTA Step-by-Step Solver 📐
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  Physics, Chemistry, Basic Math & Geography Calculations
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                AI Scientific Formula & Numerical Solver
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Enter any word problem, formula derivation, or equation. Yun AI extracts Givens, states the official formula, calculates intermediate steps, and displays the exact NECTA mark breakdown!
              </p>
            </div>

            {/* Quick Sample Problem Pills */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                <i className="fa-solid fa-bolt text-amber-500"></i> Try a common NECTA exam problem:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    label: 'Physics: Kinetic Energy',
                    subject: 'Physics',
                    grade: 'Form 4',
                    text: 'A car of mass 1200 kg is moving at a uniform velocity of 20 m/s. Calculate its kinetic energy and express your answer in standard SI units.'
                  },
                  {
                    label: 'Math: Quadratic Formula',
                    subject: 'Basic Mathematics',
                    grade: 'Form 4',
                    text: 'Solve the equation 2x² - 8x + 6 = 0 using the quadratic formula, showing all steps.'
                  },
                  {
                    label: 'Physics: Parallel Resistors',
                    subject: 'Physics',
                    grade: 'Form 2',
                    text: 'Two resistors of resistance 3 ohms and 6 ohms are connected in parallel to a 12V battery. Calculate the equivalent resistance and the total circuit current.'
                  },
                  {
                    label: 'Chemistry: Moles Calculation',
                    subject: 'Chemistry',
                    grade: 'Form 4',
                    text: 'Calculate the number of moles in 20 grams of calcium carbonate (CaCO₃). [Relative atomic masses: Ca = 40, C = 12, O = 16].'
                  }
                ].map((sample, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => {
                      setSolverProblem(sample.text);
                      setSolverSubject(sample.subject);
                      setSolverGrade(sample.grade);
                      handleRunSolver(sample.text);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-indigo-50 hover:text-indigo-700 text-stone-700 text-xs font-semibold border border-stone-200 transition text-left cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Solver Form */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Subject / Somo:
                  </label>
                  <select
                    value={solverSubject}
                    onChange={(e) => setSolverSubject(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Physics">Physics (Fizikia)</option>
                    <option value="Basic Mathematics">Basic Mathematics (Hisabati)</option>
                    <option value="Chemistry">Chemistry (Kemia)</option>
                    <option value="Biology">Biology (Biolojia)</option>
                    <option value="Geography">Geography (Jiografia)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Level / Kidato:
                  </label>
                  <select
                    value={solverGrade}
                    onChange={(e) => setSolverGrade(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Form 1">Form 1 (Kidato cha 1)</option>
                    <option value="Form 2">Form 2 (FTNA)</option>
                    <option value="Form 3">Form 3 (Kidato cha 3)</option>
                    <option value="Form 4">Form 4 (CSEE)</option>
                    <option value="Form 5">Form 5 (Kidato cha 5)</option>
                    <option value="Form 6">Form 6 (ACSEE)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Problem Description / Question:
                </label>
                <textarea
                  rows={3}
                  value={solverProblem}
                  onChange={(e) => setSolverProblem(e.target.value)}
                  placeholder="Paste or type your math, physics, or chemistry question here..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl p-3.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="button"
                disabled={!solverProblem.trim() || isSolving}
                onClick={() => handleRunSolver()}
                className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer ${
                  solverProblem.trim() && !isSolving
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 active:scale-98'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                {isSolving ? (
                  <>
                    <GeminiSparkle className="w-5 h-5 animate-spin text-amber-300" />
                    <span>Yun AI is deriving step-by-step solution...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-calculator text-amber-300"></i>
                    <span>Solve Step-by-Step with NECTA Standards</span>
                  </>
                )}
              </button>
            </div>

            {/* Solver Result Display */}
            {solverResult && (
              <div className="pt-6 border-t border-stone-200 space-y-5 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-lg font-black text-stone-900">{solverResult.topic}</h4>
                    <p className="text-xs text-indigo-600 font-semibold">{solverResult.concept}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Target: {solverResult.targetVariable}
                  </span>
                </div>

                {/* Given Data Parameters */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                  <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <i className="fa-solid fa-list-check text-indigo-600"></i>
                    1. Given Data (Taarifa Zilizotolewa & SI Units):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {solverResult.givens.map((g, gIdx) => (
                      <div key={gIdx} className="bg-white p-2.5 rounded-xl border border-stone-200 text-xs">
                        <span className="font-bold text-stone-900">{g.parameter}</span>
                        <div className="text-indigo-600 font-mono font-bold mt-0.5">
                          {g.symbol} = {g.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Governing Formula */}
                <div className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-200">
                  <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <i className="fa-solid fa-square-root-variable text-indigo-600"></i>
                    2. Governing Law / Formula:
                  </div>
                  <div className="text-base sm:text-lg font-mono font-extrabold text-indigo-900 bg-white p-3 rounded-xl border border-indigo-200">
                    {solverResult.formula}
                  </div>
                </div>

                {/* Steps Working */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <i className="fa-solid fa-stairs text-indigo-600"></i>
                    3. Detailed Step-by-Step Calculation:
                  </div>
                  <div className="space-y-2">
                    {solverResult.steps.map((st) => (
                      <div key={st.stepNumber} className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {st.stepNumber}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-stone-900">{st.description}</p>
                          <div className="text-xs sm:text-sm font-mono text-emerald-700 font-bold bg-stone-50 p-2 rounded-lg mt-1 border border-stone-200">
                            {st.math}
                          </div>
                          {st.subResult && (
                            <span className="text-[11px] text-stone-500 italic mt-0.5 block">
                              Intermediate: {st.subResult}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlighted Final Answer */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-md">
                  <div className="text-xs font-black uppercase tracking-wider opacity-90 mb-1 flex items-center gap-1.5">
                    <i className="fa-solid fa-check-circle"></i> Final Evaluated Answer (Jibu la Mwisho):
                  </div>
                  <div className="text-lg sm:text-xl font-mono font-black text-white">
                    {solverResult.finalAnswer}
                  </div>
                </div>

                {/* NECTA Step Marks Breakdown */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
                  <div className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <i className="fa-solid fa-award text-amber-500"></i>
                    NECTA Examiner Step Mark Allocation:
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-stone-200 text-stone-500">
                          <th className="py-1.5 px-2">Component</th>
                          <th className="py-1.5 px-2">Marks</th>
                          <th className="py-1.5 px-2">NECTA Criterion</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 text-stone-800">
                        {solverResult.nectaMarkBreakdown.map((mb, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-2 font-bold">{mb.component}</td>
                            <td className="py-2 px-2 text-indigo-600 font-extrabold">{mb.marks}</td>
                            <td className="py-2 px-2">{mb.criterion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Traps & Kiswahili note */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-rose-900">
                    <div className="font-bold flex items-center gap-1 mb-1">
                      <i className="fa-solid fa-triangle-exclamation text-rose-600"></i> Common Examination Traps:
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      {solverResult.commonPitfalls.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-amber-900">
                    <div className="font-bold flex items-center gap-1 mb-1">
                      <i className="fa-solid fa-comment-dots text-amber-600"></i> Kidokezo cha NECTA (Kiswahili):
                    </div>
                    <p className="leading-relaxed">{solverResult.bilingualKiswahiliNote}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* AI FEATURE 2: NECTA EXAMINER ANSWER EVALUATOR & GRADING */}
      {/* ========================================================= */}
      {activeTab === 'examiner' && (
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 bg-[#faf9f5]/50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700">
                  NECTA Examiner Grading 📝
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  National Exam Marking Scheme & Step Analysis
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                AI Answer Marker & Rubric Evaluation
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Write or paste your exam answer. The Senior Examiner AI grades it from A to F, shows marks awarded vs deducted, identifies missing keywords, and gives the distinction model answer!
              </p>
            </div>

            {/* Quick Sample Questions */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                <i className="fa-solid fa-bolt text-amber-500"></i> Try a sample question & answer:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    title: 'Biology: Mitosis vs Meiosis',
                    subject: 'Biology',
                    grade: 'Form 4',
                    maxMarks: 10,
                    question: 'State four differences between mitosis and meiosis cell division.',
                    answer: 'Mitosis occurs in somatic cells producing 2 daughter cells with identical chromosome number. Meiosis occurs in reproductive cells producing 4 daughter cells with half the chromosomes. Mitosis has one division, meiosis has two divisions.'
                  },
                  {
                    title: 'History: Maji Maji Resistance',
                    subject: 'History',
                    grade: 'Form 4',
                    maxMarks: 10,
                    question: 'Explain three causes of the Maji Maji war of 1905–1907 in Tanganyika.',
                    answer: 'The causes included forced cotton cultivation on dry communal plots, heavy taxation by German colonialists, and brutality of Akidas and Jumbes.'
                  },
                  {
                    title: 'Physics: Archimedes Principle',
                    subject: 'Physics',
                    grade: 'Form 2',
                    maxMarks: 10,
                    question: 'State Archimedes’ Principle and explain why an iron needle sinks while a large steel ship floats.',
                    answer: 'Archimedes principle states that when a body is partially or fully immersed in a fluid, it experiences an upthrust equal to the weight of fluid displaced. A needle sinks because it has small volume and upthrust is less than its weight. A ship is hollow and displaces large water weight.'
                  }
                ].map((sample, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => {
                      setGradeQuestion(sample.question);
                      setGradeAnswer(sample.answer);
                      setGradeSubject(sample.subject);
                      setGradeLevel(sample.grade);
                      setGradeMaxMarks(sample.maxMarks);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-700 text-xs font-semibold border border-stone-200 transition text-left cursor-pointer"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Subject:
                  </label>
                  <select
                    value={gradeSubject}
                    onChange={(e) => setGradeSubject(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Biology">Biology (Biolojia)</option>
                    <option value="Physics">Physics (Fizikia)</option>
                    <option value="Chemistry">Chemistry (Kemia)</option>
                    <option value="History">History (Historia)</option>
                    <option value="Geography">Geography (Jiografia)</option>
                    <option value="Civics">Civics (Uraia)</option>
                    <option value="Kiswahili">Kiswahili</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Grade Level:
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Form 2">Form 2 (FTNA)</option>
                    <option value="Form 4">Form 4 (CSEE)</option>
                    <option value="Form 6">Form 6 (ACSEE)</option>
                    <option value="Standard 7">Standard 7 (PSLE)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Max Marks:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={gradeMaxMarks}
                    onChange={(e) => setGradeMaxMarks(Number(e.target.value) || 10)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Examination Question:
                </label>
                <input
                  type="text"
                  value={gradeQuestion}
                  onChange={(e) => setGradeQuestion(e.target.value)}
                  placeholder="Enter the exact exam question..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Your Answer (Andika jibu lako hapa):
                </label>
                <textarea
                  rows={4}
                  value={gradeAnswer}
                  onChange={(e) => setGradeAnswer(e.target.value)}
                  placeholder="Write your answer, essay points, or calculation working here..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl p-3.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="button"
                disabled={!gradeQuestion.trim() || !gradeAnswer.trim() || isGrading}
                onClick={handleRunGrading}
                className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer ${
                  gradeQuestion.trim() && gradeAnswer.trim() && !isGrading
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 active:scale-98'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                {isGrading ? (
                  <>
                    <GeminiSparkle className="w-5 h-5 animate-spin text-amber-300" />
                    <span>Senior Examiner is grading your answer against NECTA rubric...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-stamp text-amber-300"></i>
                    <span>Grade Answer with NECTA Examiner AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Grading Results */}
            {gradeResult && (
              <div className="pt-6 border-t border-stone-200 space-y-5 animate-fadeIn">
                {/* Score & Grade Header Card */}
                <div className="bg-gradient-to-r from-stone-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                      Official NECTA Result Assessment
                    </span>
                    <h4 className="text-2xl font-black mt-1">
                      Score: {gradeResult.score} / {gradeResult.maxMarks} ({gradeResult.percentage}%)
                    </h4>
                    <p className="text-xs text-stone-300 mt-1 max-w-xl">
                      {gradeResult.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-center px-4 py-2 rounded-2xl bg-white/10 border border-white/20">
                      <div className="text-[10px] uppercase font-bold text-stone-400">NECTA Grade</div>
                      <div className={`text-3xl font-black ${
                        gradeResult.nectaGrade === 'A' ? 'text-emerald-400' :
                        gradeResult.nectaGrade === 'B' ? 'text-cyan-400' :
                        gradeResult.nectaGrade === 'C' ? 'text-amber-400' :
                        'text-rose-400'
                      }`}>
                        Grade {gradeResult.nectaGrade}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rubric Breakdown */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
                  <div className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <i className="fa-solid fa-table-list text-emerald-600"></i>
                    Marking Scheme Rubric Breakdown:
                  </div>
                  <div className="space-y-2">
                    {gradeResult.rubricBreakdown.map((r, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex-1">
                          <span className="font-bold text-stone-900">{r.criterion}</span>
                          <p className="text-stone-500 text-[11px] mt-0.5">{r.comment}</p>
                        </div>
                        <div className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg shrink-0">
                          {r.awardedMarks} / {r.allocatedMarks} Marks
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Missing Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-950">
                    <div className="font-bold flex items-center gap-1.5 mb-2 text-emerald-800">
                      <i className="fa-solid fa-check-circle"></i> Strengths of Your Answer:
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      {gradeResult.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-950">
                    <div className="font-bold flex items-center gap-1.5 mb-2 text-rose-800">
                      <i className="fa-solid fa-circle-exclamation"></i> Missing Keywords or Points:
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      {gradeResult.missingKeywordsOrPoints.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Distinction Model Answer */}
                <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 space-y-2">
                  <div className="text-xs font-black uppercase text-indigo-900 flex items-center gap-1.5">
                    <i className="fa-solid fa-star text-amber-500"></i>
                    100% Distinction Model Answer (Kigezo Kamili cha NECTA):
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-indigo-200 text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed font-sans">
                    {gradeResult.modelAnswer}
                  </div>
                </div>

                {/* Examiner Hall Pro Tip */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-amber-900 text-xs flex items-start gap-2.5">
                  <i className="fa-solid fa-lightbulb text-amber-600 text-base mt-0.5"></i>
                  <div>
                    <span className="font-black uppercase tracking-wider block mb-0.5">Kidokezo cha Mtihani:</span>
                    <span>{gradeResult.examinerProTip}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* AI FEATURE 3: AI FLASHCARD DECK GENERATOR */}
      {/* ========================================================= */}
      {activeTab === 'flashcards' && (
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 bg-[#faf9f5]/50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
                  AI Flashcard Engine 🗂️
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  High-Yield Spaced Repetition for National Exams
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                Generate Custom NECTA Revision Flashcards
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Pick or type any topic across the Tanzanian curriculum. Yun AI instantly synthesizes high-yield question & answer cards with difficulty ratings, exam frequencies, and Swahili translations!
              </p>
            </div>

            {/* Quick Topic Chips */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                <i className="fa-solid fa-sparkles text-amber-500"></i> Tap a popular topic to generate:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { topic: "Newton's Laws of Motion", subject: 'Physics', grade: 'Form 2' },
                  { topic: 'Photosynthesis & Light Reaction', subject: 'Biology', grade: 'Form 4' },
                  { topic: 'Periodic Table & Reactivity', subject: 'Chemistry', grade: 'Form 3' },
                  { topic: 'Pythagoras & Trigonometry', subject: 'Basic Mathematics', grade: 'Form 4' },
                  { topic: 'Maji Maji War & Colonialism', subject: 'History', grade: 'Form 4' },
                  { topic: 'Tamathali za Semi na Mnyambuliko', subject: 'Kiswahili', grade: 'Form 4' }
                ].map((sample, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => {
                      setFcTopic(sample.topic);
                      setFcSubject(sample.subject);
                      setFcGrade(sample.grade);
                      handleGenerateFlashcards(sample.topic);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-amber-50 hover:text-amber-800 text-stone-700 text-xs font-semibold border border-stone-200 transition text-left cursor-pointer"
                  >
                    {sample.topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input Form */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Syllabus Topic Name:
                  </label>
                  <input
                    type="text"
                    value={fcTopic}
                    onChange={(e) => setFcTopic(e.target.value)}
                    placeholder="e.g. Plate Tectonics, Osmosis, Organic Hydrocarbons..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Subject / Somo:
                  </label>
                  <select
                    value={fcSubject}
                    onChange={(e) => setFcSubject(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2.5 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Basic Mathematics">Basic Math</option>
                    <option value="Geography">Geography</option>
                    <option value="History">History</option>
                    <option value="Kiswahili">Kiswahili</option>
                    <option value="Civics">Civics</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                disabled={!fcTopic.trim() || isGeneratingFc}
                onClick={() => handleGenerateFlashcards()}
                className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer ${
                  fcTopic.trim() && !isGeneratingFc
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 active:scale-98'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                {isGeneratingFc ? (
                  <>
                    <GeminiSparkle className="w-5 h-5 animate-spin text-slate-950" />
                    <span>Yun AI is generating syllabus revision flashcards...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cards-blank text-slate-950"></i>
                    <span>Generate Flashcard Deck 🗂️</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Deck Grid */}
            {fcDeck && (
              <div className="pt-6 border-t border-stone-200 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-black text-stone-900">{fcDeck.deckTitle}</h4>
                    <p className="text-xs text-stone-500">
                      {fcDeck.flashcards.length} revision cards • Tap card to flip and reveal answer
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const allFlipped = Object.values(flippedCards).every(Boolean);
                      const nextState: Record<string, boolean> = {};
                      fcDeck.flashcards.forEach(c => { nextState[c.id] = !allFlipped; });
                      setFlippedCards(nextState);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <i className="fa-solid fa-repeat"></i>
                    <span>Flip All</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fcDeck.flashcards.map((card) => {
                    const isFlipped = !!flippedCards[card.id];
                    return (
                      <div
                        key={card.id}
                        onClick={() => toggleCardFlip(card.id)}
                        className={`min-h-[180px] p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between select-none ${
                          isFlipped
                            ? 'bg-slate-900 text-white border-amber-400 shadow-lg scale-[1.01]'
                            : 'bg-white text-stone-900 border-stone-200 hover:border-indigo-400 hover:shadow-md'
                        }`}
                      >
                        {/* Card Top Meta */}
                        <div className="flex items-center justify-between text-[11px] mb-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold ${
                            isFlipped ? 'bg-amber-400 text-slate-950' : 'bg-stone-100 text-stone-600'
                          }`}>
                            {isFlipped ? 'Answer (Jibu)' : 'Question (Swali)'}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              card.difficulty === 'Hard' ? 'bg-rose-100 text-rose-800' :
                              card.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {card.difficulty}
                            </span>
                            <span className="text-[10px] opacity-75 font-semibold">
                              NECTA: {card.nectaFrequency}
                            </span>
                          </div>
                        </div>

                        {/* Card Center Content */}
                        <div className="flex-1 flex items-center my-2">
                          <p className={`text-sm sm:text-base leading-relaxed ${
                            isFlipped ? 'text-amber-200 font-medium' : 'text-stone-900 font-bold'
                          }`}>
                            {isFlipped ? card.back : card.front}
                          </p>
                        </div>

                        {/* Card Bottom: Swahili Translation & Tap prompt */}
                        <div className="flex items-center justify-between text-[11px] pt-3 border-t border-stone-150/40">
                          <span className="text-amber-600 dark:text-amber-300 font-semibold italic">
                            🇹🇿 {card.keyTermSwahili}
                          </span>
                          <span className="text-[10px] opacity-60 flex items-center gap-1">
                            <i className="fa-solid fa-arrows-rotate text-[9px]"></i>
                            <span>Tap to flip</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
