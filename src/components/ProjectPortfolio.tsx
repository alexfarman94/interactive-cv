import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TrendingUp, Target, BarChart3, Package } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { projects } from '../data/projects';
import { filterAndSortProjects } from '../lib/filterProjects';
import { ProjectCard } from './ProjectCard';
import { FilterId } from '../lib/types';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const filters: { id: FilterId; label: string; icon: LucideIcon; description: string }[] = [
  { id: 'adoption', label: 'Driving adoption at scale', icon: TrendingUp, description: 'Change management, enablement, org-wide rollout' },
  { id: 'strategic', label: 'Strategic execution with executives', icon: Target, description: 'CRO/VP workflows, forecast intelligence, high-stakes initiatives' },
  { id: 'impact', label: 'Measurable business impact', icon: BarChart3, description: 'Time savings, revenue velocity, efficiency gains' },
  { id: 'ownership', label: 'End-to-end product ownership', icon: Package, description: 'Ideation → build → enable → iterate, cross-functional delivery' },
];

export function ProjectPortfolio() {
  const [selectedFilters, setSelectedFilters] = useState<FilterId[]>([]);

  const toggleFilter = (id: FilterId) => {
    setSelectedFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const sorted = filterAndSortProjects(projects, selectedFilters);

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Projects Delivered with Impact</h2>
          <p className="text-text-secondary">26 AI products built and shipped across HiBob's GTM organisation. Filter by what matters most to you.</p>
        </div>

        {/* Filter bar */}
        <div className="mb-8 p-5 bg-bg-secondary border border-border rounded-xl">
          <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Filter by priority
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filters.map(filter => {
              const isSelected = selectedFilters.includes(filter.id);
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`text-left p-3 rounded-lg border-2 transition-all duration-150 ${
                    isSelected
                      ? 'border-accent bg-accent/5 ring-1 ring-accent/20'
                      : 'border-border bg-white hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={15} className={isSelected ? 'text-accent' : 'text-text-secondary'} />
                    <span className={`text-xs font-semibold ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                      {filter.label}
                    </span>
                  </div>
                  <div className="text-xs text-text-secondary leading-tight pl-5">{filter.description}</div>
                </button>
              );
            })}
          </div>
          {selectedFilters.length > 0 && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-text-secondary">
                Sorted by relevance — {sorted.filter(p => p.tags.some(t => selectedFilters.includes(t as FilterId))).length} matching projects
              </span>
              <button
                onClick={() => setSelectedFilters([])}
                className="text-xs text-accent hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Project grid */}
        <div className="flex items-baseline justify-between mb-5">
          <span className="text-sm text-text-secondary">{sorted.length} projects</span>
        </div>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                selectedFilters={selectedFilters}
                index={index}
              />
            ))}
          </div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
