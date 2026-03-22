import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Linkedin, Mail } from 'lucide-react';

interface FloatingActionsProps {
  onDownloadCV: () => void;
}

export function FloatingActions({ onDownloadCV }: FloatingActionsProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const actions = [
    {
      icon: <Download size={16} />,
      label: 'Download CV',
      onClick: onDownloadCV,
      href: undefined,
    },
    {
      icon: <Linkedin size={16} />,
      label: 'LinkedIn',
      onClick: undefined,
      href: 'https://www.linkedin.com/in/alex-farman-53575a106/',
    },
    {
      icon: <Mail size={16} />,
      label: 'Email',
      onClick: undefined,
      href: 'mailto:alexfarman94@hotmail.co.uk',
    },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-20 md:bottom-6 right-5 z-40 flex flex-col gap-2.5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {actions.map((action, i) =>
            action.href ? (
              <a
                key={i}
                href={action.href}
                target={action.href.startsWith('mailto') ? undefined : '_blank'}
                rel={action.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                title={action.label}
                className="w-10 h-10 rounded-full bg-white border border-stone-200 shadow-md flex items-center justify-center text-stone-500 hover:text-indigo-600 hover:shadow-lg hover:border-indigo-200 transition-all duration-200"
              >
                {action.icon}
              </a>
            ) : (
              <button
                key={i}
                onClick={action.onClick}
                title={action.label}
                className="w-10 h-10 rounded-full bg-white border border-stone-200 shadow-md flex items-center justify-center text-stone-500 hover:text-indigo-600 hover:shadow-lg hover:border-indigo-200 transition-all duration-200"
              >
                {action.icon}
              </button>
            )
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
