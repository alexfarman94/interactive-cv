import { User, Briefcase, Target, LayoutGrid } from 'lucide-react';

export type TabId = 'profile' | 'career' | 'looking-for' | 'projects';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',     label: 'Personal Profile',      icon: <User size={15} /> },
  { id: 'career',      label: 'Career History',        icon: <Briefcase size={15} /> },
  { id: 'looking-for', label: "What I'm Looking For",  icon: <Target size={15} /> },
  { id: 'projects',    label: 'Projects & Impact',     icon: <LayoutGrid size={15} /> },
];

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-0">

          {/* Name anchor — visible on desktop, gives the sticky bar identity */}
          <div className="hidden md:flex items-center gap-2.5 pr-6 mr-2 border-r border-border py-3 flex-shrink-0">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
              <span className="text-white text-xs font-bold">AF</span>
            </div>
            <div className="leading-tight">
              <div className="text-xs font-bold text-text-primary">Alex Farman</div>
              <div className="text-[10px] text-text-secondary">GTM AI Strategy</div>
            </div>
          </div>

          {/* Tab strip */}
          <nav className="flex overflow-x-auto scrollbar-hide flex-1 -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 md:px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-200'
                }`}
              >
                <span className={`transition-colors duration-200 ${activeTab === tab.id ? 'text-accent' : 'text-text-secondary'}`}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
