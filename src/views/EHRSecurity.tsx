import { useState } from 'react';
import { 
  useEHRAccesses, 
  useEvents,
  usePatients, 
  useApproveBreakGlass, 
  useDeclineBreakGlass,
  useResolveSecurityEvent,
  useCreateIncidentFromEvent,
  useSetCurrentView 
} from '../store/store';
import { DecisionBadge } from '../components/security/DecisionBadge';
import ActionNoteModal from '../components/security/ActionNoteModal';
import { 
  Key, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

export default function EHRSecurity() {
  const ehrAccesses = useEHRAccesses();
  const events = useEvents();
  const patients = usePatients();
  const approveBreakGlass = useApproveBreakGlass();
  const declineBreakGlass = useDeclineBreakGlass();
  const resolveSecurityEvent = useResolveSecurityEvent();
  const createIncidentFromEvent = useCreateIncidentFromEvent();
  const setCurrentView = useSetCurrentView();

  const [activeTab, setActiveTab] = useState<'access_logs' | 'velocity' | 'break_glass' | 'patients'>('access_logs');
  const [approvalFeedback, setApprovalFeedback] = useState<string | null>(null);
  const [breakGlassReview, setBreakGlassReview] = useState<{ accessId: string; action: 'approve' | 'decline' } | null>(null);

  const breakGlassSessions = ehrAccesses.filter(a => a.isBreakGlass);
  const pendingBreakGlassSessions = breakGlassSessions.filter(a => a.breakGlassDecision === 'pending' || (!a.breakGlassApproved && a.breakGlassDecision !== 'declined'));
  const anomalousAccesses = ehrAccesses.filter(a => {
    if (!a.isAnomalous || a.isBreakGlass) return false;
    if (!a.relatedEventId) return true;
    return events.some(e => e.id === a.relatedEventId && (e.status === 'new' || e.status === 'acknowledged'));
  });
  const latestAnomaly = anomalousAccesses[0];


  const handleApproveBreakGlass = (accessId: string, note: string) => {
    approveBreakGlass(accessId, note || undefined);
    setBreakGlassReview(null);
    setApprovalFeedback(`Break-glass access for session ${accessId} officially approved and committed to the compliance audit ledger.`);
    setTimeout(() => setApprovalFeedback(null), 3500);
  };

  const handleDeclineBreakGlass = (accessId: string, note: string) => {
    declineBreakGlass(accessId, note || undefined);
    setBreakGlassReview(null);
    setApprovalFeedback(`Break-glass access for session ${accessId} was declined and recorded for compliance review.`);
    setTimeout(() => setApprovalFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            EHR Security & Clinical Sentry
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Protects electronic health records against bulk scraping, credential misuse, and undocumented clinical queries.
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          padding: '0.25rem',
          borderRadius: '8px',
          border: '1px solid var(--border)',
        }}>
          {[
            { id: 'access_logs', label: 'Access Logs' },
            { id: 'velocity', label: 'Bulk Access Velocity' },
            { id: 'break_glass', label: `Break-Glass${pendingBreakGlassSessions.length ? ` (${pendingBreakGlassSessions.length})` : ''}` },
            { id: 'patients', label: 'Synthetic Patients' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: activeTab === tab.id ? 'var(--bg-hover)' : 'transparent',
                borderRadius: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {approvalFeedback && (
        <div style={{
          padding: '0.75rem 1.25rem',
          backgroundColor: 'var(--positive-bg)',
          border: '1px solid var(--positive)',
          color: 'var(--positive)',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <CheckCircle2 size={16} /> {approvalFeedback}
        </div>
      )}

      {/* Live clinical-access posture */}
      {latestAnomaly ? (
        <div className="card network-glow" style={{ padding: '1.75rem', backgroundColor: 'white', borderLeft: '4px solid var(--critical)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <span className="badge bg-critical-light" style={{ marginBottom: '0.35rem' }}>
                ACCESS VELOCITY ANOMALY DETECTED
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--critical)' }}>
                Bulk Patient Chart Access Requires Review
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Latest synthetic anomaly: <strong>{latestAnomaly.doctorName}</strong> → {latestAnomaly.patientName} • {latestAnomaly.device}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    if (latestAnomaly?.relatedEventId) {
                      createIncidentFromEvent(latestAnomaly.relatedEventId);
                    } else {
                      setCurrentView('Incidents');
                    }
                  }}
                  className="btn btn-primary"
                  style={{ backgroundColor: 'var(--critical)', fontSize: '0.85rem' }}
                >
                  Open SOC Investigation <ArrowRight size={15} />
                </button>
                {latestAnomaly?.relatedEventId && (
                  <button
                    onClick={() => {
                      resolveSecurityEvent(
                        latestAnomaly.relatedEventId!,
                        'EHR anomaly reviewed',
                        'Synthetic clinical access anomaly reviewed by the SOC operator.'
                      );
                    }}
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem', borderColor: 'rgba(16,185,129,.4)', color: 'var(--positive)' }}
                  >
                    <CheckCircle2 size={15} /> Mark Reviewed
                  </button>
                )}
              </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            backgroundColor: 'var(--bg-main)',
            padding: '1.35rem',
            borderRadius: '12px',
            border: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Detection Reason
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--critical)', marginTop: '.25rem' }}>
                {latestAnomaly.patientName.includes('47') ? '47 records / 90 seconds' : 'Relationship anomaly'}
              </div>
              <div style={{ fontSize: '.78rem', color: 'var(--text-secondary)', marginTop: '.25rem' }}>
                {latestAnomaly.accessReason}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Policy Context
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '.25rem' }}>
                {latestAnomaly.relationship === 'Unrelated' ? 'Unrelated clinical relationship' : 'Review required'}
              </div>
              <div style={{ fontSize: '.78rem', color: 'var(--text-secondary)', marginTop: '.25rem' }}>
                CareSentinel records the evidence before an operator chooses a response.
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Active Synthetic Anomalies
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--critical)', marginTop: '.25rem' }}>
                {anomalousAccesses.length}
              </div>
              <div style={{ fontSize: '.78rem', color: 'var(--text-secondary)', marginTop: '.25rem' }}>
                Derived from the shared security event state.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card network-glow" style={{ padding: '1.5rem', borderLeft: '4px solid var(--positive)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'var(--positive-bg)', color: 'var(--positive)' }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="badge bg-positive-light" style={{ marginBottom: '.3rem' }}>CLINICAL ACCESS BASELINE NORMAL</div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>No active synthetic EHR anomalies</h2>
              <p style={{ fontSize: '.78rem', color: 'var(--text-secondary)', marginTop: '.2rem' }}>
                Break-glass access is reviewed separately from malicious EHR activity; pending sessions require an explicit approve or decline decision.
              </p>
            </div>
          </div>
        </div>
      )}

      <ActionNoteModal
        open={breakGlassReview !== null}
        title={breakGlassReview?.action === 'approve' ? 'Approve emergency break-glass access' : 'Decline emergency break-glass access'}
        description="Record the clinical compliance decision. The optional note is written to the synthetic audit ledger."
        actionLabel={breakGlassReview?.action === 'approve' ? 'Authenticate & Approve' : 'Decline / Reject'}
        actionTone={breakGlassReview?.action === 'approve' ? 'primary' : 'danger'}
        onCancel={() => setBreakGlassReview(null)}
        onConfirm={(note) => {
          if (!breakGlassReview) return;
          if (breakGlassReview.action === 'approve') handleApproveBreakGlass(breakGlassReview.accessId, note);
          else handleDeclineBreakGlass(breakGlassReview.accessId, note);
        }}
      />

      {/* TAB CONTENT */}
      {activeTab === 'access_logs' && (
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'white' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Clinical Access Telemetry Log
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Doctor</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Patient</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Department</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Relationship</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Device</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Access Reason</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Risk Status</th>
                </tr>
              </thead>
              <tbody>
                {ehrAccesses.map(acc => (
                  <tr key={acc.id} style={{ borderBottom: '1px solid var(--border)', backgroundColor: acc.isAnomalous && !acc.isBreakGlass ? 'rgba(254, 242, 242, 0.4)' : 'transparent' }}>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                      {new Date(acc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {acc.doctorName}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)' }}>
                      {acc.patientName}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                      {acc.department}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${acc.relationship === 'Unrelated' ? 'bg-critical-light' : acc.relationship === 'Emergency Break-Glass' ? 'bg-warning-light' : 'bg-positive-light'}`}>
                        {acc.relationship}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {acc.device}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                      {acc.accessReason}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${acc.risk === 'critical' ? 'bg-critical-light' : acc.risk === 'medium' ? 'bg-warning-light' : 'bg-positive-light'}`}>
                        {acc.risk.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 26: BREAK-GLASS ACCESS WORKFLOW */}
      {activeTab === 'break_glass' && (
        <div className="card" style={{ padding: '2rem', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: 'var(--warning-bg)', padding: '0.6rem', borderRadius: '8px', color: 'var(--warning)' }}>
              <Key size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Emergency Break-Glass Protocol Verification
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                Emergency medical exceptions bypass standard access boundaries. CareSentinel documents clinical context without false-positive lockouts.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {breakGlassSessions.map(session => (
              <div key={session.id} style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1.5rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.35rem' }}>
                      <DecisionBadge status={session.breakGlassDecision === 'approved' ? 'approved' : session.breakGlassDecision === 'declined' ? 'declined' : 'pending'} />
                      <span className="badge bg-warning-light">
                        {session.breakGlassDecision === 'approved' ? 'BREAK-GLASS VERIFIED' : session.breakGlassDecision === 'declined' ? 'BREAK-GLASS REJECTED' : 'BREAK-GLASS PENDING REVIEW'}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Emergency Access: {session.doctorName} &rarr; {session.patientName}
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Session ID: {session.id} • Terminal: {session.device} • Timestamp: {new Date(session.timestamp).toLocaleString()}
                    </div>
                  </div>

                  {session.breakGlassDecision !== 'approved' && session.breakGlassDecision !== 'declined' && (
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setBreakGlassReview({ accessId: session.id, action: 'approve' })}
                        className="btn btn-primary"
                        style={{ fontSize: '0.825rem', padding: '0.45rem 1rem', backgroundColor: 'var(--positive)' }}
                      >
                        <CheckCircle2 size={15} /> Authenticate & Approve
                      </button>
                      <button
                        onClick={() => setBreakGlassReview({ accessId: session.id, action: 'decline' })}
                        className="btn btn-outline"
                        style={{ fontSize: '0.825rem', padding: '0.45rem 1rem', borderColor: 'rgba(239,68,68,.4)', color: 'var(--critical)' }}
                      >
                        Decline / Reject
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ padding: '0.85rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <strong>Documented Emergency Reason:</strong> "{session.accessReason}"
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong>CareSentinel Policy Evaluation:</strong> Unusual cross-department access detected, but emergency trauma context is charted. The system records the access in the immutable audit ledger while allowing uninterrupted medical care.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SYNTHETIC PATIENT RECORDS */}
      {activeTab === 'patients' && (
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'white' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Northstar Medical Center Synthetic Patient Roster ({patients.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {patients.map(p => (
              <div key={p.id} style={{
                padding: '1.25rem',
                backgroundColor: 'var(--bg-main)',
                borderRadius: '10px',
                border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{p.mrn}</span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</h4>
                  </div>
                  {p.vip && <span className="badge bg-critical-light">VIP RECORD</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div>Department: <strong>{p.department}</strong> ({p.room})</div>
                  <div>Attending Physician: <strong>{p.primaryPhysician}</strong></div>
                  <div>Condition: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.condition}</span></div>
                  <div>Demographics: {p.age} y/o {p.gender}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'velocity' && (
        <div className="card" style={{ padding: '2rem', backgroundColor: 'white' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Clinical Access Velocity Telemetry
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Query velocity tripwires continuously measure record requests per rolling 90-second and 30-minute intervals.
          </p>

          <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', gap: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '40px', height: '20%', backgroundColor: 'var(--positive)', borderRadius: '4px 4px 0 0' }}></div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>Baseline (5/30m)</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '40px', height: '94%', backgroundColor: 'var(--critical)', borderRadius: '4px 4px 0 0' }}></div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--critical)', marginTop: '0.5rem' }}>Tripwire (47/90s)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
