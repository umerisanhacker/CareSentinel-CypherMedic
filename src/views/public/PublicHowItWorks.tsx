import { Shield, ArrowRight, Search, Layers, FileText, Terminal, CheckCircle2 } from 'lucide-react';
import { useSetAppMode, useSetCurrentView } from '../../store/store';

export function PublicHowItWorks() {
  const setAppMode = useSetAppMode();
  const setCurrentView = useSetCurrentView();

  const enterConsole = (view: string = 'Attack Simulator') => {
    setAppMode('console');
    setCurrentView(view);
  };

  const steps = [
    {
      num: '01',
      title: 'PREVENT — Multi-Vector Perimeter Defense',
      desc: 'CareSentinel intercepts inbound threats at the edge of the hospital environment. It evaluates sender reputation, domain typo-squatting, display-name masquerading, link redirection chains, and attachment archive structures before physicians or staff interact with potential lures.',
      metrics: 'Synthetic benchmark: look-alike domains are evaluated before the demo inbox workflow.',
      icon: Shield,
    },
    {
      num: '02',
      title: 'DETECT — Behavioral Clinical Telemetry',
      desc: 'Beyond perimeter email filters, CareSentinel continuously monitors internal authentication, network flows, and EHR patient chart lookups. It flags anomalies such as logins during off-hours, sessions originating from unknown hardware, and queries to medical records outside a doctor’s specialty.',
      metrics: 'Monitors clinical working windows (e.g. 07:00–17:00 vs. 03:17 unauthorized logins).',
      icon: Search,
    },
    {
      num: '03',
      title: 'CORRELATE — Attack Chain Synthesis',
      desc: 'Instead of bombarding hospital SOC analysts with disconnected alerts, CareSentinel’s Correlation Engine fuses signals across email, identity, network, and EHR systems. It recognizes that a clicked link, an off-hours login, and an unusual EHR query share the same target physician account.',
      metrics: 'Correlation goal: turn related multi-system signals into one investigation workspace.',
      icon: Layers,
    },
    {
      num: '04',
      title: 'EXPLAIN — Deterministic Risk Scoring',
      desc: 'Security decisions in healthcare must be explainable and auditable. CareSentinel avoids unverified black-box AI scores in favor of clear, rule-based deterministic attribution. Analysts can inspect exactly why an incident has a risk score of 94/100, reviewing every contributing signal.',
      metrics: 'Transparent formula: +20 unusual login, +18 bulk access, +16 unknown device.',
      icon: FileText,
    },
    {
      num: '05',
      title: 'RESPOND — Clinical-Safe Containment',
      desc: 'When an intrusion is identified, CareSentinel provides swift simulated containment options tailored to medical settings. Operators can isolate rogue devices without taking critical care systems offline, revoke active EHR tokens, and enforce password resets.',
      metrics: 'Targeted workstation isolation preserves clinical PACS and vital monitoring.',
      icon: Terminal,
    },
    {
      num: '06',
      title: 'AUDIT — Immutable Forensic Verification',
      desc: 'Every detection, policy decision, quarantine event, and break-glass override is committed to an immutable chronological audit ledger. This provides the forensic traceability required for HIPAA-oriented auditability and post-incident clinical governance.',
      metrics: 'Chronological prototype ledger records timestamp, actor, system, action, and outcome.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
          Security Architecture
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          The CareSentinel Methodology
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto' }}>
          From initial phishing delivery to correlated hospital SOC incident containment.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '2rem' }}>
              <div style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--accent-primary)',
                lineHeight: 1,
                minWidth: '50px',
              }}>
                {s.num}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '0.4rem', borderRadius: '6px' }}>
                    <Icon size={18} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{s.title}</h3>
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {s.desc}
                </p>
                <div style={{
                  padding: '0.6rem 1rem',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: 'var(--accent-primary)',
                  display: 'inline-block',
                }}>
                  {s.metrics}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Experience the Methodology in Real-Time
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 1.5rem auto' }}>
          Trigger our 11-step Kill-Chain Simulator to witness live event propagation from email to EHR bulk access and incident synthesis.
        </p>
        <button
          onClick={() => enterConsole('Attack Simulator')}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
        >
          Launch Kill-Chain Simulator <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
