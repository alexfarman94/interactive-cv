import { motion } from 'framer-motion';
import { Project } from '../lib/types';

interface ProjectCardProps {
  project: Project;
  selectedFilters: string[];
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
};

export function ProjectCard({ project, selectedFilters, index }: ProjectCardProps) {
  const matchCount = selectedFilters.length > 0
    ? project.tags.filter(tag => selectedFilters.includes(tag)).length
    : selectedFilters.length;
  const isLowRelevance = selectedFilters.length > 0 && matchCount === 0;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      layout
      className={`bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col ${
        isLowRelevance ? 'opacity-40' : 'opacity-100'
      }`}
    >
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-lg font-bold text-text-primary leading-snug">{project.title}</h3>
      </div>

      {/* Context */}
      <p className="text-text-secondary text-sm mb-4 leading-relaxed">{project.context}</p>

      {/* Actions */}
      <ul className="space-y-1.5 mb-5">
        {project.actions.map((action, idx) => (
          <li key={idx} className="text-sm flex items-start gap-2">
            <span className="text-accent mt-0.5 flex-shrink-0">•</span>
            <span className="text-text-primary">{action}</span>
          </li>
        ))}
      </ul>

      {/* Impact Metrics */}
      <div className={`grid gap-3 mb-4 p-4 rounded-lg ${
        project.impact.length > 2 ? 'grid-cols-2' : 'grid-cols-2'
      } bg-bg-secondary`}>
        {project.impact.map((item, idx) => (
          <div key={idx}>
            <div className="text-xl md:text-2xl font-bold text-success">{item.value}</div>
            <div className="text-xs text-text-secondary leading-tight">{item.metric}</div>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {project.tags.map(tag => {
          const isActive = selectedFilters.includes(tag);
          const labels: Record<string, string> = {
            adoption: 'Adoption at scale',
            strategic: 'Strategic exec',
            impact: 'Measurable impact',
            ownership: 'E2E ownership',
          };
          return (
            <span
              key={tag}
              className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${
                isActive
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-text-secondary'
              }`}
            >
              {labels[tag] || tag}
            </span>
          );
        })}
      </div>

      {/* Deep Detail */}
      {project.deepDetail && (
        <details className="mt-4">
          <summary className="cursor-pointer text-xs text-accent font-semibold hover:text-accent-hover transition-colors">
            Behind the scenes ↓
          </summary>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">{project.deepDetail}</p>
        </details>
      )}
    </motion.div>
  );
}
