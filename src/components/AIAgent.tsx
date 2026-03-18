import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { Message } from '../lib/types';
import { agentSystemPrompt } from '../data/agentPrompt';
import { ChatMessage, LoadingIndicator } from './ChatMessage';

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Tell me about the role you're hiring for — what are your biggest challenges right now?",
};

export function AIAgent() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isChatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const openChat = () => {
    setIsChatOpen(true);
    setMessages([INITIAL_MESSAGE]);
    setInput('');
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const sendMessage = async (userMessage: string) => {
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: agentSystemPrompt,
          messages: newMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.content?.find((item: { type: string; text?: string }) => item.type === 'text')?.text || '';

      setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            "I'm having trouble connecting right now. You can reach Alex directly at alexfarman94@hotmail.co.uk or connect with him on LinkedIn.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeChat();
  };

  return (
    <>
      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-bg-secondary border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full">
            AI-powered evaluation
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Want to see how I'd add value to your specific role?
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Tell me about your challenges and I'll surface which of Alex's 26 projects are most
            relevant to your specific situation.
          </p>
          <button
            onClick={openChat}
            className="px-8 py-4 bg-accent text-white rounded-lg font-semibold text-lg hover:bg-accent-hover transition-colors duration-200 shadow-lg shadow-accent/20"
          >
            Start conversation
          </button>
        </div>
      </section>

      {/* Chat Modal */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeChat(); }}
          onKeyDown={handleKeyDown}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="font-bold text-lg text-text-primary">Alex's AI Assistant</h3>
                <p className="text-xs text-text-secondary mt-0.5">Evaluating fit for your specific role</p>
              </div>
              <button
                onClick={closeChat}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg} />
              ))}
              {isLoading && <LoadingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border flex-shrink-0">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe the role and your challenges..."
                  className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2.5 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Send size={16} />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
              <p className="text-xs text-text-secondary mt-2 text-center">
                Powered by Claude · Contact:{' '}
                <a href="mailto:alexfarman94@hotmail.co.uk" className="text-accent hover:underline">
                  alexfarman94@hotmail.co.uk
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
