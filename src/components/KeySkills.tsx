import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { BlurFade } from './ui/blur-fade';

interface SkillGroup {
  category: string;
  emoji: string;
  description: string;
  skills: string[];
}

const toolGroups: SkillGroup[] = [
  {
    category: 'AI Platforms',
    emoji: '🤖',
    description: 'Hands-on product development and workflow design',
    skills: ['GPT-4o / GPT-5+', 'Claude (Anthropic)', 'Gemini', 'NotebookLM', 'Inventive'],
  },
  {
    category: 'Revenue & GTM',
    emoji: '📊',
    description: 'Daily use across sales engineering and AI strategy',
    skills: ['Salesforce', 'Clari', 'Gong', 'Outreach'],
  },
  {
    category: 'Automation & Integration',
    emoji: '⚙️',
    description: 'Workflow automation and system integration',
    skills: ['Zapier', 'Workato'],
  },
  {
    category: 'Productivity & Ops',
    emoji: '🗂️',
    description: 'Project management and operational tooling',
    skills: ['Notion', 'Asana'],
  },
];

interface Competency {
  title: string;
  level: number; // 1–5
  tags: string[];
  summary: string;
}

const competencies: Competency[] = [
  {
    title: 'AI Product Ownership',
    level: 5,
    tags: ['End-to-end', 'Full lifecycle', 'Internal tools'],
    summary: 'Ideation → requirements → build → test → release → enable → iterate. 26 products shipped across a 300-person org.',
  },
  {
    title: 'GTM Enablement & Change Management',
    level: 5,
    tags: ['Org-wide rollout', 'Adoption', 'Behavioural change'],
    summary: '150% adoption lift in 60 days. Certified tool programmes with 75–80% org penetration. Multi-region enablement.',
  },
  {
    title: 'Executive Stakeholder Management',
    level: 5,
    tags: ['CRO/VP level', 'Forecast intelligence', 'Board-level initiatives'],
    summary: 'Works directly with CRO, Regional VPs, RevOps leadership. Reported to CRO on strategic AI procurement initiative.',
  },
  {
    title: 'Technical Sales Engineering',
    level: 5,
    tags: ['Enterprise', 'Mid-market', 'Solutions design'],
    summary: '$3.5m ACV in FY22/23 at Bullhorn. EMEA #1 quota attach. International SC of the Year 22/23.',
  },
  {
    title: 'Cross-functional Delivery',
    level: 4,
    tags: ['GTM', 'Tech', 'RevOps', 'Enablement'],
    summary: 'Acts as delivery layer across GTM, Tech, Enablement, and RevOps. Translates frontline workflows into product specs.',
  },
  {
    title: 'AI Strategy & Architecture',
    level: 4,
    tags: ['Use case identification', 'Tool evaluation', 'Vendor management'],
    summary: 'Consolidated fragmented AI tools into a coherent strategy. Led vendor evaluation and procurement for exec initiatives.',
  },
  {
    title: 'Data & Insight Extraction',
    level: 4,
    tags: ['Gong', 'Clari', 'Salesforce', 'Call intelligence'],
    summary: 'Built AI layers over call recordings, CRM, and pipeline data to surface strategic insights for GTM teams.',
  },
  {
    title: 'Revenue Operations',
    level: 4,
    tags: ['Pipeline management', 'Forecasting', 'Process design'],
    summary: 'Embedded AI into Clari for VP/CRO decision intelligence. Designed pipeline and forecast tooling for exec review cadence.',
  },
];

const levelLabels = ['', 'Familiar', 'Working', 'Proficient', 'Advanced', 'Expert'];

function SkillBar({ level }: { level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className="flex gap-1 mb-3">
      {[1, 2, 3, 4, 5].map(n => (
        <motion.div
          key={n}
          className={`h-1.5 flex-1 rounded-full ${n <= level ? 'bg-accent' : 'bg-gray-100'}`}
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView && n <= level ? { scaleX: 1 } : {}}
          transition={{ duration: 0.35, delay: (n - 1) * 0.07, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

export function KeySkills() {
  return (
    <div className="py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">

        <BlurFade delay={0}>
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Key Skills</h2>
            <p className="text-text-secondary">Core competencies and tools developed across 7+ years in B2B tech</p>
          </div>
        </BlurFade>

        {/* Core Competencies */}
        <div className="mb-14">
          <BlurFade delay={0.05}>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-5">
              Core Competencies
            </h3>
          </BlurFade>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competencies.map((c, i) => (
              <BlurFade key={i} delay={0.07 + i * 0.05}>
                <div className="h-full bg-white border border-border rounded-xl p-5 hover:border-accent/30 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="font-semibold text-text-primary leading-snug">{c.title}</h4>
                    <span className="flex-shrink-0 px-2 py-0.5 bg-accent/10 text-accent text-xs font-bold rounded-md">
                      {levelLabels[c.level]}
                    </span>
                  </div>
                  <SkillBar level={c.level} />
                  <p className="text-xs text-text-secondary mb-3 leading-relaxed">{c.summary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.map((tag, j) => (
                      <span key={j} className="px-2 py-0.5 bg-bg-secondary text-text-secondary text-xs rounded-full border border-border">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div>
          <BlurFade delay={0.05}>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-5">
              Tools & Platforms
            </h3>
          </BlurFade>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {toolGroups.map((group, i) => (
              <BlurFade key={i} delay={0.07 + i * 0.06}>
                <div className="bg-bg-secondary border border-border rounded-xl p-5 hover:border-accent/20 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{group.emoji}</span>
                    <h4 className="font-semibold text-text-primary">{group.category}</h4>
                  </div>
                  <p className="text-xs text-text-secondary mb-3">{group.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill, j) => (
                      <span key={j} className="px-3 py-1 bg-white border border-border text-sm text-text-primary rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
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
