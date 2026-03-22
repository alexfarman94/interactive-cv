import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TabId } from './Navigation';

const TAB_ORDER: { id: TabId; label: string }[] = [
  { id: 'profile',     label: 'Personal Profile' },
  { id: 'career',      label: 'Career History' },
  { id: 'looking-for', label: "What I'm Looking For" },
  { id: 'projects',    label: 'Projects & Impact' },
];

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  const currentIndex = TAB_ORDER.findIndex(t => t.id === activeTab);
  const prevTab = currentIndex > 0 ? TAB_ORDER[currentIndex - 1] : null;
  const nextTab = currentIndex < TAB_ORDER.length - 1 ? TAB_ORDER[currentIndex + 1] : null;

  return (
    <div className="flex items-center justify-between px-6 py-5 border-t border-stone-100 md:hidden">
      {prevTab ? (
        <button
          onClick={() => onTabChange(prevTab.id)}
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft size={15} />
          {prevTab.label}
        </button>
      ) : <span />}
      {nextTab ? (
        <button
          onClick={() => onTabChange(nextTab.id)}
          className="flex items-center gap-1.5 text-sm font-medium text-indigo-500 hover:text-indigo-700 transition-colors ml-auto"
        >
          {nextTab.label}
          <ChevronRight size={15} />
        </button>
      ) : null}
    </div>
  );
}
