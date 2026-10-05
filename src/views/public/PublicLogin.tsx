import { useState } from 'react';
import { Shield, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSetAppMode, useSetCurrentView, useSetPublicPage } from '../../store/store';

export function PublicLogin() {
  const setAppMode = useSetAppMode();
  const setCurrentView = useSetCurrentView();
  const setPublicPage = useSetPublicPage();

  const [selectedRole, setSelectedRole] = useState<'soc_analyst' | 'ciso' | 'dr_sarah'>('soc_analyst');
  const [userId, setUserId] = useState('soc.lead@northstar-med.org');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberDevice, setRememberDevice] = useState(true);

  const demoAccounts = [
    {
      id: 'soc_analyst',
      name: 'SOC Lead Analyst',
      email: 'soc.lead@northstar-med.org',
      role: 'Clinical Security Operations Center',
      access: 'Full Incident Triage & Attack Simulator'
    },
    {
      id: 'dr_sarah',
      name: 'Dr. Sarah Wilson',
      email: 'sarah.wilson@northstar-med.org',
      role: 'Attending Physician (Cardiology)',
      access: 'Targeted Clinical Account Telemetry'
    },
    {
      id: 'ciso',
      name: 'Chief Information Security Officer',
      email: 'ciso@northstar-med.org',
      role: 'Hospital Executive & Compliance',
      access: 'Risk Posture & Audit Governance'
    },
  ];

  const handleSelectRole = (acc: typeof demoAccounts[0]) => {
    setSelectedRole(acc.id as any);
    setUserId(acc.email);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAppMode('console');
    setCurrentView('Overview');
  };

  return (
    <div className="animate-fade-in" style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      background: 'linear-gradient(180deg, #f8fafc 0%, #eef4f9 100%)',
    }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        {/* Hospital Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
            marginBottom: '1rem',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
          }}>
            <Shield size={30} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            CARESENTINEL
          </h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.2rem' }}>
            Clinical Security Intelligence • Northstar Medical Center
          </div>
        </div>

        {/* Login Card */}
        <div className="card" style={{ padding: '2.25rem', boxShadow: 'var(--shadow-lg)', backgroundColor: 'white', borderRadius: '16px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Clinical Security Single Sign-On
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Authenticate with your Northstar Active Directory or select a demo account:
            </p>
          </div>

          {/* Quick Demo Account Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.75rem' }}>
            {demoAccounts.map(acc => {
              const active = selectedRole === acc.id;
              return (
                <button
                  type="button"
                  key={acc.id}
                  onClick={() => handleSelectRole(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: active ? '1.5px solid var(--accent-primary)' : '1px solid var(--border)',
                    backgroundColor: active ? 'rgba(2, 132, 199, 0.05)' : 'var(--bg-main)',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {acc.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {acc.email} • {acc.role}
                    </div>
                  </div>
                  {active && <CheckCircle2 size={16} color="var(--accent-primary)" />}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Email / User ID
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                />
                Remember this clinical workstation
              </label>
              <span style={{ color: 'var(--accent-primary)', cursor: 'pointer' }}>FIDO2 / Smartcard</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                marginTop: '0.5rem',
              }}
            >
              Sign In to Security Console <ArrowRight size={16} />
            </button>
          </form>

          {/* Synthetic Demo Disclaimer */}
          <div style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Synthetic Hospital Environment
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              This demonstration uses synthetic healthcare data. No connection is made to real clinical infrastructure.
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={() => setPublicPage('home')}
            style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}
          >
            &larr; Back to CareSentinel Overview
          </button>
        </div>
      </div>
    </div>
  );
}
