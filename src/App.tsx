import { SecurityStoreProvider, useStore } from './store/store';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { PublicNavbar } from './views/public/PublicNavbar';
import { PublicFooter } from './views/public/PublicFooter';
import { PublicHome } from './views/public/PublicHome';
import { PublicFeatures } from './views/public/PublicFeatures';
import { PublicHowItWorks } from './views/public/PublicHowItWorks';
import { PublicSecurityArchitecture } from './views/public/PublicSecurityArchitecture';
import { PublicFAQ } from './views/public/PublicFAQ';
import { PublicPrivacy } from './views/public/PublicPrivacy';
import { PublicTerms } from './views/public/PublicTerms';
import { PublicLogin } from './views/public/PublicLogin';

import Overview from './views/Overview';
import Incidents from './views/Incidents';
import IncidentResponse from './views/IncidentResponse';
import EmailSecurity from './views/EmailSecurity';
import LinkGuard from './views/LinkGuard';
import AttachmentSecurity from './views/AttachmentSecurity';
import Identity from './views/Identity';
import NetworkView from './views/NetworkView';
import ApplicationSecurity from './views/ApplicationSecurity';
import EHRSecurity from './views/EHRSecurity';
import AttackSimulator from './views/AttackSimulator';
import AuditLedger from './views/AuditLedger';
import IntegrationView from './views/IntegrationView';
import Settings from './views/Settings';
import HelpView from './views/HelpView';

function AppContent() {
  const { state } = useStore();

  // Public Website Experience
  if (state.appMode === 'public') {
    const renderPublicPage = () => {
      switch (state.publicPage) {
        case 'home': return <PublicHome />;
        case 'features': return <PublicFeatures />;
        case 'how-it-works': return <PublicHowItWorks />;
        case 'security': return <PublicSecurityArchitecture />;
        case 'faq': return <PublicFAQ />;
        case 'privacy': return <PublicPrivacy />;
        case 'terms': return <PublicTerms />;
        case 'login': return <PublicLogin />;
        default: return <PublicHome />;
      }
    };

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
        <PublicNavbar />
        <main style={{ flex: 1 }}>
          {renderPublicPage()}
        </main>
        {state.publicPage !== 'login' && <PublicFooter />}
      </div>
    );
  }

  // Security Console Experience
  const renderConsoleView = () => {
    switch (state.currentView) {
      case 'Overview': return <Overview />;
      case 'Incidents': return <Incidents />;
      case 'Incident Response': return <IncidentResponse />;
      case 'Email Security': return <EmailSecurity />;
      case 'LinkGuard': return <LinkGuard />;
      case 'Attachments': return <AttachmentSecurity />;
      case 'Identity': return <Identity />;
      case 'Network': return <NetworkView />;
      case 'Application Security': return <ApplicationSecurity />;
      case 'EHR Security': return <EHRSecurity />;
      case 'Attack Simulator': return <AttackSimulator />;
      case 'Audit Ledger': return <AuditLedger />;
      case 'Integration': return <IntegrationView />;
      case 'Settings': return <Settings />;
      case 'Help': return <HelpView />;
      default: return <Overview />;
    }
  };

  return (
    <DashboardLayout>
      {renderConsoleView()}
    </DashboardLayout>
  );
}

function App() {
  return (
    <SecurityStoreProvider>
      <AppContent />
    </SecurityStoreProvider>
  );
}

export default App;
