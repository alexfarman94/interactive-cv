import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Loader2 } from 'lucide-react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function triggerDownload() {
  const a = document.createElement('a');
  a.href = '/alex-farman-cv.pdf';
  a.download = 'Alex-Farman-CV.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError('');

    try {
      const formspreeId = import.meta.env.VITE_FORMSPREE_ID;
      if (formspreeId) {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name || 'Not provided',
            email,
            source: 'CV Download',
            _subject: `CV Download request from ${email}`,
          }),
        });
        if (!res.ok) {
          // Non-blocking — still allow download even if submission fails
          console.warn('Formspree submission failed, proceeding with download');
        }
      }
    } catch {
      // Non-blocking — don't gate the download on network errors
      console.warn('Lead capture request failed, proceeding with download');
    }

    triggerDownload();
    setIsSubmitting(false);
    setName('');
    setEmail('');
    onClose();
  };

  const handleSkip = () => {
    triggerDownload();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                <Download size={20} className="text-accent" />
              </div>

              {/* Heading */}
              <h2 className="text-xl font-bold text-text-primary mb-1">Download Alex's CV</h2>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                Drop your email and I'll know who's looking — happy to reach out if there's a fit.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Your email address *"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  required
                  className="w-full px-4 py-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                />
                {error && <p className="text-xs text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <><Loader2 size={15} className="animate-spin" /> Sending…</>
                  ) : (
                    <><Download size={15} /> Get CV</>
                  )}
                </button>
              </form>

              {/* Skip */}
              <div className="mt-4 text-center">
                <button
                  onClick={handleSkip}
                  className="text-xs text-text-secondary hover:text-text-primary underline underline-offset-2 transition-colors"
                >
                  Skip and download anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
