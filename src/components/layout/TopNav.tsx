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
        {/* Left side: Search & Demo indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '640px' }}>
          <div 
            onClick={() => setShowSearchModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '340px',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease',
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.6rem' }}>
              Search incidents, patients, doctors...
            </span>
            <span style={{
              marginLeft: 'auto',
              fontSize: '0.7rem',
              backgroundColor: 'white',
              border: '1px solid var(--border)',
              padding: '0.1rem 0.4rem',
              borderRadius: '4px',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}>
              ⌘K
            </span>
          </div>

          <div className="topnav-demo-badge">
            <ShieldCheck size={14} color="var(--positive)" />
            <span>DEMO MODE — Synthetic Hospital</span>
          </div>

          <button
            onClick={() => setShowResetModal(true)}
            title="Reset Demo Environment"
            className="topnav-reset-btn"
          >
            <RotateCcw size={13} color="var(--warning)" />
            <span>Reset Demo</span>
          </button>

          {resetFeedback && (
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--positive)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={14} /> {resetFeedback}
            </span>
          )}
        </div>

        {/* Right side: System health, Guided Demo, Notifications, Public Toggle, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            onClick={() => setShowGuidedDemo(true)}
            className="btn btn-outline topnav-demo-btn"
          >
            <Play size={14} /> Start Guided Demo
          </button>

          <div className="topnav-system-status">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--positive)', display: 'inline-block' }}></span>
            <span style={{ fontWeight: 500 }}>All Systems Monitored</span>
          </div>

          <div className="topnav-divider" aria-hidden="true"></div>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => {
                setShowNotifs(!showNotifs);
                if (!showNotifs) markNotificationsRead();
              }}
              className="topnav-icon-btn" aria-label="Security notifications"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  minWidth: '16px',
                  height: '16px',
                  padding: '0 4px',
                  backgroundColor: 'var(--critical)',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifs && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                width: '360px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 60,
                marginTop: '0.5rem',
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

          {/* Switch to Public Website */}
          <button
            onClick={() => setAppMode('public')}
            className="btn btn-secondary topnav-public-btn"
            title="Switch to Public Product Website"
          >
            Public Site <ExternalLink size={13} />
          </button>

          {/* Workspace / Role Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowWorkspaceMenu(value => !value)}
              aria-haspopup="menu"
              aria-expanded={showWorkspaceMenu}
              title="Switch security workspace"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.35rem 0.55rem',
                borderRadius: '9px',
                border: showWorkspaceMenu ? '1px solid var(--accent-primary)' : '1px solid transparent',
                background: showWorkspaceMenu ? 'var(--bg-hover)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: workspaceRole === 'incident_response' ? '#f3e8ff' : 'var(--accent-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: workspaceRole === 'incident_response' ? '#7c3aed' : 'var(--accent-primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}>
                {workspaceRole === 'incident_response' ? 'IR' : 'SA'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: '112px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                  {workspaceRole === 'incident_response' ? 'Incident Response' : 'SOC Analyst L2'}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                  Northstar Medical
                </span>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {showWorkspaceMenu && (
              <div
                role="menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.45rem)',
                  right: 0,
                  width: '285px',
                  padding: '0.45rem',
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 100,
                }}
              >
                <div style={{ padding: '0.55rem 0.65rem 0.45rem', fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Security Workspace
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setWorkspaceRole('soc_analyst_l2');
                    setShowWorkspaceMenu(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.7rem',
                    borderRadius: '9px',
                    background: workspaceRole === 'soc_analyst_l2' ? 'var(--bg-hover)' : 'transparent',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <ShieldCheck size={17} color="var(--accent-primary)" />
                  <span style={{ flex: 1 }}>
                    <strong style={{ display: 'block', fontSize: '0.8rem' }}>SOC Analyst L2</strong>
                    <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Triage, investigation & correlation</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWorkspaceRole('incident_response');
                    setShowWorkspaceMenu(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.7rem',
                    borderRadius: '9px',
                    background: workspaceRole === 'incident_response' ? '#f5f3ff' : 'transparent',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <UsersRound size={17} color="#7c3aed" />
                  <span style={{ flex: 1 }}>
                    <strong style={{ display: 'block', fontSize: '0.8rem' }}>Incident Response Team</strong>
                    <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Containment, eradication & recovery</span>
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
