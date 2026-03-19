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
  { id: 'adoption',  label: 'Driving adoption at scale',          icon: TrendingUp, description: 'Change management, enablement, org-wide rollout' },
  { id: 'strategic', label: 'Strategic execution with executives', icon: Target,     description: 'CRO/VP workflows, forecast intelligence, high-stakes initiatives' },
  { id: 'impact',    label: 'Measurable business impact',         icon: BarChart3,  description: 'Time savings, revenue velocity, efficiency gains' },
  { id: 'ownership', label: 'End-to-end product ownership',       icon: Package,    description: 'Ideation → build → enable → iterate, cross-functional delivery' },
];

export function ProjectPortfolio() {
  const [selectedFilters, setSelectedFilters] = useState<FilterId[]>([]);

  const toggleFilter = (id: FilterId) => {
    setSelectedFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const sorted = filterAndSortProjects(projects, selectedFilters);
  const flagship = sorted.filter(p => p.flagship);
  const additional = sorted.filter(p => !p.flagship);
  const matchCount = selectedFilters.length > 0
    ? sorted.filter(p => p.tags.some(t => selectedFilters.includes(t as FilterId))).length
    : sorted.length;

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Projects Delivered with Impact
          </h2>
          <p className="text-text-secondary">
            {projects.length} AI products built and shipped across HiBob's GTM organisation.
            Filter by what matters most to you.
          </p>
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
                    <Icon size={14} className={isSelected ? 'text-accent' : 'text-text-secondary'} />
                    <span className={`text-xs font-semibold ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                      {filter.label}
                    </span>
                  </div>
                  <div className="text-xs text-text-secondary leading-tight pl-5">
                    {filter.description}
                  </div>
                </button>
              );
            })}
          </div>
          {selectedFilters.length > 0 && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-text-secondary">
                {matchCount} matching project{matchCount !== 1 ? 's' : ''}
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

        {/* ── Flagship projects ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-lg font-bold text-text-primary">Flagship Projects</h3>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-accent/10 text-accent rounded-full">
              {flagship.length}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flagship.map((project, index) => (
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

        {/* ── Additional projects ── */}
        {additional.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-lg font-bold text-text-primary">Also Built</h3>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-text-secondary rounded-full">
                {additional.length}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {additional.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    selectedFilters={selectedFilters}
                    index={flagship.length + index}
                  />
                ))}
              </div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
