import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Linkedin, Mail } from 'lucide-react';

interface FloatingActionsProps {
  onDownloadCV: () => void;
}

export function FloatingActions({ onDownloadCV }: FloatingActionsProps) {
  const [visible, setVisible] = useState(false);

  // Delay entrance so it doesn't distract on first load
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const actions = [
    {
      icon: <Download size={15} />,
      label: 'Download CV',
      onClick: onDownloadCV,
      href: undefined,
    },
    {
      icon: <Linkedin size={15} />,
      label: 'LinkedIn',
      onClick: undefined,
      href: 'https://www.linkedin.com/in/alex-farman/',
    },
    {
      icon: <Mail size={15} />,
      label: 'Email',
      onClick: undefined,
      href: 'mailto:alexfarman94@hotmail.co.uk',
    },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-28 right-5 z-40 flex flex-col gap-2"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {actions.map((action, i) =>
            action.href ? (
              <a
                key={i}
                href={action.href}
                target={action.href.startsWith('mailto') ? undefined : '_blank'}
                rel={action.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="group flex items-center gap-2 pl-3 pr-4 py-2.5 bg-white border border-border hover:border-accent/40 rounded-xl shadow-md hover:shadow-lg text-sm font-semibold text-text-primary hover:text-accent transition-all duration-200"
                title={action.label}
              >
                <span className="text-text-secondary group-hover:text-accent transition-colors duration-200">
                  {action.icon}
                </span>
                <span className="hidden md:inline">{action.label}</span>
              </a>
            ) : (
              <button
                key={i}
                onClick={action.onClick}
                className="group flex items-center gap-2 pl-3 pr-4 py-2.5 bg-white border border-border hover:border-accent/40 rounded-xl shadow-md hover:shadow-lg text-sm font-semibold text-text-primary hover:text-accent transition-all duration-200"
                title={action.label}
              >
                <span className="text-text-secondary group-hover:text-accent transition-colors duration-200">
                  {action.icon}
                </span>
                <span className="hidden md:inline">{action.label}</span>
              </button>
            )
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
