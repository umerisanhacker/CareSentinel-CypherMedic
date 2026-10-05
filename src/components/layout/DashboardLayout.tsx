import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

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
