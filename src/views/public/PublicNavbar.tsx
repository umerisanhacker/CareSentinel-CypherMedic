import { Shield, ArrowRight, LayoutDashboard, Lock } from 'lucide-react';
import { usePublicPage, useSetPublicPage, useSetAppMode, useSetCurrentView } from '../../store/store';

export function PublicNavbar() {
  const publicPage = usePublicPage();
  const setPublicPage = useSetPublicPage();
  const setAppMode = useSetAppMode();
  const setCurrentView = useSetCurrentView();

  const navLinks = [
    { id: 'home', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'security', label: 'Architecture' },
    { id: 'faq', label: 'FAQ' },
  ] as const;

  const handleEnterConsole = () => {
    setAppMode('console');
    setCurrentView('Overview');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <button 
          onClick={() => setPublicPage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}
        >
          <div style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
            width: '38px',
            height: '38px',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
          }}>
            <Shield size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              CARESENTINEL
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.02em' }}>
              Clinical Security Intelligence
            </div>
          </div>
        </button>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {navLinks.map(link => {
            const active = publicPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setPublicPage(link.id)}
                style={{
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderRadius: '6px',
                  backgroundColor: active ? 'var(--bg-hover)' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="badge bg-positive-light" style={{ border: '1px solid var(--positive)', fontSize: '0.72rem', gap: '0.4rem', padding: '0.25rem 0.6rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--positive)' }}></span>
          Synthetic Hospital Demo
        </div>

        <button
          onClick={() => setPublicPage('login')}
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            padding: '0.5rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Lock size={15} /> Sign In
        </button>

        <button
          onClick={handleEnterConsole}
          className="btn btn-primary"
          style={{ boxShadow: '0 2px 10px rgba(2, 132, 199, 0.25)' }}
        >
          <LayoutDashboard size={16} /> Enter Security Console <ArrowRight size={15} />
        </button>
      </div>
    </header>
  );
}
