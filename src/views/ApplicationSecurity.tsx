import { useEvents, useCreateIncidentFromEvent, useSetCurrentView } from '../store/store';
import { DecisionBadge, deriveDecisionStatus } from '../components/security/DecisionBadge';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function ApplicationSecurity() {
  const events = useEvents();
  const createIncidentFromEvent = useCreateIncidentFromEvent();
  const setCurrentView = useSetCurrentView();

  const appEvents = events.filter(e => e.category === 'application' && (e.status === 'new' || e.status === 'acknowledged'));

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Application Security Monitoring
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
          Real-time API gateway telemetry, parameter tampering detection, and FHIR endpoint abuse monitoring.
        </p>
      </div>

      {/* Live application-security posture */}
      {appEvents.length > 0 ? (
        <div className="card network-glow" style={{ padding: '1.75rem', backgroundColor: 'white', borderLeft: '4px solid var(--critical)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <span className="badge bg-critical-light" style={{ marginBottom: '0.35rem' }}>APPLICATION ANOMALY DETECTED</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Synthetic API Endpoint Abuse
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {appEvents.length} active application-security signal{appEvents.length === 1 ? '' : 's'} in the shared telemetry stream.
              </div>
            </div>

            <button
              onClick={() => {
                if (appEvents[0]) createIncidentFromEvent(appEvents[0].id);
                else setCurrentView('Incidents');
              }}
              className="btn btn-outline"
              style={{ fontSize: '0.85rem' }}
            >
              Open Correlated Investigation <ArrowRight size={15} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-main)',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            fontSize: '0.825rem',
          }}>
            <div>Endpoint: <strong style={{ color: 'var(--text-primary)', display: 'block', marginTop: '2px' }}>{String(appEvents[0].metadata.endpoint || '/synthetic-api/patient-records')}</strong></div>
            <div>Source: <strong style={{ color: 'var(--text-primary)', display: 'block', marginTop: '2px' }}>{appEvents[0].actor || 'Synthetic client'}</strong></div>
            <div>Signal: <strong style={{ color: 'var(--critical)', display: 'block', marginTop: '2px' }}>{appEvents[0].eventType}</strong></div>
            <div>Risk contribution: <strong style={{ color: 'var(--critical)', display: 'block', marginTop: '2px' }}>-{appEvents[0].riskContribution}</strong></div>
          </div>
        </div>
      ) : (
        <div className="card network-glow" style={{ padding: '1.5rem', borderLeft: '4px solid var(--positive)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'var(--positive-bg)', color: 'var(--positive)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="badge bg-positive-light" style={{ marginBottom: '.3rem' }}>APPLICATION BASELINE NORMAL</div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>No active API abuse signals</h2>
              <p style={{ fontSize: '.78rem', color: 'var(--text-secondary)', marginTop: '.2rem' }}>
                The synthetic clinical API is currently quiet. Trigger the simulator to introduce a controlled application-security signal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Application Telemetry Events Table */}
      <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Clinical API Gateway Activity ({appEvents.length})
        </h3>

        {appEvents.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No anomalous application gateway probes detected.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {appEvents.map(e => (
              <div key={e.id} style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-main)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{e.title}</span>
                    <span className="badge bg-critical-light">{e.severity.toUpperCase()}</span>
                    <DecisionBadge status={deriveDecisionStatus(e)} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{e.description}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Endpoint: {String(e.metadata.endpoint || '/synthetic-api/patient-records')} • System: {e.system}
                  </div>
                </div>

                <button
                  onClick={() => createIncidentFromEvent(e.id)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
                >
                  View in Timeline <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
