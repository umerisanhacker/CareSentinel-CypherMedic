import { Shield, ExternalLink, HeartPulse } from 'lucide-react';
import { useSetPublicPage, useSetAppMode } from '../../store/store';

export function PublicFooter() {
  const setPublicPage = useSetPublicPage();
  const setAppMode = useSetAppMode();

  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--border)',
      padding: '4rem 2rem 2.5rem 2rem',
      color: 'var(--text-secondary)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Shield size={18} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>CARESENTINEL</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Clinical Security Intelligence layer engineered for hospitals, protecting digital patient care infrastructure from multi-vector cyber threats.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>
              <HeartPulse size={16} /> Northstar Medical Center Demo Environment
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><button onClick={() => setPublicPage('features')} style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>Email & LinkGuard</button></li>
              <li><button onClick={() => setPublicPage('features')} style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>Identity & Access Security</button></li>
              <li><button onClick={() => setPublicPage('features')} style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>EHR Sentry & Bulk Access</button></li>
              <li><button onClick={() => setPublicPage('features')} style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>Deterministic Risk Engine</button></li>
              <li><button onClick={() => setPublicPage('how-it-works')} style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>Correlation Architecture</button></li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Architecture & Trust
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><button onClick={() => setPublicPage('security')} style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>Integration Framework</button></li>
              <li><button onClick={() => setPublicPage('faq')} style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>Frequently Asked Questions</button></li>
              <li><button onClick={() => setPublicPage('privacy')} style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>Prototype Privacy Notice</button></li>
              <li><button onClick={() => setPublicPage('terms')} style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>Prototype Terms & Conditions</button></li>
              <li><button onClick={() => setPublicPage('login')} style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>Clinical SSO Gate</button></li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Security Operations
            </div>
            <p style={{ fontSize: '0.825rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Access the live hospital SOC dashboard to inspect synthetic telemetry, run the attack simulator, and examine correlated incidents.
            </p>
            <button
              onClick={() => { setAppMode('console'); }}
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.825rem', padding: '0.5rem' }}
            >
              Open Security Console <ExternalLink size={14} />
            </button>
          </div>
        </div>

        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          gap: '1rem',
        }}>
          <div>
            © 2026 CareSentinel. Synthetic demonstration environment. No connection to real clinical systems or actual patient records.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button onClick={() => setPublicPage('privacy')} style={{ color: 'var(--text-muted)' }}>Privacy</button>
            <button onClick={() => setPublicPage('terms')} style={{ color: 'var(--text-muted)' }}>Terms</button>
            <button onClick={() => setPublicPage('faq')} style={{ color: 'var(--text-muted)' }}>FAQ</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
