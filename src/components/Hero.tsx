import { TabId } from './Navigation';
import { NumberTicker } from './ui/number-ticker';
import { BlurFade } from './ui/blur-fade';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  onTabChange: (tab: TabId) => void;
}

export function Hero({ onTabChange: _onTabChange }: HeroProps) {
  return (
    <section className="relative bg-bg-primary border-b border-border overflow-hidden">

      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Fade out towards bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary" />

      <div className="relative max-w-7xl mx-auto px-6 py-14 md:py-20">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <BlurFade delay={0}>
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 bg-accent/8 border border-accent/20 text-accent text-sm font-semibold rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              GTM AI Strategy · Bristol, UK
            </div>
          </BlurFade>

          {/* Headline */}
          <BlurFade delay={0.08}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-5 leading-[1.1] tracking-tight">
              I turn AI experimentation
              <br className="hidden md:block" />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #1E40AF 0%, #3b82f6 50%, #1E40AF 100%)' }}
              >
                {' '}into measurable GTM impact
              </span>
            </h1>
          </BlurFade>

          {/* Subheading */}
          <BlurFade delay={0.15}>
            <p className="text-lg text-text-secondary mb-10 max-w-2xl leading-relaxed">
              Scaled AI adoption across a 300-person global sales org at HiBob. Built 26 products, 7 flagships at 75-80% adoption. Now looking for an AI lead role inside a commercial team.
            </p>
          </BlurFade>

          {/* Stats row */}
          <BlurFade delay={0.22}>
            <div className="flex flex-wrap gap-8 mb-10">
              {([
                { value: 26, prefix: '',  suffix: '',      label: 'AI products built' },
                { value: 15440, prefix: '', suffix: '',    label: 'Hours saved annually' },
                { value: 30, prefix: '~', suffix: ' FTEs', label: 'Capacity unlocked' },
                { value: 80, prefix: '',  suffix: '%',     label: 'Peak tool adoption' },
                { value: 150, prefix: '', suffix: '%',     label: 'Adoption lift in 60 days' },
              ] as { value: number; prefix: string; suffix: string; label: string }[]).map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-text-primary tabular-nums">
                    <NumberTicker value={stat.value} prefix={stat.prefix} suffix={stat.suffix} duration={1200} />
                  </div>
                  <div className="text-text-secondary text-sm mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </BlurFade>

          {/* Scroll indicator */}
          <BlurFade delay={0.30}>
            <button
              onClick={() => document.getElementById('tab-content')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors duration-200 group"
            >
              <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform duration-200" />
              Explore below
            </button>
          </BlurFade>

        </div>
      </div>
    </section>
  );
}
