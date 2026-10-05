import { useState } from 'react';
import { 
  Search, 
  Bell, 
  ShieldCheck, 
  ExternalLink, 
  Play,
  RotateCcw,
  AlertTriangle,
  X,
  ChevronDown,
  UsersRound
} from 'lucide-react';
import { 
  useNotifications, 
  useMarkNotificationsRead, 
  useSetAppMode, 
  useSetCurrentView,
  useSelectIncident,
  useResetDemo,
  useWorkspaceRole,
  useSetWorkspaceRole
} from '../../store/store';
import { GlobalSearchModal } from './GlobalSearchModal';
import { GuidedDemoModal } from './GuidedDemoModal';

export function TopNav() {
  const notifications = useNotifications();
  const markNotificationsRead = useMarkNotificationsRead();
  const setAppMode = useSetAppMode();
  const setCurrentView = useSetCurrentView();
  const selectIncident = useSelectIncident();
  const resetDemo = useResetDemo();
  const workspaceRole = useWorkspaceRole();
  const setWorkspaceRole = useSetWorkspaceRole();
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showGuidedDemo, setShowGuidedDemo] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  const handleConfirmReset = () => {
    resetDemo();
    setShowResetModal(false);
    setResetFeedback('Demo environment restored.');
    setTimeout(() => setResetFeedback(null), 3500);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'var(--critical)';
      case 'high': return 'var(--warning)';
      case 'medium': return 'var(--accent-primary)';
      default: return 'var(--positive)';
    }
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    if (notif.relatedIncidentId) {
      selectIncident(notif.relatedIncidentId);
    } else if (notif.targetView) {
      setCurrentView(notif.targetView);
    }
    setShowNotifs(false);
  };

  return (
    <>
      <header className="top-nav">
        <div className="topnav-search-zone">
          <button
            type="button"
            onClick={() => setShowSearchModal(true)}
            className="topnav-search"
            aria-label="Search CareSentinel"
          >
            <Search size={16} />
            <span>Search incidents, patients, doctors...</span>
            <kbd>⌘K</kbd>
          </button>
        </div>

        <div className="topnav-command-zone">
          <div className="topnav-environment">
            <span className="topnav-environment-dot"><ShieldCheck size={13} /></span>
            <span>DEMO MODE</span>
            <span className="topnav-environment-divider" />
            <span className="topnav-environment-context">Synthetic Hospital</span>
          </div>

          <div className="topnav-actions">
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              title="Reset Demo Environment"
              className="topnav-reset-btn"
            >
              <RotateCcw size={14} />
              <span>Reset Demo</span>
            </button>

            <button
              type="button"
              onClick={() => setShowGuidedDemo(true)}
              className="topnav-demo-btn"
            >
              <Play size={14} />
              <span>Start Guided Demo</span>
            </button>
          </div>

          {resetFeedback && (
            <span className="topnav-feedback" role="status">
              <ShieldCheck size={14} />
              {resetFeedback}
            </span>
          )}
        </div>

        <div className="topnav-utility-zone">
          <div className="topnav-system-status" aria-label="System monitoring status">
            <span className="topnav-status-dot" />
            <span>All Systems Monitored</span>
          </div>

          <div className="topnav-divider" aria-hidden="true" />

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setShowNotifs(!showNotifs);
                if (!showNotifs) markNotificationsRead();
              }}
              className="topnav-icon-btn"
              aria-label="Security notifications"
              aria-expanded={showNotifs}
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="topnav-notification-count">{unreadCount}</span>
              )}
            </button>

            {showNotifs && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 0.55rem)',
                right: 0,
                width: '360px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 60,
                padding: '1rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Security Notifications
                  </div>
                  <button
                    onClick={markNotificationsRead}
                    style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 500 }}
                  >
                    Mark all read
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '320px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '0.65rem',
                          backgroundColor: n.read ? 'transparent' : 'var(--bg-hover)',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.825rem', fontWeight: 700, color: severityColor(n.severity) }}>
                            {n.title}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          {n.message}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setAppMode('public')}
            className="btn btn-secondary topnav-public-btn"
            title="Switch to Public Product Website"
          >
            <span>Public Site</span>
            <ExternalLink size={13} />
          </button>

          <div className="topnav-user-zone">
            <button
              type="button"
              onClick={() => setShowWorkspaceMenu(value => !value)}
              aria-haspopup="menu"
              aria-expanded={showWorkspaceMenu}
              title="Switch security workspace"
              className="topnav-user-btn"
            >
              <div className="topnav-avatar">
                {workspaceRole === 'incident_response' ? 'IR' : 'SA'}
              </div>
              <div className="topnav-user-copy">
                <span>{workspaceRole === 'incident_response' ? 'Incident Response' : 'SOC Analyst L2'}</span>
                <small>Northstar Medical</small>
              </div>
              <ChevronDown size={14} />
            </button>

            {showWorkspaceMenu && (
              <div
                role="menu"
                className="topnav-workspace-menu"
              >
                <div className="topnav-workspace-label">Security Workspace</div>

                <button
                  type="button"
                  onClick={() => {
                    setWorkspaceRole('soc_analyst_l2');
                    setShowWorkspaceMenu(false);
                  }}
                  className={workspaceRole === 'soc_analyst_l2' ? 'topnav-workspace-option active' : 'topnav-workspace-option'}
                >
                  <ShieldCheck size={17} />
                  <span>
                    <strong>SOC Analyst L2</strong>
                    <small>Triage, investigation & correlation</small>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWorkspaceRole('incident_response');
                    setShowWorkspaceMenu(false);
                  }}
                  className={workspaceRole === 'incident_response' ? 'topnav-workspace-option ir-active' : 'topnav-workspace-option'}
                >
                  <UsersRound size={17} />
                  <span>
                    <strong>Incident Response Team</strong>
                    <small>Containment, eradication & recovery</small>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <GlobalSearchModal 
        isOpen={showSearchModal} 
        onClose={() => setShowSearchModal(false)} 
        initialQuery=""
      />

      <GuidedDemoModal
        isOpen={showGuidedDemo}
        onClose={() => setShowGuidedDemo(false)}
      />

      {/* Confirmation Modal for Reset Demo Environment */}
      {showResetModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div className="card animate-fade-in" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--warning-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--warning)',
                }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Reset Demo Environment?
                  </h3>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Baseline Restoration
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                style={{ color: 'var(--text-muted)', padding: '0.25rem', borderRadius: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '1.75rem',
            }}>
              This will clear all simulated security events, incidents, notifications, audit entries, and attack-chain progress and restore the synthetic hospital to its initial baseline.
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
            }}>
              <button
                onClick={() => setShowResetModal(false)}
                className="btn btn-outline"
                style={{ padding: '0.6rem 1.25rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="btn btn-danger"
                style={{
                  padding: '0.6rem 1.25rem',
                  backgroundColor: 'var(--critical)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                }}
              >
                <RotateCcw size={15} /> Reset Environment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
