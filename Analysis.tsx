import React, { useState, useEffect, useRef } from 'react';
import { AuditRecord, AnalysisMessage, IWindow } from '../types';
import { generateAuditAnalysis } from '../services/geminiService';
import { Mic, Send, StopCircle, User, Bot, Volume2 } from 'lucide-react';

interface AnalysisProps {
  data: AuditRecord[];
}

const Analysis: React.FC<AnalysisProps> = ({ data }) => {
  const [messages, setMessages] = useState<AnalysisMessage[]>([
    {
      role: 'ai',
      content: "Hello Auditor. I am Professor Audit. I have analyzed the receivables ledger you uploaded. Ask me about risks, aging, or specific customers.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup Speech Recognition
  useEffect(() => {
    const iWindow = window as unknown as IWindow;
    const SpeechRecognition = iWindow.SpeechRecognition || iWindow.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript); // Auto send on voice end
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        setIsListening(true);
        recognitionRef.current.start();
      } else {
        alert("Speech recognition not supported in this browser.");
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Google')) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.pitch = 1;
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim()) return;

    // Add User Message
    const userMsg: AnalysisMessage = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Call Gemini
    const responseText = await generateAuditAnalysis(data, text);

    // Add AI Message
    const aiMsg: AnalysisMessage = { role: 'ai', content: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setIsThinking(false);

    // Speak response
    speakText(responseText);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6">
      <div className="flex-none mb-4">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Bot className="mr-3 text-primary-400" /> 
          AI Voice Analyst
        </h2>
        <p className="text-slate-400">Powered by Gemini 2.5 Flash & Speech Synthesis</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 flex items-start space-x-3 ${
              msg.role === 'user' 
                ? 'bg-primary-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 rounded-bl-none'
            }`}>
              <div className="mt-1 flex-shrink-0">
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                {msg.role === 'ai' && idx === messages.length - 1 && (
                  <button 
                    onClick={() => speakText(msg.content)} 
                    className="mt-2 text-xs flex items-center text-primary-300 hover:text-white"
                  >
                    <Volume2 size={12} className="mr-1" /> Replay Voice
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-none flex items-center space-x-4 bg-slate-900 p-2 rounded-full border border-slate-800">
        <button
          onClick={toggleListening}
          className={`p-3 rounded-full transition-all duration-200 ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {isListening ? <StopCircle /> : <Mic />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Speak or type a question about your audit data..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500"
          disabled={isThinking || isListening}
        />

        <button 
          onClick={() => handleSend()}
          disabled={!input.trim() || isThinking}
          className="p-3 bg-primary-600 rounded-full text-white hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Analysis;