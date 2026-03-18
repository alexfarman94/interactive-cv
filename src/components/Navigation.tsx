import { User, Briefcase, Zap, LayoutGrid } from 'lucide-react';

export type TabId = 'profile' | 'career' | 'skills' | 'projects';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Personal Profile', icon: <User size={16} /> },
  { id: 'career', label: 'Career History', icon: <Briefcase size={16} /> },
  { id: 'skills', label: 'Key Skills', icon: <Zap size={16} /> },
  { id: 'projects', label: 'Projects & Impact', icon: <LayoutGrid size={16} /> },
];

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <nav className="flex overflow-x-auto scrollbar-hide -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors duration-150 ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
