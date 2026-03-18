import { TabId } from './Navigation';

interface HeroProps {
  onTabChange: (tab: TabId) => void;
}

export function Hero({ onTabChange }: HeroProps) {
  return (
    <section className="bg-bg-primary border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
        <div className="max-w-3xl">
          <div className="inline-block mb-4 px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full">
            GTM AI Strategy Consultant · Bristol, UK
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4 leading-tight">
            I turn AI experimentation<br className="hidden md:block" />
            <span className="text-accent"> into measurable GTM impact</span>
          </h1>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl leading-relaxed">
            Scaled AI adoption across a 300-person sales org. Built 26 AI products from ideation to 80% adoption.
            Now helping Series A–C SaaS companies do the same.
          </p>

          {/* Key stats */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 mb-8">
            {[
              { value: '26', label: 'AI products built' },
              { value: '4,440', label: 'Hours saved annually' },
              { value: '80%', label: 'Peak tool adoption' },
              { value: '150%', label: 'Adoption lift in 60 days' },
            ].map(stat => (
              <div key={stat.label}>
                <span className="text-2xl font-bold text-text-primary">{stat.value}</span>
                <span className="text-text-secondary text-sm ml-2">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Navigation shortcuts */}
          <div className="flex flex-wrap gap-3">
            {([
              { id: 'projects', label: '26 projects & impact →' },
              { id: 'career', label: 'Career history →' },
              { id: 'profile', label: 'Personal profile →' },
            ] as { id: TabId; label: string }[]).map(btn => (
              <button
                key={btn.id}
                onClick={() => {
                  onTabChange(btn.id);
                  document.getElementById('tab-content')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 text-sm font-semibold text-accent border border-accent/30 rounded-lg hover:bg-accent hover:text-white hover:border-accent transition-colors duration-200"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
