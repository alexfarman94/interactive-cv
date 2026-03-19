import { motion } from 'framer-motion';
import { Project } from '../lib/types';

interface ProjectCardProps {
  project: Project;
  selectedFilters: string[];
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: 'easeOut' },
  }),
};

const tagLabels: Record<string, string> = {
  adoption:  'Adoption at scale',
  strategic: 'Strategic exec',
  impact:    'Measurable impact',
  ownership: 'E2E ownership',
};

// ── Flagship card ────────────────────────────────────────────────────────────

function FlagshipCard({ project, selectedFilters, index }: ProjectCardProps) {
  const isLowRelevance = selectedFilters.length > 0 &&
    project.tags.filter(t => selectedFilters.includes(t)).length === 0;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      layout
      className={`group relative bg-white rounded-2xl p-6 flex flex-col shadow-sm border border-stone-100
        hover:shadow-md hover:-translate-y-0.5
        transition-all duration-200
        ${isLowRelevance ? 'opacity-30' : ''}`}
    >
      {/* Flagship badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-base font-bold text-text-primary leading-snug">{project.title}</h3>
        <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/50">
          Flagship
        </span>
      </div>

      {/* Context */}
      <p className="text-text-secondary text-sm mb-4 leading-relaxed">{project.context}</p>

      {/* Actions */}
      {project.actions && project.actions.length > 0 && (
        <ul className="space-y-1.5 mb-5">
          {project.actions.map((action, idx) => (
            <li key={idx} className="text-sm flex items-start gap-2">
              <span className="text-indigo-500 mt-[3px] flex-shrink-0 text-[10px]">▸</span>
              <span className="text-text-primary">{action}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Impact metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4 p-4 bg-stone-50 rounded-xl">
        {project.impact.map((item, idx) => (
          <div key={idx}>
            <div className="text-xl font-bold text-emerald-600 leading-tight">{item.value}</div>
            <div className="text-xs text-text-secondary leading-tight mt-0.5">{item.metric}</div>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {project.tags.map(tag => (
          <span
            key={tag}
            className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${
              selectedFilters.includes(tag)
                ? 'bg-indigo-600 text-white'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {tagLabels[tag] || tag}
          </span>
        ))}
      </div>

      {/* Deep detail */}
      {project.deepDetail && (
        <details className="mt-4 group/detail">
          <summary className="cursor-pointer text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors list-none flex items-center gap-1 select-none">
            <span className="transition-transform group-open/detail:rotate-90 inline-block">▸</span>
            Behind the scenes
          </summary>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">{project.deepDetail}</p>
        </details>
      )}
    </motion.div>
  );
}

// ── Compact card (non-flagship) ──────────────────────────────────────────────

function CompactCard({ project, selectedFilters, index }: ProjectCardProps) {
  const isLowRelevance = selectedFilters.length > 0 &&
    project.tags.filter(t => selectedFilters.includes(t)).length === 0;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      layout
      className={`bg-white rounded-2xl p-4 flex flex-col shadow-sm border border-stone-100
        hover:shadow-md hover:-translate-y-0.5
        transition-all duration-200
        ${isLowRelevance ? 'opacity-30' : ''}`}
    >
      <h3 className="text-sm font-bold text-text-primary mb-1.5 leading-snug">{project.title}</h3>
      <p className="text-xs text-text-secondary leading-relaxed mb-3 flex-1">{project.context}</p>

      {/* Metrics */}
      <div className="space-y-1.5 mb-3">
        {project.impact.map((item, idx) => (
          <div key={idx} className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-emerald-600 leading-none">{item.value}</span>
            <span className="text-[10px] text-text-secondary leading-tight">{item.metric}</span>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {project.tags.map(tag => (
          <span
            key={tag}
            className={`px-2 py-0.5 text-[10px] rounded-full font-medium transition-colors ${
              selectedFilters.includes(tag)
                ? 'bg-indigo-600 text-white'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {tagLabels[tag] || tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Exported wrapper ─────────────────────────────────────────────────────────

export function ProjectCard(props: ProjectCardProps) {
  return props.project.flagship
    ? <FlagshipCard {...props} />
    : <CompactCard {...props} />;
}
