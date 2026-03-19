import { CheckCircle2 } from 'lucide-react';
import { BlurFade } from './ui/blur-fade';
import { ProjectRecommender } from './ProjectRecommender';

interface LookingForProps {
  onDownloadCV?: () => void;
  onViewProjects: () => void;
}

const rolePrefs = [
  {
    icon: '🎯',
    label: 'Target roles',
    value: 'AI Strategy Lead · AI Product Lead · Head of AI (GTM focused) · Commercial AI Lead',
  },
  {
    icon: '💼',
    label: 'Employment type',
    value: 'Full-time employed, not consulting or contract',
  },
  {
    icon: '📍',
    label: 'Location',
    value: 'Remote-first UK, Bristol hybrid, or London with reasonable travel',
  },
  {
    icon: '💷',
    label: 'Salary',
    value: '£90k–£130k base + equity / bonus, open to discussion for the right role',
  },
];

const companyProfile = [
  '50–1,500 people',
  '40+ person sales or GTM team',
  'AI as a genuine strategic priority, not just an experiment',
  'Exec mandate and cross-functional access to build properly',
];

const principles = [
  {
    icon: '🔨',
    title: 'Autonomy to build and ship',
    body: "I want to own product delivery end-to-end, not just consult on what could be built.",
  },
  {
    icon: '📐',
    title: "Proximity to the people I'm building for",
    body: 'The best tools come from sitting in calls, seeing the friction, and iterating fast with the team.',
  },
  {
    icon: '📊',
    title: 'Measurable scope',
    body: 'I want to own outcomes, adoption rates, hours saved, conversion lift, not just ship features.',
  },
  {
    icon: '⚡',
    title: 'A team that moves fast',
    body: 'Values evidence over opinion, ships things, and iterates. I have no interest in slow bureaucracy.',
  },
];

export function LookingFor({ onViewProjects }: LookingForProps) {
  return (
    <div className="py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <BlurFade delay={0}>
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Open to new opportunities</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available now
              </span>
            </div>
            <p className="text-text-secondary text-lg">Here's exactly what I'm looking for.</p>
          </div>
        </BlurFade>

        {/* Role Preferences */}
        <BlurFade delay={0.06}>
          <div className="mb-10">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-5">The role I'm looking for</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rolePrefs.map((pref, i) => (
                <BlurFade key={i} delay={0.08 + i * 0.05}>
                  <div className="h-full bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0 mt-0.5">{pref.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">{pref.label}</div>
                        <div className="text-text-primary font-medium leading-snug">{pref.value}</div>
                      </div>
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* Ideal Company */}
        <BlurFade delay={0.22}>
          <div className="mb-10">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-5">Ideal company profile</h3>
            <div className="bg-stone-50 rounded-2xl p-6 md:p-8 shadow-sm border border-stone-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {companyProfile.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span className="text-text-primary text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </BlurFade>

        {/* Working Principles */}
        <BlurFade delay={0.28}>
          <div className="mb-12">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-5">What matters to me</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {principles.map((p, i) => (
                <BlurFade key={i} delay={0.30 + i * 0.05}>
                  <div className="h-full p-5 bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0 mt-0.5">{p.icon}</span>
                      <div>
                        <div className="font-semibold text-text-primary mb-1.5">{p.title}</div>
                        <div className="text-sm text-text-secondary leading-relaxed">{p.body}</div>
                      </div>
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* AI Project Recommender */}
        <BlurFade delay={0.45}>
          <ProjectRecommender onViewProject={onViewProjects} />
        </BlurFade>

      </div>
    </div>
  );
}
