import { TabId } from './Navigation';
import { NumberTicker } from './ui/number-ticker';
import { BlurFade } from './ui/blur-fade';

interface HeroProps {
  onTabChange: (tab: TabId) => void;
}

export function Hero({ onTabChange: _onTabChange }: HeroProps) {
  return (
    <section className="relative bg-hero-dark overflow-hidden">

      {/* Subtle radial gradient glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 20% 60%, rgba(99,102,241,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 30%, rgba(99,102,241,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <BlurFade delay={0}>
            <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 bg-white/[0.07] border border-white/[0.12] text-stone-400 text-sm font-medium rounded-full backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              GTM AI Strategy · Bristol, UK
            </div>
          </BlurFade>

          {/* Headline */}
          <BlurFade delay={0.08}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-[1.1] tracking-tight">
              <span className="text-white">I turn AI experimentation</span>
              <br className="hidden md:block" />
              <span className="text-indigo-400"> into measurable GTM impact</span>
            </h1>
          </BlurFade>

          {/* Subheading */}
          <BlurFade delay={0.15}>
            <p className="text-lg text-stone-400 mb-12 max-w-2xl leading-relaxed">
              Scaled AI adoption across a 300-person global sales org at HiBob. Built 26 products, 7 flagships at 75-80% adoption. Now looking for an AI lead role inside a commercial team.
            </p>
          </BlurFade>

          {/* Stats row — floating cards */}
          <BlurFade delay={0.22}>
            <div className="flex flex-wrap gap-3 mb-12">
              {([
                { value: 26, prefix: '',  suffix: '',      label: 'AI products built' },
                { value: 15440, prefix: '', suffix: '',    label: 'Hours saved annually' },
                { value: 30, prefix: '~', suffix: ' FTEs', label: 'Capacity unlocked' },
                { value: 80, prefix: '',  suffix: '%',     label: 'Peak tool adoption' },
                { value: 150, prefix: '', suffix: '%',     label: 'Adoption lift in 60 days' },
              ] as { value: number; prefix: string; suffix: string; label: string }[]).map(stat => (
                <div
                  key={stat.label}
                  className="px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl backdrop-blur-sm"
                >
                  <div className="text-xl font-bold text-white tabular-nums">
                    <NumberTicker value={stat.value} prefix={stat.prefix} suffix={stat.suffix} duration={1200} />
                  </div>
                  <div className="text-stone-500 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </BlurFade>

        </div>
      </div>
    </section>
  );
}
