import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { AlertTriangle, HeartPulse, ShieldCheck } from 'lucide-react';
import { useEvents, useDevices, useSetCurrentView } from '../../store/store';

function ClinicalSafetyBar() {
  const events = useEvents();
  const devices = useDevices();
  const setCurrentView = useSetCurrentView();
  const activeClinicalEvents = events.filter(e => e.deviceId && (e.status === 'new' || e.status === 'acknowledged'));
  const patientConnectedAlerts = activeClinicalEvents.filter(e => devices.find(d => d.id === e.deviceId)?.patientConnected).length;
  const critical = patientConnectedAlerts > 0;
  return (
    <div style={{ margin: '0 0 1rem', padding: '0.8rem 1rem', borderRadius: '12px', border: critical ? '1px solid #fed7aa' : '1px solid #dbeafe', background: critical ? '#fffaf5' : '#f8fbff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, display: 'grid', placeItems: 'center', background: critical ? '#ffedd5' : '#eff6ff', color: critical ? '#c2410c' : 'var(--accent-primary)' }}>{critical ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}</div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 850, letterSpacing: '0.05em', textTransform: 'uppercase', color: critical ? '#9a3412' : 'var(--accent-primary)' }}>{critical ? 'Clinical Safety Mode Active' : 'Clinical Safety Guard Active'}</div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{critical ? patientConnectedAlerts + ' patient-connected device alert' + (patientConnectedAlerts === 1 ? '' : 's') + ' require human-aware response. Preserve clinical operation.' : 'Security actions are evaluated against clinical impact before disruptive response.'}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 750, color: 'var(--text-muted)' }}>{activeClinicalEvents.length} device signal{activeClinicalEvents.length === 1 ? '' : 's'} active</span>
        <button onClick={() => setCurrentView(critical ? 'Devices' : 'Overview')} className="btn btn-outline" style={{ padding: '0.42rem 0.7rem', fontSize: '0.72rem' }}><HeartPulse size={13} /> {critical ? 'Open Clinical Response' : 'View Posture'}</button>
      </div>
    </div>
  );
}


interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="app-container security-shell">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <main className="dashboard-content">
          <ClinicalSafetyBar />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '0 0 auto 0',
              height: '220px',
              pointerEvents: 'none',
              background: 'linear-gradient(180deg, rgba(8,126,164,.035), transparent)',
              zIndex: -1,
            }}
          />
          {children}
        </main>
      </div>
    </div>
  );
}
