import { useState } from 'react';
import { DecisionBadge, deriveDecisionStatus } from '../components/security/DecisionBadge';
import ActionNoteModal from '../components/security/ActionNoteModal';
import { 
  useUsers, 
  useDevices, 
  useEvents, 
  useFlagUser, 
  useSetCurrentView,
  useCreateIncidentFromEvent
} from '../store/store';
import { 
  Users, 
  UserCheck, 
  UserX, 
  ShieldAlert, 
  HardDrive, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import type { SimulatedUser } from '../store/types';

export default function Identity() {
  const users = useUsers();
  const devices = useDevices();
  const events = useEvents();
  const flagUser = useFlagUser();
  const setCurrentView = useSetCurrentView();
  const createIncidentFromEvent = useCreateIncidentFromEvent();

  const [selectedUser, setSelectedUser] = useState<SimulatedUser>(users[0]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showFlagReview, setShowFlagReview] = useState(false);

  const identityEvents = events.filter(e => e.category === 'identity');
  const activeIdentityEvents = identityEvents.filter(e => e.status === 'new' || e.status === 'acknowledged');
  const userEvents = identityEvents.filter(e => e.userId === selectedUser.id && (e.status === 'new' || e.status === 'acknowledged'));
  const latestActiveUserEvent = [...userEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  const handleFlagAccount = (userId: string, note: string) => {
    flagUser(userId, note || undefined);
    setShowFlagReview(false);
    setFeedback(`Account ${userId} flagged for mandatory credential reset & token revocation.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Identity & Access Sentry
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
          Behavioral anomaly detection across clinical shifts, workstation hardware, and single sign-on telemetry.
        </p>
      </div>

      {feedback && (
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
          <CheckCircle2 size={16} /> {feedback}
        </div>
      )}

      {/* 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.25rem', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monitored Clinicians</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{users.length}</div>
            </div>
            <div style={{ padding: '0.6rem', backgroundColor: 'var(--accent-light)', borderRadius: '8px', color: 'var(--accent-primary)' }}>
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Identity Anomalies</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: identityEvents.length > 0 ? 'var(--critical)' : 'var(--positive)', marginTop: '0.2rem' }}>{activeIdentityEvents.length}</div>
            </div>
            <div style={{ padding: '0.6rem', backgroundColor: 'var(--critical-bg)', borderRadius: '8px', color: 'var(--critical)' }}>
              <AlertTriangle size={22} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clinical Hardware Clients</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{devices.length}</div>
            </div>
            <div style={{ padding: '0.6rem', backgroundColor: 'rgba(13, 148, 136, 0.1)', borderRadius: '8px', color: 'var(--accent-secondary)' }}>
              <HardDrive size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Left User List, Right User Detail & Working Window Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Clinician Directory */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'white' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Hospital Clinician Directory
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {users.map(u => {
              const active = selectedUser.id === u.id;
              const hasAlerts = activeIdentityEvents.some(e => e.userId === u.id);
              return (
                <button
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    border: active ? '1.5px solid var(--accent-primary)' : '1px solid var(--border)',
                    backgroundColor: active ? 'rgba(2, 132, 199, 0.05)' : 'var(--bg-main)',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      backgroundColor: 'white',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      border: '1px solid var(--border)',
                      color: hasAlerts ? 'var(--critical)' : 'var(--positive)',
                    }}>
                      {hasAlerts ? <UserX size={18} /> : <UserCheck size={18} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {u.role} • {u.department}
                      </div>
                    </div>
                  </div>

                  <DecisionBadge status={u.status === 'flagged'
                    ? (activeIdentityEvents.find(e => e.userId === u.id) ? 'pending' : 'reviewed')
                    : hasAlerts
                      ? 'pending'
                      : 'allowed'
                  } />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Clinician Deep Behavioral Inspection */}
        <div className="card" style={{ padding: '2rem', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <span className={`badge ${selectedUser.status === 'flagged' ? 'bg-critical-light' : userEvents.length > 0 ? 'bg-warning-light' : 'bg-positive-light'}`}>
                  {selectedUser.status === 'flagged' ? 'CREDENTIAL RESET ENFORCED' : userEvents.length > 0 ? 'IDENTITY ANOMALIES' : 'CREDENTIALS CLEAN'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedUser.id}</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {selectedUser.name}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {selectedUser.role} • Department of {selectedUser.department}
              </div>
            </div>

            {selectedUser.status !== 'flagged' ? (
              <button
                onClick={() => setShowFlagReview(true)}
                className="btn btn-danger"
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
              >
                <ShieldAlert size={15} /> Flag & Revoke Tokens
              </button>
            ) : (
              <span className="badge bg-critical-light" style={{ padding: '0.4rem 0.8rem' }}>
                ACCOUNT FLAGGED
              </span>
            )}
          </div>

          <ActionNoteModal
            open={showFlagReview}
            title={`Review identity anomaly — ${selectedUser.name}`}
            description="Confirm the account response. The optional note is written to the synthetic audit ledger so the next analyst can understand why the token revocation was performed."
            actionLabel="Flag & Revoke Tokens"
            actionTone="danger"
            onCancel={() => setShowFlagReview(false)}
            onConfirm={(note) => handleFlagAccount(selectedUser.id, note)}
          />

          {/* Normal vs. Anomalous Baseline Comparison (Section 21 requirement) */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Baseline Working Window Comparison
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {/* Normal Baseline */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--positive)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={16} /> Expected Clinical Baseline
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div>Shift Window: <strong>{selectedUser.normalHours}</strong></div>
                  <div>Assigned Station: <strong>{selectedUser.workstation}</strong></div>
                  <div>Network Context: <strong>Hospital Internal VLAN 5</strong></div>
                  <div>Status: <strong>Normal Attending Workflow</strong></div>
                </div>
              </div>

              {/* Observed Telemetry */}
              <div style={{ padding: '1rem', backgroundColor: userEvents.length > 0 ? 'var(--critical-bg)' : 'var(--bg-main)', borderRadius: '8px', border: userEvents.length > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: userEvents.length > 0 ? 'var(--critical)' : 'var(--positive)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  {userEvents.length > 0 ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                  {userEvents.length > 0 ? 'Observed Anomalous Session' : 'Observed Session Normal'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div>Login Timestamp: <strong>{userEvents.length > 0 ? '03:17 (Outside Window)' : '08:42 (On Shift)'}</strong></div>
                  <div>Originating Device: <strong>{userEvents.length > 0 ? 'Unknown Rogue Client (dev-003)' : selectedUser.workstation}</strong></div>
                  <div>Network IP: <strong>{userEvents.length > 0 ? '192.168.1.100 (External VPN)' : '10.0.5.42 (Internal)'}</strong></div>
                  <div>Telemetry Result: <strong style={{ color: userEvents.length > 0 ? 'var(--critical)' : 'var(--positive)' }}>{userEvents.length > 0 ? 'HIGH RISK' : 'LOW RISK'}</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Factors */}
          {userEvents.length > 0 && (
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              marginBottom: '1.5rem',
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Why this identity anomaly was flagged:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <li>⚠ <strong>Outside expected working window:</strong> Session opened at 03:17 vs. 07:00–17:00 shift schedule.</li>
                <li>⚠ <strong>Unknown hardware device:</strong> Unregistered MAC and fingerprint not present in hospital asset ledger.</li>
                <li>⚠ <strong>New network context:</strong> Ingress routed from external VPN gateway rather than clinical ward Ethernet.</li>
                <li>⚠ <strong>Subsequent behavioral tripwire:</strong> Immediately preceded cross-department bulk patient query.</li>
              </ul>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                * Geolocation and IP contexts are synthetic demo telemetry.
              </div>
            </div>
          )}

          {/* Associated Incidents button */}
          {userEvents.length > 0 && (
            <button
              onClick={() => {
                if (latestActiveUserEvent) {
                  createIncidentFromEvent(latestActiveUserEvent.id);
                } else {
                  setCurrentView('Incidents');
                }
              }}
              className="btn btn-outline"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              Open in SOC Investigation Workspace <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
