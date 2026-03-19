import { useState } from 'react';
import { Mail, Linkedin, Download, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { BlurFade } from './ui/blur-fade';

interface LookingForProps {
  onDownloadCV: () => void;
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

function AIPitchGenerator({ onDownloadCV }: { onDownloadCV: () => void }) {
  const [roleInput, setRoleInput] = useState('');
  const [pitch, setPitch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generatePitch = async () => {
    if (!roleInput.trim()) return;
    setIsLoading(true);
    setPitch('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          max_tokens: 300,
          system: `You are writing on behalf of Alex Farman, a GTM AI specialist. Alex's background:
- Built 26 AI products for HiBob's 300-person global sales org, 7 flagship tools reaching 75-80% adoption
- 15,440+ hours saved annually across the tools he's built
- ~30 FTE capacity unlocked from Deal Prep alone
- 4 years as a Sales Engineer before moving into AI strategy (so deeply understands the commercial teams he builds for)
- He designs tools that fit existing workflows, measures everything against real business metrics
- He's a builder not just a strategist — he takes projects from problem identification through to shipping and tracking adoption
- Looking for: AI Strategy Lead, AI Product Lead, Head of AI (GTM focused), Commercial AI Lead roles
- Salary: £90k-£130k, full-time employed, remote-first UK or Bristol/London hybrid

Write a concise, confident 2-3 sentence pitch explaining why Alex would be a strong fit for the role described by the user. Be specific, reference his actual experience, keep it conversational and direct. Do not start with "I" — write in third person ("Alex..."). No fluff, no generic statements.`,
          messages: [
            {
              role: 'user',
              content: `Generate a pitch for this role/context: ${roleInput}`,
            },
          ],
        }),
      });

      const data = await response.json();
      setPitch(data.content?.[0]?.text || 'Could not generate pitch. Please try again.');
    } catch {
      setPitch('Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="relative bg-gradient-to-br from-accent to-blue-700 rounded-2xl p-8 md:p-10 overflow-hidden">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-blue-200" />
          <h3 className="text-xl md:text-2xl font-bold text-white">Is Alex a fit for your role?</h3>
        </div>
        <p className="text-blue-100 text-sm mb-6 leading-relaxed">
          Tell me about the role you're hiring for and I'll generate a tailored pitch.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={roleInput}
            onChange={e => setRoleInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isLoading && generatePitch()}
            placeholder="e.g. Head of AI at a 200-person B2B SaaS company..."
            className="flex-1 px-4 py-2.5 bg-white/15 border border-white/25 rounded-lg text-sm text-white placeholder-blue-200 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-colors"
          />
          <button
            onClick={generatePitch}
            disabled={isLoading || !roleInput.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-accent rounded-lg text-sm font-semibold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm whitespace-nowrap"
          >
            {isLoading ? (
              <><Loader2 size={14} className="animate-spin" /> Generating...</>
            ) : (
              <><Sparkles size={14} /> Generate pitch</>
            )}
          </button>
        </div>

        {pitch && (
          <div className="bg-white/15 border border-white/20 rounded-xl p-4 mb-6">
            <p className="text-white text-sm leading-relaxed">{pitch}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2 border-t border-white/15">
          <a
            href="mailto:alexfarman94@hotmail.co.uk"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-accent rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-sm"
          >
            <Mail size={14} />
            Email me
          </a>
          <a
            href="https://www.linkedin.com/in/alex-farman-53575a106/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg text-sm font-semibold transition-colors duration-200 border border-white/20"
          >
            <Linkedin size={14} />
            LinkedIn
          </a>
          <button
            onClick={onDownloadCV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg text-sm font-semibold transition-colors duration-200 border border-white/20"
          >
            <Download size={14} />
            Download CV
          </button>
        </div>
      </div>
    </div>
  );
}

export function LookingFor({ onDownloadCV }: LookingForProps) {
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
                  <div className="h-full bg-white border border-border rounded-xl p-5 hover:border-accent/30 hover:shadow-sm transition-all duration-200">
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
            <div className="bg-gradient-to-br from-bg-secondary to-white border border-border rounded-xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {companyProfile.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-accent flex-shrink-0 mt-0.5" />
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
                  <div className="h-full p-5 bg-white border border-border rounded-xl hover:border-accent/30 hover:shadow-sm transition-all duration-200">
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

        {/* AI Pitch Generator */}
        <BlurFade delay={0.45}>
          <AIPitchGenerator onDownloadCV={onDownloadCV} />
        </BlurFade>

      </div>
    </div>
  );
}
