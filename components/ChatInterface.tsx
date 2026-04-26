import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToYun } from '../services/geminiService';
import { INITIAL_GREETING } from '../constants';

interface ChatInterfaceProps {
  initialContext?: string; // Optional context if user clicked "Ask Yun" on a specific topic
  onClose?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialContext, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: initialContext ? `I see you're looking at "${initialContext}". What would you like to know about it?` : INITIAL_GREETING,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[80vh] md:h-[600px] w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-tz-blue p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-tz-blue font-bold text-xl border-2 border-tz-yellow">
            Y
          </div>
          <div>
            <h2 className="font-bold text-lg">Yun AI Tutor</h2>
            <p className="text-xs text-blue-100 opacity-90">Always here to help!</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white hover:text-gray-200 transition">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-tz-blue text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{msg.text}</p>
              <span className={`text-[10px] block mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-tz-blue rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-tz-blue rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-tz-blue rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-end gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:border-tz-blue focus-within:ring-1 focus-within:ring-tz-blue transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask Yun anything about your homework..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-gray-700 max-h-32 py-2 px-2"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-lg mb-1 transition-all ${
              input.trim() && !isLoading
                ? 'bg-tz-blue text-white hover:bg-teal-600 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          Yun can make mistakes. Always check with your teacher!
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
