import { User, Briefcase, Target, LayoutGrid, Sparkles, FileDown, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { TabId } from './Navigation';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',     label: 'Profile',       icon: <User size={15} /> },
  { id: 'career',      label: 'Career',         icon: <Briefcase size={15} /> },
  { id: 'looking-for', label: 'Looking For',    icon: <Target size={15} /> },
  { id: 'projects',    label: 'Projects',       icon: <LayoutGrid size={15} /> },
];

interface NavbarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onAskAI: () => void;
  onDownloadCV: () => void;
}

export function Navbar({ activeTab, onTabChange, onAskAI, onDownloadCV }: NavbarProps) {
  return (
    <div className="sticky top-3 z-50 px-3 md:px-6">
      <div className="max-w-5xl mx-auto bg-stone-950 rounded-2xl px-3 h-14 flex items-center gap-1 shadow-xl shadow-black/20">

        {/* Left: Branding */}
        <div className="flex items-center gap-2.5 pr-3 mr-1 flex-shrink-0">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">AF</span>
          </div>
          <div className="hidden md:block leading-tight">
            <div className="text-xs font-bold text-white">Alex Farman</div>
            <div className="text-[10px] text-stone-500">GTM AI Strategy</div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 flex-shrink-0" />

        {/* Center: Tabs */}
        <nav className="flex flex-1 items-center gap-0.5 px-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-1.5 px-2.5 md:px-3 py-2 text-sm font-medium whitespace-nowrap rounded-xl transition-colors duration-150 ${
                activeTab === tab.id ? 'text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{tab.icon}</span>
              <span className="relative z-10 hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 flex-shrink-0" />

        {/* Right: Actions */}
        <div className="flex items-center gap-1 pl-1 flex-shrink-0">
          {/* Ask AI */}
          <button
            onClick={onAskAI}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-2.5 md:px-3 py-2 text-sm font-medium transition-colors duration-150"
          >
            <Sparkles size={14} />
            <span className="hidden md:inline">Ask AI</span>
          </button>

          {/* Download CV */}
          <button
            onClick={onDownloadCV}
            className="flex items-center gap-1.5 border border-white/20 hover:bg-white/10 text-stone-300 hover:text-white rounded-xl px-2.5 md:px-3 py-2 text-sm font-medium transition-colors duration-150"
            aria-label="Download CV"
          >
            <FileDown size={14} />
            <span className="hidden md:inline">CV</span>
          </button>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/alex-farman-53575a106/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors duration-150"
            aria-label="LinkedIn"
          >
            <Linkedin size={15} />
          </a>
        </div>

      </div>
    </div>
  );
}
