import { useState } from 'react';
import { Hero } from './components/Hero';
import { Navigation, TabId } from './components/Navigation';
import { PersonalProfile } from './components/PersonalProfile';
import { CareerHistory } from './components/CareerHistory';
import { KeySkills } from './components/KeySkills';
import { ProjectPortfolio } from './components/ProjectPortfolio';
import { AIAgent } from './components/AIAgent';
import { DownloadCTA } from './components/DownloadCTA';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('projects');

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Hero onTabChange={handleTabChange} />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      <main id="tab-content" className="min-h-screen bg-bg-primary">
        {activeTab === 'profile' && <PersonalProfile />}
        {activeTab === 'career' && <CareerHistory />}
        {activeTab === 'skills' && <KeySkills />}
        {activeTab === 'projects' && <ProjectPortfolio />}
      </main>
      <AIAgent />
      <DownloadCTA />
    </div>
  );
}

export default App;
