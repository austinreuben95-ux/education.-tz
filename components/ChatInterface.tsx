import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToYun } from '../services/geminiService';
import { INITIAL_GREETING } from '../constants';
import { YunAvatar3D } from './YunAvatar3D';

interface ChatInterfaceProps {
  initialContext?: string; // Optional context if user clicked "Ask Yun" on a specific topic
  onClose?: () => void;
}

const CURIOSITY_CHIPS = [
  "🌋 Why is Lake Natron pink & alkaline?",
  "💎 How does Tanzanite form under Mt. Kilimanjaro?",
  "🚀 Explain quadratic equations with rocket physics",
  "🧬 How does human DNA store gigabytes of code?",
  "🇹🇿 Kiswahili: Tanzu za Fasihi Simulizi ni zipi?",
  "📐 Give me a secret NECTA math calculation shortcut!"
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialContext, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: initialContext 
        ? `Jambo! I see you're exploring "${initialContext}". What fascinating question or deep concept would you like to uncover today?` 
        : INITIAL_GREETING,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in your browser. Try typing your question instead!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: promptToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    
    const responseText = await sendMessageToYun(userMsg.text, history);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
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

  const downloadTranscript = () => {
    const content = messages.map(m => `[${m.role.toUpperCase()}] (${m.timestamp.toLocaleTimeString()}):\n${m.text}\n\n`).join('---');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Yun_AI_Chat_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  return (
    <div className="flex flex-col h-[85vh] md:h-[680px] w-full max-w-3xl mx-auto bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 text-slate-100">
      {/* Siri 3D Animated Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-4 sm:p-5 flex items-center justify-between border-b border-indigo-500/20 shadow-md">
        <div className="flex items-center gap-3">
          <YunAvatar3D size="md" state={isLoading ? 'thinking' : isSpeaking ? 'speaking' : 'idle'} showLabel={false} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-lg text-white tracking-wide">Yun AI 3D</h2>
              <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                Gemini & ChatGPT Core
              </span>
            </div>
            <p className="text-xs text-cyan-300/80 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Curiosity Catalyst • Primary, O-Level & A-Level
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTextSize(prev => prev === 'normal' ? 'large' : 'normal')}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition border border-cyan-500/30"
            title="Toggle Text Size"
          >
            <i className="fa-solid fa-text-height"></i>
          </button>

          <button
            onClick={downloadTranscript}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition border border-cyan-500/30"
            title="Download Chat Transcript"
          >
            <i className="fa-solid fa-download"></i>
          </button>

          {onClose && (
            <button 
              onClick={onClose} 
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-900/80 text-slate-300 hover:text-white transition border border-slate-700"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          )}
        </div>
      </div>

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
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/90 space-y-6">
        {messages.map((msg) => {
          const isModel = msg.role === 'model';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}
            >
              {isModel && (
                <YunAvatar3D size="sm" state={isLoading ? 'thinking' : 'idle'} />
              )}

              <div className={`group relative max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 shadow-lg border ${
                isModel
                  ? 'bg-slate-900/95 border-indigo-500/30 text-slate-100 rounded-tl-sm'
                  : 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-cyan-400/30 rounded-tr-sm'
              }`}>
                {/* Text Formatting */}
                <div className={`whitespace-pre-wrap leading-relaxed ${textSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                  {msg.text}
                </div>

                {/* Footer Controls */}
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                  {isModel && (
                    <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => speakText(msg.text)}
                        className={`p-1.5 rounded-lg hover:bg-slate-800 transition ${isSpeaking ? 'text-amber-400 animate-pulse' : 'text-slate-400 hover:text-cyan-300'}`}
                        title="Read aloud with speech synthesis"
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

        {isLoading && (
          <div className="flex items-center gap-3">
            <YunAvatar3D size="sm" state="thinking" />
            <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl rounded-tl-sm px-5 py-4 shadow-lg flex items-center gap-3">
              <span className="text-xs font-bold text-cyan-300 animate-pulse">Yun is reasoning like Gemini & ChatGPT...</span>
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
            placeholder="Ask Yun anything about Math, Science, NECTA exams, or deep curiosity questions..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-slate-100 placeholder-slate-500 max-h-32 py-2 px-2 text-sm sm:text-base outline-none"
            rows={1}
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
            <span>Ask</span>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
          <span>Yun uses Gemini AI models for deep inquiry & step-by-step logic.</span>
          <span className="text-cyan-400/80 font-semibold">Tanzania Curriculum Aligned</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
