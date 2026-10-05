import { Mail, Link2, KeyRound, Network, ShieldAlert, Activity, DatabaseZap, Siren, ArrowRight } from 'lucide-react';
import type { SecurityEvent } from '../../store/types';

interface Props { events: SecurityEvent[]; incidentActive: boolean; }

const stages = [
  { label: 'Phishing', type: 'PHISHING_DETECTED', icon: Mail, color: 'var(--warning)' },
  { label: 'Malicious Link', type: 'SUSPICIOUS_LINK', icon: Link2, color: 'var(--critical)' },
  { label: 'Credential', type: 'CREDENTIAL_COMPROMISE', icon: KeyRound, color: 'var(--critical)' },
  { label: 'Network', type: 'PORT_SCAN', icon: Network, color: 'var(--accent-secondary)' },
  { label: 'Authentication', type: 'UNUSUAL_LOGIN', icon: ShieldAlert, color: 'var(--warning)' },
  { label: 'Application', type: 'APP_PROBE', icon: Activity, color: 'var(--accent-primary)' },
  { label: 'EHR Access', type: 'EHR_BULK_ACCESS', icon: DatabaseZap, color: 'var(--critical)' },
  { label: 'Incident', type: 'INCIDENT_CREATED', icon: Siren, color: 'var(--critical)' },
] as const;

export default function AttackChainOverview({ events, incidentActive }: Props) {
  const isStageActive = (type: string) => {
    if (type === 'INCIDENT_CREATED') return incidentActive;
    return events.some(e => e.eventType === type && e.status !== 'resolved' && e.status !== 'false_positive');
  };
  const activeCount = stages.filter(s => isStageActive(s.type)).length;

  return (
    <section className="card network-glow" style={{ padding: '1.35rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.15rem' }}>
        <div>
          <div style={{ fontSize: '.68rem', fontWeight: 800, letterSpacing: '.11em', textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '.35rem' }}>
            Multi-Vector Correlation
          </div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Attack Chain Intelligence</h2>
          <p style={{ fontSize: '.78rem', color: 'var(--text-secondary)', marginTop: '.25rem' }}>
            One shared telemetry stream across email, identity, network, application and clinical access.
          </p>
        </div>
        <div className="badge bg-accent-light" style={{ padding: '.42rem .7rem' }}>{activeCount}/8 signals active</div>
      </div>

      <div className="attack-chain-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(95px, 1fr))', gap: '.45rem', alignItems: 'stretch' }}>
        {stages.map((stage, index) => {
          const active = isStageActive(stage.type);
          const Icon = stage.icon;
          return (
            <div key={stage.label} style={{ position: 'relative', minWidth: 0 }}>
              <div className={active ? 'live-line' : ''} style={{ height: '100%', minHeight: '86px', padding: '.7rem .55rem', borderRadius: '12px', border: active ? `1px solid ${stage.color}44` : '1px solid var(--border)', background: active ? `linear-gradient(180deg, ${stage.color}12, white)` : 'var(--bg-tertiary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '.4rem', transition: 'all .25s ease', boxShadow: active ? `0 8px 22px ${stage.color}12` : 'none' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '9px', display: 'grid', placeItems: 'center', background: active ? stage.color : 'white', color: active ? 'white' : 'var(--text-muted)', border: active ? 'none' : '1px solid var(--border)' }}>
                  <Icon size={15} />
                </div>
                <span style={{ fontSize: '.68rem', lineHeight: 1.15, fontWeight: active ? 750 : 600, color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{stage.label}</span>
                <span style={{ fontSize: '.58rem', fontWeight: 750, color: active ? stage.color : 'var(--text-muted)', textTransform: 'uppercase' }}>{active ? 'Detected' : 'Standby'}</span>
              </div>
              {index < stages.length - 1 && <ArrowRight size={12} color={active ? stage.color : '#b9c7d2'} style={{ position: 'absolute', right: '-9px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '1rem', paddingTop: '.8rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', fontSize: '.72rem', color: 'var(--text-secondary)' }}>
        <span><strong>Detection:</strong> deterministic rules</span>
        <span><strong>Correlation:</strong> shared user/system context</span>
        <span><strong>Environment:</strong> synthetic Northstar Medical Center</span>
      </div>
    </section>
  );
}