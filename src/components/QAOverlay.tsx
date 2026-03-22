import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Loader2, Sparkles } from 'lucide-react';
import { agentSystemPrompt } from '../data/agentPrompt';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const PROMPT_CHIPS = [
  { label: 'Summarise Alex in 30 seconds for a Head of AI role', autoSend: true },
  { label: 'Show me the projects most relevant to AI strategy', autoSend: true },
  { label: 'Compare Alex to this job description', autoSend: false },
  { label: 'Generate 5 interview questions I should ask Alex', autoSend: true },
  { label: 'Build me a shortlist of reasons to hire him', autoSend: true },
];

interface QAOverlayProps {
  onOpenJobAnalyzer: () => void;
}

export function QAOverlay({ onOpenJobAnalyzer }: QAOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const answersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (answersRef.current) {
      answersRef.current.scrollTop = answersRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: trimmed }];
    const contextMessages = newMessages.slice(-6);

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          max_tokens: 300,
          system: agentSystemPrompt,
          messages: contextMessages,
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't process that. Try asking something else.";
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: "I'm having trouble connecting. Reach Alex at alexfarman94@hotmail.co.uk.",
        },
      ]);
    }

    setIsLoading(false);
  };

  const handleChipClick = (chip: typeof PROMPT_CHIPS[0]) => {
    if (!chip.autoSend) {
      setIsOpen(false);
      onOpenJobAnalyzer();
    } else {
      sendMessage(chip.label);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
  };

  return (
    <>
      {/* FAB button — icon only on mobile, pill on desktop */}
      <motion.button
        className="fixed bottom-6 right-5 z-40 flex items-center justify-center w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-200/60 transition-colors duration-200"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.3, ease: 'easeOut' }}
        onClick={() => setIsOpen(true)}
        aria-label="Ask about Alex"
      >
        <Sparkles size={16} />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-up panel */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 md:max-w-lg md:mx-auto md:bottom-6 md:rounded-2xl overflow-hidden"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onKeyDown={handleKeyDown}
            >
              <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl border border-stone-200/60 flex flex-col max-h-[65vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                      <Sparkles size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-text-primary">Ask about Alex</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                    aria-label="Close"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Messages / chips */}
                <div ref={answersRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[80px]">
                  {messages.length === 0 && !isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                      {PROMPT_CHIPS.map((chip, i) => (
                        <button
                          key={i}
                          onClick={() => handleChipClick(chip)}
                          className="border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 text-left transition-all duration-150 leading-snug"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-sm'
                            : 'bg-stone-100 text-text-primary rounded-bl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-stone-100 rounded-xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-2">
                        <Loader2 size={13} className="animate-spin text-stone-400" />
                        <span className="text-sm text-stone-400">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-stone-100">
                  <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="e.g. What's Alex's salary expectation?"
                      className="flex-1 pl-3.5 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-text-primary placeholder-stone-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-colors"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="flex items-center justify-center w-9 h-9 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 shrink-0"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                  <p className="text-[10px] text-stone-400 mt-1.5 text-center">
                    Powered by Claude · responses may not be perfectly accurate
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
