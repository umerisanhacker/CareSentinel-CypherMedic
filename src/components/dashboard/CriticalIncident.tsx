import type { CorrelatedIncident } from '../../store/types';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { useEvents, useSelectIncident, useSetCurrentView } from '../../store/store';

interface Props {
  incident: CorrelatedIncident;
}

export default function CriticalIncident({ incident }: Props) {
  const events = useEvents();
  const selectIncident = useSelectIncident();
  const setCurrentView = useSetCurrentView();
  
  const incidentEvents = events.filter(e => incident.eventIds.includes(e.id)).slice(0, 4);

  const handleOpenInvestigation = () => {
    selectIncident(incident.id);
    setCurrentView('Incidents');
  };

  return (
    <div style={{
      backgroundColor: 'rgba(254, 242, 242, 0.7)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '14px',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: 'var(--critical)' }} />

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--critical)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
          }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge bg-critical-light" style={{ textTransform: 'uppercase' }}>
                {incident.severity} PRIORITY
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {incident.id}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {incident.title}
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Calculated Risk
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--critical)', lineHeight: 1 }}>
              {incident.riskScore} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
          </div>

          <button
            onClick={handleOpenInvestigation}
            className="btn btn-primary"
            style={{ backgroundColor: 'var(--critical)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Investigate Incident <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <div>
          Target Account: <strong style={{ color: 'var(--text-primary)' }}>{incident.affectedUserId || 'Unknown'}</strong>
        </div>
        <div>
          Affected Systems: <strong style={{ color: 'var(--text-primary)' }}>{incident.affectedSystems.join(', ')}</strong>
        </div>
        <div>
          Correlated Signals: <strong style={{ color: 'var(--text-primary)' }}>{incident.eventIds.length} telemetry events</strong>
        </div>
      </div>

      {/* Mini Attack Chain Progression */}
      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--critical)', marginBottom: '0.6rem' }}>
          Correlated Signal Sequence
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
          {incidentEvents.map((evt, idx) => (
            <div key={evt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                backgroundColor: 'white',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
              }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>{evt.title}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {evt.system}
                </span>
              </div>
              {idx < incidentEvents.length - 1 && (
                <ArrowRight size={14} color="var(--critical)" />
              )}
            </div>
          ))}
          {incident.eventIds.length > 4 && (
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--critical)' }}>
              +{incident.eventIds.length - 4} more signals
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
