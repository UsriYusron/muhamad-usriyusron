'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, RotateCcw, Loader2, Bot, User } from 'lucide-react';

export default function AIChatButton() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Suggested questions for quick start
  const suggestions = [
    { text: 'Siapa itu Usri?', label: 'Profil' },
    { text: 'Apa saja tech stack Usri?', label: 'Tech Stack' },
    { text: 'Bagaimana cara menghubungi Usri?', label: 'Kontak' },
    { text: 'Apakah Usri menerima freelance?', label: 'Freelance' },
  ];

  const welcomeMessage = {
    role: 'assistant',
    content: 'Halo! Saya adalah **Usri AI Assistant**. 🤖\n\nSaya diprogram dengan data portfolio Muhamad Usri Yusron. Ada yang bisa saya bantu mengenai profil, keahlian, riwayat pengalaman, atau proyek Usri?',
    timestamp: new Date().toISOString()
  };

  // Ensure client-side mounting
  useEffect(() => {
    setMounted(true);
    
    // Load chat history from localStorage
    const savedMessages = localStorage.getItem('usri_ai_chat_history');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        setMessages([welcomeMessage]);
      }
    } else {
      setMessages([welcomeMessage]);
      // Show notification badge after 3 seconds for first-time visitors
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Save messages to localStorage on change
  useEffect(() => {
    if (mounted && messages.length > 0) {
      localStorage.setItem('usri_ai_chat_history', JSON.stringify(messages));
    }
  }, [messages, mounted]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Auto-focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  if (!mounted) return null;

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString()
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ **Error:** Gagal mendapatkan respon dari AI. ${error.message || 'Silakan coba lagi nanti.'}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Hapus seluruh riwayat percakapan?')) {
      const freshMessages = [welcomeMessage];
      setMessages(freshMessages);
      localStorage.setItem('usri_ai_chat_history', JSON.stringify(freshMessages));
    }
  };

  // Simple Markdown Parser to render bold and code tags nicely
  const renderMessageContent = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, index) => {
      let content = line;

      // Handle Bold: **text** -> <strong>text</strong>
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // Handle Inline Code: `code` -> <code>code</code>
      content = content.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-xs text-pink-600 dark:text-pink-400 font-bold">$1</code>');

      // Handle Bullet Points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletContent = content.trim().substring(2);
        return (
          <li 
            key={index} 
            className="list-disc list-inside ml-2 my-1 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: bulletContent }} 
          />
        );
      }

      return (
        <p 
          key={index} 
          className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-1.5 min-h-[1.2rem]" 
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      );
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Pulsing notification bubble */}
        <AnimatePresence>
          {showNotification && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-3 mr-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs py-1.5 px-3 rounded-xl shadow-lg font-medium tracking-wide flex items-center gap-1.5 border border-cyan-400/20 max-w-[200px]"
            >
              <span>Tanya Usri AI! </span>
              <Sparkles className="w-3.5 h-3.5 animate-bounce" />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotification(false);
                }} 
                className="hover:bg-white/20 p-0.5 rounded ml-1 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger Button */}
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowNotification(false);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center cursor-pointer shadow-2xl transition-colors duration-300 z-50 border border-white/10 ${
            isOpen 
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' 
              : 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white'
          }`}
          aria-label="Toggle AI Chat"
        >
          {/* Pulse Outer Aura when closed */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-cyan-500/30 dark:bg-purple-500/20 animate-ping pointer-events-none scale-110" />
          )}

          {isOpen ? (
            <X className="w-6 h-6 sm:w-7 sm:h-7" />
          ) : (
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
          )}
        </motion.button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-[360px] sm:w-[400px] h-[520px] sm:h-[600px] max-h-[calc(100vh-120px)] max-w-[calc(100vw-32px)] flex flex-col rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-zinc-950/95 border border-zinc-200/50 dark:border-zinc-800/50"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-zinc-50 to-zinc-100/50 dark:from-zinc-900/80 dark:to-zinc-950/20 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-inner">
                  <Bot className="w-5 h-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Usri AI Assistant</h3>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Ready to help you</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="p-1.5 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                  title="Reset Chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body & Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  {/* Avatar Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                    msg.role === 'user'
                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      : 'bg-gradient-to-tr from-cyan-500 to-blue-500 text-white'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-tr-none shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/30 dark:border-zinc-800/30 text-zinc-900 dark:text-zinc-100 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {renderMessageContent(msg.content)}
                  </div>
                </div>
              ))}

              {/* Loader/Typing Indicator */}
              {isLoading && (
                <div className="flex gap-3 max-w-[80%] mr-auto">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 text-white flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/30 dark:border-zinc-800/30 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">AI sedang mengetik...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions (Saran Pertanyaan) */}
            {messages.length <= 1 && !isLoading && (
              <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-900">
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block mb-1.5">
                  Pertanyaan Populer:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(sug.text)}
                      className="px-2.5 py-1 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-600 dark:text-zinc-300 transition-colors font-medium hover:border-cyan-500/30"
                    >
                      {sug.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-800/50 flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan sesuatu..."
                disabled={isLoading}
                className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 focus:border-cyan-500 dark:focus:border-cyan-500 rounded-xl px-3.5 py-2 text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all duration-150"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
