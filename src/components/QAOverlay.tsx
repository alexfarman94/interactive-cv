import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle, Loader2 } from 'lucide-react';
import { agentSystemPrompt } from '../data/agentPrompt';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function QAOverlay() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const answersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (answersRef.current) {
      answersRef.current.scrollTop = answersRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: trimmed }];
    // Keep last 6 messages for context (3 exchanges)
    const contextMessages = newMessages.slice(-6);

    setMessages(newMessages);
    setInput('');
    setIsExpanded(true);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          max_tokens: 500,
          system: agentSystemPrompt,
          messages: contextMessages,
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || "Sorry, I couldn't process that. Try asking something else.";
      setMessages([...newMessages, { role: 'assistant', content: text }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: "I'm having trouble connecting. You can reach Alex directly at alexfarman94@hotmail.co.uk.",
        },
      ]);
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  const collapse = () => {
    setIsExpanded(false);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40" onKeyDown={handleKeyDown}>
      {/* Answer area */}
      <AnimatePresence>
        {isExpanded && hasMessages && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
              <div className="max-w-3xl mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <MessageCircle size={12} />
                    <span>Ask me anything about Alex</span>
                  </div>
                  <button
                    onClick={collapse}
                    className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                    aria-label="Collapse"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div ref={answersRef} className="max-h-[240px] overflow-y-auto py-3 space-y-3 scrollbar-hide">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-accent text-white rounded-br-sm'
                            : 'bg-bg-secondary text-text-primary rounded-bl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-bg-secondary rounded-xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin text-text-secondary" />
                        <span className="text-sm text-text-secondary">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <div className="bg-white border-t border-border shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onFocus={() => hasMessages && setIsExpanded(true)}
                placeholder="Ask me anything about Alex's experience..."
                className="w-full pl-4 pr-4 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex items-center justify-center w-10 h-10 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200"
            >
              <Send size={15} />
            </button>
          </form>
          <p className="text-[10px] text-text-secondary mt-1.5 text-center">
            Powered by Claude &middot; AI responses may not be perfectly accurate
          </p>
        </div>
      </div>
    </div>
  );
}
