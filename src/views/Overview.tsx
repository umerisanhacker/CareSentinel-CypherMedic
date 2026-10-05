import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  Activity, 
  Network, 
  ArrowRight,
  HeartPulse
} from 'lucide-react';
import { useEvents, useIncidents, usePosture, useSetCurrentView } from '../store/store';
import { selectRecentEvents } from '../store/selectors';
import MetricCard from '../components/dashboard/MetricCard';
import ThreatChart from '../components/dashboard/ThreatChart';
import SecurityPosture from '../components/dashboard/SecurityPosture';
import CriticalIncident from '../components/dashboard/CriticalIncident';
import RecentEvents from '../components/dashboard/RecentEvents';
import AttackChainOverview from '../components/dashboard/AttackChainOverview';

export default function Overview() {
  const events = useEvents();
  const incidents = useIncidents();
  const posture = usePosture();
  const setCurrentView = useSetCurrentView();

  const activeIncidents = incidents.filter(i => i.status === 'active' || i.status === 'investigating');
  const alertCount = events.filter(e => e.status === 'new').length;
  const activeTelemetry = events.filter(e => e.status === 'new' || e.status === 'acknowledged');
  const identityCount = activeTelemetry.filter(e => e.category === 'identity').length;
  const ehrAnomaliesCount = activeTelemetry.filter(e => e.category === 'ehr' && e.metadata.breakGlassApproved !== true && (e.eventType === 'EHR_ACCESS' || e.eventType === 'EHR_BULK_ACCESS')).length;
  const networkEventsCount = activeTelemetry.filter(e => e.category === 'network').length;

  const criticalIncident = incidents.find(i => i.severity === 'critical' && i.status !== 'resolved');
  const recentEvents = selectRecentEvents(events, 6);

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Security Overview
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Clinical security posture across the synthetic hospital environment (Northstar Medical Center).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setCurrentView('Attack Simulator')}
            className="btn btn-outline"
            style={{ color: 'var(--critical)', borderColor: 'rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.04)' }}
          >
            <AlertTriangle size={15} /> Attack Simulator
          </button>
          <button
            onClick={() => setCurrentView('Incidents')}
            className="btn btn-primary"
          >
            All Incidents ({activeIncidents.length}) <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Critical Incident Banner or Baseline Normal Banner */}
      {criticalIncident ? (
        <CriticalIncident incident={criticalIncident} />
      ) : (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: 'var(--positive-bg)',
              color: 'var(--positive)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge bg-positive-light">BASELINE NORMAL</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Synthetic Northstar Medical Center
                </span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                Zero Active Critical Incidents — Security Posture: {posture.score}/100 ({posture.label})
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('Attack Simulator')}
            className="btn btn-outline"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            Launch Attack Simulator <ArrowRight size={14} />
          </button>
        </div>
      )}

      <div className="card" style={{ padding: '1.35rem', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: 'var(--accent-primary)', fontSize: '.7rem', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '.05em' }}>
              <ShieldCheck size={15} /> Decision Intelligence
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 850, marginTop: '.25rem' }}>Security response is evaluated against clinical impact</h2>
            <p style={{ fontSize: '.78rem', color: 'var(--text-secondary)', marginTop: '.3rem', maxWidth: 760, lineHeight: 1.5 }}>
              CareSentinel separates the question “Is this malicious?” from the question “What is the safest response?” so a high cyber-risk signal does not automatically become a high patient-safety action.
            </p>
          </div>
          <button onClick={() => setCurrentView('Devices')} className="btn btn-outline" style={{ fontSize: '.75rem' }}>
            <HeartPulse size={14} /> Clinical Assets <ArrowRight size={14} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '.7rem', marginTop: '1rem' }}>
          {[
            ['Cyber signals', activeTelemetry.length, 'var(--critical)'],
            ['Identity', identityCount, 'var(--accent-primary)'],
            ['Network', networkEventsCount, 'var(--warning)'],
            ['EHR', ehrAnomaliesCount, 'var(--accent-secondary)'],
          ].map(([label, value, tone]) => (
            <div key={String(label)} style={{ padding: '.8rem', borderRadius: 9, background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '.66rem', color: 'var(--text-muted)', fontWeight: 750, textTransform: 'uppercase' }}>{label}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 850, color: String(tone), marginTop: '.15rem' }}>{String(value)}</div>
            </div>
          ))}
          <div style={{ padding: '.8rem', borderRadius: 9, background: '#f8fbff', border: '1px solid #dbeafe' }}>
            <div style={{ fontSize: '.66rem', color: 'var(--text-muted)', fontWeight: 750, textTransform: 'uppercase' }}>Response principle</div>
            <div style={{ fontSize: '.78rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '.25rem' }}>Preserve care · contain threat</div>
          </div>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid-metrics">
        <div onClick={() => setCurrentView('Incidents')} style={{ cursor: 'pointer' }}>
          <MetricCard
            title="ACTIVE INCIDENTS"
            value={activeIncidents.length}
            trend={activeIncidents.length === 0 ? "Baseline stable" : `${activeIncidents.length} active now`}
            trendUp={activeIncidents.length > 0}
            icon={<ShieldAlert className="h-6 w-6 text-[var(--critical)]" />}
          />
        </div>

        <div onClick={() => setCurrentView('Overview')} style={{ cursor: 'pointer' }}>
          <MetricCard
            title="SECURITY ALERTS"
            value={alertCount}
            trend={alertCount === 0 ? "No active alerts" : `${alertCount} active now`}
            trendUp={alertCount > 0}
            icon={<AlertTriangle className="h-6 w-6 text-[var(--warning)]" />}
          />
        </div>

        <div onClick={() => setCurrentView('Overview')} style={{ cursor: 'pointer' }}>
          <MetricCard
            title="RISK POSTURE"
            value={`${posture.score}/100`}
            trend={posture.score >= 90 ? "Protected baseline" : `${posture.label} · review needed`}
            trendUp={posture.score < 80}
            icon={<ShieldCheck className="h-6 w-6 text-[var(--positive)]" />}
          />
        </div>

        <div onClick={() => setCurrentView('Identity')} style={{ cursor: 'pointer' }}>
          <MetricCard
            title="IDENTITY ANOMALIES"
            value={identityCount}
            trend={identityCount === 0 ? "No active anomalies" : `${identityCount} active anomal${identityCount === 1 ? "y" : "ies"}`}
            trendUp={identityCount > 0}
            icon={<Users className="h-6 w-6 text-[var(--accent-primary)]" />}
          />
        </div>

        <div onClick={() => setCurrentView('EHR Security')} style={{ cursor: 'pointer' }}>
          <MetricCard
            title="EHR ANOMALIES"
            value={ehrAnomaliesCount}
            trend={ehrAnomaliesCount === 0 ? "No active anomalies" : `${ehrAnomaliesCount} active anomaly${ehrAnomaliesCount === 1 ? "" : "ies"}`}
            trendUp={ehrAnomaliesCount > 0}
            icon={<Activity className="h-6 w-6 text-[var(--critical)]" />}
          />
        </div>

        <div onClick={() => setCurrentView('Network')} style={{ cursor: 'pointer' }}>
          <MetricCard
            title="NETWORK EVENTS"
            value={networkEventsCount}
            trend={networkEventsCount === 0 ? "Baseline quiet" : `${networkEventsCount} detected event${networkEventsCount === 1 ? "" : "s"}`}
            trendUp={networkEventsCount > 0}
            icon={<Network className="h-6 w-6 text-[var(--accent-secondary)]" />}
          />
        </div>
      </div>

      {/* Multi-vector attack chain */}
      <AttackChainOverview events={events} incidentActive={Boolean(criticalIncident)} />

      {/* Main Grid: Threat Chart & Security Posture */}
      <div className="grid-main">
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'white' }}>
          <ThreatChart events={events} />
        </div>

        <div>
          <SecurityPosture posture={posture} />
        </div>
      </div>

      {/* Live Security Activity Stream */}
      <div>
        <RecentEvents events={recentEvents} />
      </div>
    </div>
  );
}
