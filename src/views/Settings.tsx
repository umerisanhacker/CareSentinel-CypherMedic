import { useState } from 'react';
import { Bell, Shield, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useResetDemo } from '../store/store';

export default function Settings() {
  const resetDemo = useResetDemo();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [linkGuardStrict, setLinkGuardStrict] = useState(true);
  const [velocitySensitivity, setVelocitySensitivity] = useState<'high' | 'medium'>('high');
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const handleReset = () => {
    resetDemo();
    setSavedFeedback('Demo environment reset to initial synthetic baseline state.');
    setTimeout(() => setSavedFeedback(null), 3500);
  };

  const handleSave = () => {
    setSavedFeedback('Security preferences updated successfully.');
    setTimeout(() => setSavedFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Platform Settings & Governance
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
          Configure automated clinical tripwires, notification routing, and synthetic hospital demo parameters.
        </p>
      </div>

      {savedFeedback && (
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
          <CheckCircle2 size={16} /> {savedFeedback}
        </div>
      )}

      {/* Notifications */}
      <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          <Bell size={20} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Notification & Incident Routing
          </h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Real-time Critical Incident Push
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Immediately alert SOC operators when multi-vector correlation synthesizes critical threats
            </div>
          </div>
          <input
            type="checkbox"
            checked={emailAlerts}
            onChange={(e) => setEmailAlerts(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Automated Protection Preferences */}
      <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          <Shield size={20} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Automated Clinical Defenses
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                Auto-Quarantine High-Risk Inbound Emails
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Automatically quarantine messages failing look-alike domain heuristics and synthetic DMARC
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoQuarantine}
              onChange={(e) => setAutoQuarantine(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                Strict LinkGuard Safe-Proxy Wrapping
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Intercept all external URLs and analyze domain entropy prior to physician click resolution
              </div>
            </div>
            <input
              type="checkbox"
              checked={linkGuardStrict}
              onChange={(e) => setLinkGuardStrict(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                EHR Access Velocity Threshold
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Tripwire sensitivity for bulk patient chart enumeration detection
              </div>
            </div>
            <select
              value={velocitySensitivity}
              onChange={(e) => setVelocitySensitivity(e.target.value as any)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-main)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              <option value="high">High (&gt;5 charts / 30m)</option>
              <option value="medium">Medium (&gt;15 charts / 30m)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Demo State Control (Reset) */}
      <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <RotateCcw size={20} color="var(--warning)" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Reset Demonstration Environment
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          Restores all simulated doctor accounts, patient records, email items, incident timelines, and security posture scores back to the default synthetic baseline.
        </p>

        <button
          onClick={handleReset}
          className="btn btn-outline"
          style={{ borderColor: 'rgba(245, 158, 11, 0.5)', color: 'var(--warning)', fontSize: '0.85rem' }}
        >
          <RotateCcw size={15} /> Reset Demo State to Initial Data
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button onClick={handleSave} className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
          Save Preferences
        </button>
      </div>
    </div>
  );
}
