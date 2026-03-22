import { useState, useEffect } from 'react';
import { User, Briefcase, Target, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 260);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      id="main-nav"
      className={`sticky top-0 z-40 backdrop-blur-lg border-b shadow-sm transition-all duration-500 ${
        scrolled
          ? 'bg-indigo-50/95 border-indigo-200/60 shadow-indigo-100/40'
          : 'bg-white/90 border-stone-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-0">

          {/* Name anchor */}
          <div className={`hidden md:flex items-center gap-2.5 pr-6 mr-2 border-r py-3 flex-shrink-0 transition-colors duration-500 ${scrolled ? 'border-indigo-200/60' : 'border-stone-200/60'}`}>
            <div className="w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">AF</span>
            </div>
            <div className="leading-tight">
              <div className="text-xs font-bold text-text-primary">Alex Farman</div>
              <div className="text-[10px] text-text-secondary">GTM AI Strategy</div>
            </div>
          </div>

          {/* Tab strip */}
          <div className="relative flex-1 overflow-hidden">
            <nav className="flex overflow-x-auto scrollbar-hide py-1.5">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 md:px-5 py-2.5 text-sm font-semibold whitespace-nowrap rounded-lg transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-indigo-600'
                      : scrolled
                        ? 'text-indigo-400 hover:text-indigo-600'
                        : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 bg-indigo-100 rounded-lg"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className={`relative z-10 transition-colors duration-200 ${activeTab === tab.id ? 'text-indigo-600' : scrolled ? 'text-indigo-400' : 'text-text-secondary'}`}>
                    {tab.icon}
                  </span>
                  <span className={`relative z-10 ${activeTab === tab.id || scrolled ? 'inline' : 'hidden md:inline'}`}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </nav>
            {/* Right-fade scroll hint — mobile only */}
            <div className={`absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l pointer-events-none z-10 md:hidden transition-all duration-500 ${scrolled ? 'from-indigo-50' : 'from-white'} to-transparent`} />
          </div>
        </div>
      </div>
    </div>
  );
}
