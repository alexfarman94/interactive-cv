import { useState } from 'react';
import { Hero } from './components/Hero';
import { Navigation, TabId } from './components/Navigation';
import { PersonalProfile } from './components/PersonalProfile';
import { CareerHistory } from './components/CareerHistory';
import { LookingFor } from './components/LookingFor';
import { ProjectPortfolio } from './components/ProjectPortfolio';
import { DownloadCTA } from './components/DownloadCTA';
import { FloatingActions } from './components/FloatingActions';
import { BackToTop } from './components/BackToTop';
import { TabNav } from './components/TabNav';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { QAOverlay } from './components/QAOverlay';
import { JobSpecAnalyzer } from './components/JobSpecAnalyzer';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [jobAnalyzerOpen, setJobAnalyzerOpen] = useState(false);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    document.getElementById('main-nav')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openLeadModal = () => setLeadModalOpen(true);
  const closeLeadModal = () => setLeadModalOpen(false);
  const openJobAnalyzer = () => setJobAnalyzerOpen(true);
  const closeJobAnalyzer = () => setJobAnalyzerOpen(false);

  return (
    <div className="min-h-screen bg-bg-primary pb-8">
      <Hero onTabChange={handleTabChange} />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      <main id="tab-content" className="min-h-screen bg-bg-primary">
        {activeTab === 'profile' && <PersonalProfile />}
        {activeTab === 'career' && <CareerHistory />}
        {activeTab === 'looking-for' && (
          <LookingFor
            onDownloadCV={openLeadModal}
            onViewProjects={() => handleTabChange('projects')}
            onOpenJobAnalyzer={openJobAnalyzer}
          />
        )}
        {activeTab === 'projects' && <ProjectPortfolio />}
        <TabNav activeTab={activeTab} onTabChange={handleTabChange} />
      </main>
      <DownloadCTA onDownloadCV={openLeadModal} />
      <FloatingActions onDownloadCV={openLeadModal} />
      <LeadCaptureModal isOpen={leadModalOpen} onClose={closeLeadModal} />
      <QAOverlay onOpenJobAnalyzer={openJobAnalyzer} />
      <JobSpecAnalyzer isOpen={jobAnalyzerOpen} onClose={closeJobAnalyzer} />
      <BackToTop />
    </div>
  );
}

export default App;
