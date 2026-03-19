import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface NumberTickerProps {
  /** The numeric value to count to */
  value: number;
  /** Animation duration in ms */
  duration?: number;
  /** Text before the number */
  prefix?: string;
  /** Text after the number */
  suffix?: string;
  /** Decimal places */
  decimals?: number;
  className?: string;
}

/**
 * Counts up from 0 to `value` when it enters the viewport.
 * Falls back gracefully for non-numeric display strings.
 */
export function NumberTicker({
  value,
  duration = 1400,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(eased * value);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, value, duration]);

  const display = decimals > 0
    ? current.toFixed(decimals)
    : Math.round(current).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}
