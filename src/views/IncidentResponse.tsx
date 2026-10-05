import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, ShieldAlert, UsersRound, Activity } from 'lucide-react';
import { useIncidents, useSetCurrentView, useSelectIncident } from '../store/store';

export default function IncidentResponse() {
  const incidents = useIncidents();
  const setCurrentView = useSetCurrentView();
  const selectIncident = useSelectIncident();

  const responseQueue = incidents.filter(i => i.status === 'escalated' || i.status === 'contained' || (i.severity === 'critical' && i.status !== 'resolved'));
  const active = responseQueue.filter(i => i.status !== 'resolved');
  const contained = incidents.filter(i => i.status === 'contained');
  const critical = responseQueue.filter(i => i.severity === 'critical');

  const openIncident = (id: string) => {
    selectIncident(id);
    setCurrentView('Incidents');
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.45rem', padding: '.3rem .65rem', borderRadius: '999px', background: '#f3e8ff', color: '#7c3aed', fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
            <UsersRound size={13} /> Incident Response Workspace
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '.55rem' }}>
            Incident Response Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '.92rem', marginTop: '.25rem', maxWidth: '760px' }}>
            Coordinate major-incident containment, recovery, evidence preservation and handoff from the SOC.
          </p>
        </div>
        <button className="btn btn-outline" onClick={() => setCurrentView('Incidents')}>
          <ArrowRight size={15} /> Open SOC Incident Queue
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Response Queue', value: active.length, icon: ShieldAlert, tone: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Critical Incidents', value: critical.length, icon: AlertTriangle, tone: 'var(--critical)', bg: 'var(--critical-bg)' },
          { label: 'Contained', value: contained.length, icon: CheckCircle2, tone: 'var(--positive)', bg: 'var(--positive-bg)' },
          { label: 'Team On Duty', value: 4, icon: UsersRound, tone: 'var(--accent-primary)', bg: 'var(--accent-light)' },
        ].map(item => (
          <div key={item.label} className="card" style={{ padding: '1.2rem', borderTop: `3px solid ${item.tone}`, background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{item.label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: item.tone, marginTop: '.25rem' }}>{item.value}</div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: item.bg, color: item.tone, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <item.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.65fr) minmax(300px, .85fr)', gap: '1.25rem', alignItems: 'start' }}>
        <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Response Queue</h2>
              <p style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>Incidents requiring IR coordination or containment follow-through.</p>
            </div>
            <span className="badge" style={{ background: '#f3e8ff', color: '#7c3aed' }}>{active.length} ACTIVE</span>
          </div>

          {responseQueue.length === 0 ? (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '10px' }}>
              <CheckCircle2 size={32} color="var(--positive)" style={{ margin: '0 auto .65rem' }} />
              <strong>No incidents awaiting IR action</strong>
              <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: '.25rem' }}>The response queue is clear.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
              {responseQueue.map(incident => (
                <button key={incident.id} onClick={() => openIncident(incident.id)} style={{
                  width: '100%', textAlign: 'left', padding: '1rem', border: '1px solid var(--border)', borderRadius: '10px',
                  background: 'var(--bg-main)', cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap' }}>
                      <span className={`badge ${incident.severity === 'critical' ? 'bg-critical-light' : 'bg-warning-light'}`}>{incident.severity.toUpperCase()}</span>
                      <span className="badge bg-accent-light">{incident.status.toUpperCase()}</span>
                      <span style={{ fontSize: '.7rem', color: 'var(--text-muted)' }}>{incident.id}</span>
                    </div>
                    <div style={{ fontWeight: 750, fontSize: '.9rem', color: 'var(--text-primary)', marginTop: '.45rem' }}>{incident.title}</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--text-secondary)', marginTop: '.25rem' }}>
                      Affected account: <strong>{incident.affectedUserId || 'Unknown'}</strong> · {incident.eventIds.length} correlated signal(s)
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Risk</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: incident.riskScore >= 80 ? 'var(--critical)' : 'var(--warning)' }}>{incident.riskScore}/100</div>
                    <ArrowRight size={15} color="var(--text-muted)" style={{ marginTop: '.35rem' }} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1.4rem', background: 'white' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '.9rem' }}>IR Team On Duty</h2>
            {[
              ['Incident Commander', 'A. Menon'],
              ['IR Lead', 'R. Thomas'],
              ['IAM / Identity', 'S. Nair'],
              ['Network Security', 'K. Joseph'],
            ].map(([role, name]) => (
              <div key={role} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.65rem 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '.78rem', fontWeight: 750 }}>{role}</div>
                  <div style={{ fontSize: '.7rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>{name}</div>
                </div>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--positive)' }} />
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '1.4rem', background: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.8rem' }}>
              <Activity size={17} color="#7c3aed" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Response Lifecycle</h2>
            </div>
            {['Declare major incident', 'Contain affected assets', 'Preserve evidence', 'Eradicate persistence', 'Validate recovery', 'Close & audit'].map((step, index) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '.65rem', padding: '.48rem 0', fontSize: '.76rem', color: index === 0 && active.length ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: index === 0 && active.length ? '#ede9fe' : 'var(--bg-main)', color: index === 0 && active.length ? '#7c3aed' : 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{index + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem 1.5rem', background: '#faf5ff', borderColor: '#ddd6fe' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
          <Clock3 size={17} color="#7c3aed" />
          <div>
            <strong style={{ fontSize: '.82rem' }}>Synthetic response environment</strong>
            <div style={{ fontSize: '.74rem', color: 'var(--text-secondary)', marginTop: '.15rem' }}>
              All containment actions are simulated in-memory actions for the Northstar Medical Center demo environment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
