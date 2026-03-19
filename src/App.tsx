import { useState } from 'react';
import { Hero } from './components/Hero';
import { Navigation, TabId } from './components/Navigation';
import { PersonalProfile } from './components/PersonalProfile';
import { CareerHistory } from './components/CareerHistory';
import { LookingFor } from './components/LookingFor';
import { ProjectPortfolio } from './components/ProjectPortfolio';
import { DownloadCTA } from './components/DownloadCTA';
import { FloatingActions } from './components/FloatingActions';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { QAOverlay } from './components/QAOverlay';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  const openLeadModal = () => setLeadModalOpen(true);
  const closeLeadModal = () => setLeadModalOpen(false);

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <Hero onTabChange={handleTabChange} />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      <main id="tab-content" className="min-h-screen bg-bg-primary">
        {activeTab === 'profile' && <PersonalProfile />}
        {activeTab === 'career' && <CareerHistory />}
        {activeTab === 'looking-for' && (
          <LookingFor
            onDownloadCV={openLeadModal}
            onViewProjects={() => handleTabChange('projects')}
          />
        )}
        {activeTab === 'projects' && <ProjectPortfolio />}
      </main>
      <DownloadCTA onDownloadCV={openLeadModal} />
      <FloatingActions onDownloadCV={openLeadModal} />
      <LeadCaptureModal isOpen={leadModalOpen} onClose={closeLeadModal} />
      <QAOverlay />
    </div>
  );
}

export default App;
