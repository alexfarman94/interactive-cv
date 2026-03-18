import { TrendingUp, Target, BarChart3, Package, type LucideIcon } from 'lucide-react';
import { FilterId } from '../lib/types';

const filters: { id: FilterId; label: string; icon: LucideIcon; description: string }[] = [
  {
    id: 'adoption',
    label: 'Driving adoption at scale',
    icon: TrendingUp,
    description: 'Change management, enablement, org-wide rollout',
  },
  {
    id: 'strategic',
    label: 'Strategic execution with executives',
    icon: Target,
    description: 'CRO/VP workflows, forecast intelligence, high-stakes initiatives',
  },
  {
    id: 'impact',
    label: 'Measurable business impact',
    icon: BarChart3,
    description: 'Time savings, revenue velocity, efficiency gains',
  },
  {
    id: 'ownership',
    label: 'End-to-end product ownership',
    icon: Package,
    description: 'Ideation → build → enable → iterate, cross-functional delivery',
  },
];

interface PriorityFiltersProps {
  selectedFilters: FilterId[];
  onFilterChange: (filters: FilterId[]) => void;
}

export function PriorityFilters({ selectedFilters, onFilterChange }: PriorityFiltersProps) {
  const toggleFilter = (id: FilterId) => {
    if (selectedFilters.includes(id)) {
      onFilterChange(selectedFilters.filter(f => f !== id));
    } else {
      onFilterChange([...selectedFilters, id]);
    }
  };

  return (
    <section id="priority-filters" className="py-20 md:py-24 bg-bg-secondary">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            What matters most to you?
          </h2>
          <p className="text-text-secondary text-lg">
            Select your priorities to surface the most relevant projects first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {filters.map(filter => {
            const isSelected = selectedFilters.includes(filter.id);
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`text-left p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                    : 'border-border bg-white hover:border-accent/50 hover:bg-accent/[0.02]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 transition-colors duration-200 ${isSelected ? 'text-accent' : 'text-text-secondary'}`}>
                    <Icon size={32} />
                  </div>
                  <div>
                    <div className={`font-semibold text-lg mb-1 transition-colors duration-200 ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                      {filter.label}
                    </div>
                    <div className="text-sm text-text-secondary">{filter.description}</div>
                  </div>
                  {isSelected && (
                    <div className="ml-auto mt-0.5">
                      <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {selectedFilters.length > 0 && (
          <div className="text-center">
            <button
              onClick={() => onFilterChange([])}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors underline underline-offset-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
