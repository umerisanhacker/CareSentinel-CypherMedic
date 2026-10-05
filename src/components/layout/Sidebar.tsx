import { 
  Shield, 
  Home, 
  AlertTriangle, 
  Mail, 
  Link, 
  FileCheck,
  Users, 
  Network, 
  Activity, 
  HeartPulse,
  Server,
  Play, 
  ScrollText, 
  Network as IntegrationIcon,
  Settings, 
  HelpCircle,
  ShieldCheck,
  Building2,
  UsersRound
} from 'lucide-react';
import { useCurrentView, useSetCurrentView, useStore } from '../../store/store';
import { selectNavigationAlertCounts } from '../../store/selectors';

export function Sidebar() {
  const currentView = useCurrentView();
  const setCurrentView = useSetCurrentView();
  const { state } = useStore();
  const alertCounts = selectNavigationAlertCounts(state);
  const deviceAlerts = state.events.filter(event =>
    Boolean(event.deviceId) && (event.status === 'new' || event.status === 'acknowledged')
  ).length;

  const securityItems = [
    { name: 'Incidents', icon: AlertTriangle, badge: alertCounts.incidents },
    { name: 'Email Security', icon: Mail, badge: alertCounts.emailSecurity },
    { name: 'LinkGuard', icon: Link, badge: alertCounts.linkGuard },
    { name: 'Attachments', icon: FileCheck, badge: alertCounts.attachments },
    { name: 'Identity', icon: Users, badge: alertCounts.identity },
    { name: 'Network', icon: Network, badge: alertCounts.network },
    { name: 'Application Security', icon: Server, badge: alertCounts.applicationSecurity },
    { name: 'EHR Security', icon: Activity, badge: alertCounts.ehrSecurity },
    { name: 'Devices', icon: HeartPulse, badge: deviceAlerts },
  ];

  const opItems = [
    { name: 'Attack Simulator', icon: Play, highlight: true },
    { name: 'Audit Ledger', icon: ScrollText },
  ];

  const systemItems = [
    { name: 'Integration', icon: IntegrationIcon },
    { name: 'Settings', icon: Settings },
    { name: 'Help', icon: HelpCircle },
  ];

  return (
    <aside className="sidebar" aria-label="CareSentinel security console navigation">
      {/* Brand Header */}
      <div style={{
        padding: '1.1rem 1.15rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          backgroundColor: 'var(--accent-primary)',
          color: 'white',
          width: '38px',
          height: '38px',
          borderRadius: '9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 22px rgba(8, 126, 164, 0.18)',
        }}>
          <Shield size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            CARESENTINEL
          </h2>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Clinical Security Intelligence
          </span>
        </div>
      </div>
      
      {/* Navigation List */}
      <div style={{ padding: '1rem 0.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Overview */}
        <div>
          <button
            onClick={() => setCurrentView('Overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              color: currentView === 'Overview' ? 'var(--accent-primary)' : 'var(--text-primary)',
              backgroundColor: currentView === 'Overview' ? 'var(--bg-hover)' : 'transparent',
              fontWeight: currentView === 'Overview' ? 700 : 500,
              fontSize: '0.875rem',
              transition: 'all 0.15s ease',
            }}
          >
            <Home size={18} style={{ marginRight: '0.75rem', color: currentView === 'Overview' ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
            Overview
          </button>
        </div>

        {/* Security Section */}
        <div>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.4rem',
            paddingLeft: '0.85rem',
          }}>
            Security
          </div>
          {securityItems.map((item) => {
            const active = currentView === item.name;
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setCurrentView(item.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '8px',
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  backgroundColor: active ? 'var(--bg-hover)' : 'transparent',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.85rem',
                  marginBottom: '0.15rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon size={17} style={{ marginRight: '0.75rem', color: active ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
                  {item.name}
                </div>
                {item.badge > 0 && (
                  <span
                    title={`${item.badge} verification ${item.badge === 1 ? 'item' : 'items'} pending`}
                    aria-label={`${item.badge} verification ${item.badge === 1 ? 'item' : 'items'} pending`}
                    style={{
                      width: '22px',
                      height: '22px',
                      minWidth: '22px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--critical)',
                      color: 'white',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      lineHeight: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(239, 68, 68, 0.22)',
                      border: '2px solid white',
                    }}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Incident Response Workspace */}
        {state.workspaceRole === 'incident_response' && (
          <div>
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.4rem',
              paddingLeft: '0.85rem',
            }}>
              Response
            </div>
            <button
              onClick={() => setCurrentView('Incident Response')}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                color: currentView === 'Incident Response' ? '#7c3aed' : 'var(--text-secondary)',
                backgroundColor: currentView === 'Incident Response' ? '#f5f3ff' : 'transparent',
                fontWeight: currentView === 'Incident Response' ? 700 : 500,
                fontSize: '0.85rem',
                marginBottom: '0.15rem',
              }}
            >
              <UsersRound size={17} style={{ marginRight: '0.75rem', color: currentView === 'Incident Response' ? '#7c3aed' : 'var(--text-secondary)' }} />
              Incident Response
            </button>
          </div>
        )}

        {/* Operations Section */}
        <div>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.4rem',
            paddingLeft: '0.85rem',
          }}>
            Operations
          </div>
          {opItems.map((item) => {
            const active = currentView === item.name;
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setCurrentView(item.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '8px',
                  color: active ? 'var(--accent-primary)' : item.highlight ? 'var(--critical)' : 'var(--text-secondary)',
                  backgroundColor: active ? 'var(--bg-hover)' : item.highlight ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
                  fontWeight: active || item.highlight ? 700 : 500,
                  fontSize: '0.85rem',
                  marginBottom: '0.15rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={17} style={{ marginRight: '0.75rem', color: active ? 'var(--accent-primary)' : item.highlight ? 'var(--critical)' : 'var(--text-secondary)' }} />
                {item.name}
              </button>
            );
          })}
        </div>

        {/* System Section */}
        <div>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.4rem',
            paddingLeft: '0.85rem',
          }}>
            System
          </div>
          {systemItems.map((item) => {
            const active = currentView === item.name;
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setCurrentView(item.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '8px',
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  backgroundColor: active ? 'var(--bg-hover)' : 'transparent',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.85rem',
                  marginBottom: '0.15rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={17} style={{ marginRight: '0.75rem', color: active ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Hospital & SOC Badge */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--bg-main)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <Building2 size={16} color="var(--accent-primary)" />
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Northstar Medical Center
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--positive)' }}>
          <ShieldCheck size={13} /> Synthetic Hospital Environment
        </div>
      </div>
    </aside>
  );
}
