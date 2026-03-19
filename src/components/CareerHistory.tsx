import { Award, ChevronRight } from 'lucide-react';
import { BlurFade } from './ui/blur-fade';

interface Role {
  company: string;
  title: string;
  period: string;
  location?: string;
  summary?: string;
  highlights: string[];
  awards?: string[];
  metrics?: { value: string; label: string }[];
  isCurrent?: boolean;
}

const roles: Role[] = [
  {
    company: 'HiBob',
    title: 'GTM AI Strategy Consultant',
    period: 'July 2025 – Present',
    isCurrent: true,
    summary: 'When HiBob went "all-in" on AI across the business in 2024, rapid experimentation led to fragmented tools and inconsistent impact. Responsible for consolidating, rebuilding and operationalising AI solutions across GTM and aligning them with business strategy.',
    highlights: [
      'Defined and implemented the global AI motion for Sales (New Business & Customer Growth), creating pathways for both bottom-up innovation and executive-led AI initiatives across a 300-person Sales org',
      'Designed and deployed certified internal AI tools supporting Sales ICs and Leadership, with adoption reaching 75–80% across sub-departments',
      'Increased adoption of certified AI tools by 150% within 60 days through structured enablement programmes, leader activation, and value-led workshops',
      'Led a strategic AI vendor evaluation and procurement initiative to reduce SMB demo lead time from ~20 days to hours and improve MQL to SQL conversion velocity',
      'Acted as cross-functional delivery layer between GTM, Tech, Enablement and RevOps',
      'Owned end-to-end product lifecycle for internal AI tools (ideation → requirements → build → test → release → enable → iterate)',
      'Built and operationalised a cross-regional AI Leaders forum defining ownership, cadences, playbooks and accountability to decentralise AI ownership and scale adoption',
      'Designed "AI in the flow of work" integrations, embedding solutions into Salesforce, Clari and existing CRO/VP workflows',
      'Work across the full GTM leadership from CRO and Regional VPs down to RevOps and Innovation, ensuring AI strategy lands consistently at every level',
    ],
    awards: ['Global AI Innovation Award'],
    metrics: [
      { value: '300', label: 'Person sales org' },
      { value: '150%', label: 'Adoption lift in 60 days' },
      { value: '75–80%', label: 'Certified tool adoption' },
      { value: '26', label: 'AI products shipped' },
    ],
  },
  {
    company: 'HiBob',
    title: 'Senior Sales Engineer',
    period: 'Feb 2024 – July 2025',
    summary: 'Promoted to AI Leader for Sales from June 2024 while continuing as Senior SE, championing AI adoption across the global SE team.',
    highlights: [
      'Initiated and championed AI adoption by developing the first custom GPTs for the global SE team of 37 SEs',
      'Automated critical and everyday tasks including RFP responses, discovery prep, demo preparation, business case creation and demo feedback automation',
      'Demo Prep GPT: saved ~4,440 hours per year across the global SE team (67% reduction)',
      'RFP Responses: reduced RFP completion time by 224 hours annually (70% reduction)',
      'Wrote "how-to" guides and documentation to drive adoption of custom GPTs and AI tools',
      'Led local enablement sessions and organised project teams to create and execute new AI use cases',
      'Attached to and responsible for $749k ARR equalling $2.24m TCV throughout H2',
      'Secured the 3rd largest 2024 UK deal at $334k ACV, including the largest UK Payroll module and 2nd largest global LMS deal',
      'Developed the "Win-Plan Template" aligned with the emerging global sales playbook, including MEDPICC analysis',
      'Redesigned and improved the RFP template, shifting the SE team from reactive to proactive and improving RFP win-rate',
    ],
    awards: ['Global AI Innovation Award'],
    metrics: [
      { value: '$749k', label: 'ARR managed (H2)' },
      { value: '$334k', label: 'Largest deal ACV' },
      { value: '4,440', label: 'Hours saved annually' },
      { value: '70%', label: 'RFP time reduction' },
    ],
  },
  {
    company: 'Bullhorn',
    title: 'Senior Solutions Consultant',
    period: 'Sept 2020 – Feb 2024',
    summary: 'Senior SC in the International & EMEA team for Bullhorn for Salesforce, managing complex enterprise deals and leading technical sales across the recruitment technology market.',
    highlights: [
      'International Solutions Consultant of the Year 22/23 in a team of 15 SCs',
      'Achieved Presidents Club for highest quota attach in the Intl & EMEA team',
      'Closed the 2nd largest deal in FY22/23 at $2.6m ACV',
      'Closed total of $3.5m ACV in FY22/23, managing deals ranging from $200k–$1m+',
      'SME for the Workforce Management solution, influencing sales strategy and GTM efforts',
      'Designed and led a comprehensive "Workforce Management" training programme for 15 SCs',
      'Led the technical portion of the sales process including solution discovery, RFx, tailored demos and workshops',
      'Continual maintenance and configuration of Salesforce demo environments including custom objects, flows, mobile configuration with JSON and digital experiences',
    ],
    awards: ['International Solutions Consultant of the Year 22/23', 'Presidents Club'],
    metrics: [
      { value: '$3.5m', label: 'ACV closed FY22/23' },
      { value: '$2.6m', label: 'Largest deal ACV' },
      { value: '#1', label: 'EMEA quota attach' },
    ],
  },
  {
    company: 'Cooper Parry IT',
    title: 'IT Sales Solutions Specialist',
    period: 'Oct 2019 – Jul 2020',
    highlights: [
      'Managed IT solutions sales in a specialist technology division',
      'Role ended due to Covid-19 redundancy',
    ],
  },
  {
    company: 'Hays',
    title: 'Principal Consultant — IT & Technology',
    period: 'June 2016 – Oct 2019',
    highlights: [
      'Specialist IT and Technology recruitment consultant',
      'Progressed to Principal Consultant level over 3+ years',
    ],
  },
];

export function CareerHistory() {
  return (
    <div className="py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <BlurFade delay={0}>
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Career History</h2>
            <p className="text-text-secondary">7+ years in B2B tech sales, solutions engineering and AI strategy</p>
          </div>
        </BlurFade>

        {/* Education */}
        <BlurFade delay={0.05}>
          <div className="mb-10 p-4 bg-bg-secondary border border-border rounded-xl flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-lg">
              🎓
            </div>
            <div>
              <div className="font-semibold text-text-primary text-sm">Nottingham Trent University</div>
              <div className="text-xs text-text-secondary mt-0.5">BSc Psychology (2.1) · Sept 2013 – June 2016</div>
            </div>
          </div>
        </BlurFade>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-accent via-border to-border" />

          <div className="space-y-8">
            {roles.map((role, i) => (
              <BlurFade key={i} delay={0.08 + i * 0.07}>
                <div className="relative pl-12">
                  {/* Timeline dot */}
                  <div className={`absolute left-3 top-5 w-3 h-3 rounded-full border-2 z-10 ${
                    role.isCurrent
                      ? 'bg-accent border-accent shadow-[0_0_0_3px_rgba(30,64,175,0.15)]'
                      : i <= 1 ? 'bg-accent/60 border-accent/60'
                      : 'bg-white border-border'
                  }`} />
                  {role.isCurrent && (
                    <div className="absolute left-3 top-5 w-3 h-3 rounded-full bg-accent animate-ping opacity-30 z-10" />
                  )}

                  <div className={`bg-white border rounded-xl p-6 transition-all duration-200
                    hover:border-accent/30 hover:shadow-[0_4px_20px_rgba(30,64,175,0.06)]
                    ${role.isCurrent ? 'border-accent/30 shadow-[0_2px_12px_rgba(30,64,175,0.06)]' : 'border-border'}`}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-text-primary leading-snug">{role.title}</h3>
                          {role.isCurrent && (
                            <span className="px-2 py-0.5 bg-accent text-white text-[10px] font-semibold rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-accent font-semibold text-sm mt-0.5">{role.company}</div>
                      </div>
                      <span className="text-xs text-text-secondary bg-bg-secondary px-3 py-1 rounded-full border border-border flex-shrink-0">
                        {role.period}
                      </span>
                    </div>

                    {/* Summary */}
                    {role.summary && (
                      <p className="text-sm text-text-secondary mb-4 leading-relaxed">{role.summary}</p>
                    )}

                    {/* Metrics */}
                    {role.metrics && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-4 bg-bg-secondary rounded-lg">
                        {role.metrics.map((m, j) => (
                          <div key={j}>
                            <div className="text-lg font-bold text-success leading-tight">{m.value}</div>
                            <div className="text-xs text-text-secondary leading-tight mt-0.5">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Awards */}
                    {role.awards && role.awards.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {role.awards.map((award, j) => (
                          <span key={j} className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full">
                            <Award size={10} />
                            {award}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Highlights */}
                    <ul className="space-y-1.5">
                      {role.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <ChevronRight size={13} className="text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-text-primary">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
