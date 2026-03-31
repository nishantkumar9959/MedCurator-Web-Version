import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your MedCurator operational assistant. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // 1. Set loading state to true before starting the API call
    setIsLoading(true);

    // 2. Wrap the API call in a robust try...catch...finally block
    try {
      // Initialize the Gemini API
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const model = "gemini-3-flash-preview";
      
      const chat = ai.chats.create({
        model: model,
        config: {
          systemInstruction: "You are the internal administrative AI assistant for MedCurator hospital. You help doctors and staff with operational data. Keep answers brief and professional. Never provide medical diagnosis. Focus on hospital operations, scheduling, pharmacy stock, and billing queries.",
        },
      });

      // Send the message
      const response = await chat.sendMessage({ message: userMessage });
      const aiResponse = response.text;

      if (aiResponse) {
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      }
    } catch (error) {
      // 3. Log the exact error to the console for debugging
      console.error("Gemini API Error:", error);
      
      // 4. Push a graceful fallback error message to the chat history
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: "⚠️ Connection error. Please check the console to verify the API key and network status." }
      ]);
    } finally {
      // 5. ALWAYS execute setIsLoading(false) in the finally block to prevent UI freezes
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-primary-container transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-surface-container-lowest rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-outline-variant flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">MedCurator AI</h3>
                  <p className="text-[10px] opacity-80">Operational Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message History */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-outline-variant"
            >
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "flex flex-col max-w-[80%]",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-2xl text-sm shadow-sm",
                    msg.role === 'user' 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-surface-container-high text-on-surface rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                  <div className="mt-1 flex items-center gap-1 opacity-40 text-[10px] font-bold uppercase tracking-tighter">
                    {msg.role === 'user' ? <User className="w-2 h-2" /> : <Bot className="w-2 h-2" />}
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex flex-col items-start mr-auto max-w-[80%]">
                  <div className="bg-surface-container-high text-on-surface p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs font-medium italic">AI is typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-outline-variant bg-surface-container-low">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about operations..."
                  className="flex-grow bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-primary text-white p-2 rounded-xl hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
