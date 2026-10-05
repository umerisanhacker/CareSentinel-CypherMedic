import type { SecurityEvent } from '../../store/types';
import { Shield, AlertTriangle, Key, Network, Mail, Activity, Link as LinkIcon, Server, ChevronRight } from 'lucide-react';
import { useSetCurrentView, useSelectIncident } from '../../store/store';
import { DecisionBadge, deriveDecisionStatus } from '../security/DecisionBadge';

interface Props {
  events: SecurityEvent[];
}

export default function RecentEvents({ events }: Props) {
  const setCurrentView = useSetCurrentView();
  const selectIncident = useSelectIncident();

  const getIcon = (category: string) => {
    switch (category) {
      case 'identity': return <Key className="h-4 w-4 text-[var(--warning)]" />;
      case 'network': return <Network className="h-4 w-4 text-[var(--accent-secondary)]" />;
      case 'email': return <Mail className="h-4 w-4 text-[var(--accent-primary)]" />;
      case 'ehr': return <Activity className="h-4 w-4 text-[var(--critical)]" />;
      case 'linkguard': return <LinkIcon className="h-4 w-4 text-[var(--warning)]" />;
      case 'application': return <Server className="h-4 w-4 text-purple-600" />;
      default: return <Shield className="h-4 w-4 text-[var(--text-secondary)]" />;
    }
  };

  const getTargetView = (category: string) => {
    switch (category) {
      case 'identity': return 'Identity';
      case 'network': return 'Network';
      case 'email': return 'Email Security';
      case 'ehr': return 'EHR Security';
      case 'linkguard': return 'LinkGuard';
      case 'application': return 'Application Security';
      default: return 'Overview';
    }
  };

  const handleEventClick = (e: SecurityEvent) => {
    if (e.relatedIncidentId) {
      selectIncident(e.relatedIncidentId);
      setCurrentView('Incidents');
    } else {
      setCurrentView(getTargetView(e.category));
    }
  };

  return (
    <div className="card" style={{ padding: '1.5rem', backgroundColor: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Live Security Activity
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Real-time multi-system event stream
          </div>
        </div>
        <span className="badge bg-positive-light">Live Stream</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {events.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem' }}>
            No recent events detected.
          </p>
        ) : events.map(e => (
          <button 
            key={e.id} 
            onClick={() => handleEventClick(e)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.8rem',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              textAlign: 'left',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(el) => el.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onMouseLeave={(el) => el.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '0.45rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {e.severity === 'critical' ? (
                  <AlertTriangle className="h-4 w-4 text-[var(--critical)] animate-pulse" />
                ) : (
                  getIcon(e.category)
                )}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {e.title}
                  </span>
                  <span className={`badge ${e.severity === 'critical' ? 'bg-critical-light' : e.severity === 'high' ? 'bg-warning-light' : 'bg-accent-light'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                    {e.severity.toUpperCase()}
                  </span>
                  <DecisionBadge status={deriveDecisionStatus(e)} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  <span style={{ fontWeight: 600 }}>{new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> • {e.actor || e.userId || e.source} • <span style={{ color: 'var(--text-muted)' }}>{e.system}</span>
                </div>
              </div>
            </div>

            <ChevronRight size={16} color="var(--text-muted)" />
          </button>
        ))}
      </div>
    </div>
  );
}
