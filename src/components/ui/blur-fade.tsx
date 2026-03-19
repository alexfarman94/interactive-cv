import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface BlurFadeProps {
  children: React.ReactNode;
  /** Stagger delay in seconds */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  /** Y offset to animate from */
  yOffset?: number;
  className?: string;
  /** Use once: true to only animate in once */
  inViewOnce?: boolean;
}

/**
 * Fades + blurs + slides children in when they enter the viewport.
 * Use `delay` to stagger multiple instances.
 */
export function BlurFade({
  children,
  delay = 0,
  duration = 0.4,
  yOffset = 16,
  className,
  inViewOnce = true,
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: inViewOnce, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
