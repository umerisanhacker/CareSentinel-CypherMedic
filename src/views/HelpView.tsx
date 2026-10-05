import { useState } from 'react';
import { 
  BookOpen, 
  Play, 
  ShieldAlert, 
  Mail, 
  Link as LinkIcon, 
  Activity, 
  Network, 
  ScrollText, 
  ChevronRight
} from 'lucide-react';
import { useSetCurrentView } from '../store/store';

export function HelpView() {
  const setCurrentView = useSetCurrentView();
  const [selectedTopic, setSelectedTopic] = useState('getting_started');

  const topics = [
    {
      id: 'getting_started',
      title: 'Getting Started with CareSentinel',
      icon: BookOpen,
      content: (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Welcome to CareSentinel</h3>
          <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
            CareSentinel is a Clinical Security Intelligence layer designed specifically for modern hospital environments. This prototype demonstrates how separate threat signals (an email phish, an anomalous login, a network scan, and an unauthorized EHR record lookup) are unified into a single actionable incident.
          </p>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
            <strong>Quick Demo Recommendation:</strong> Head to the <strong>Attack Simulator</strong> and click <strong>"RUN FULL ATTACK CHAIN"</strong>. This automatically dispatches 11 interconnected events across all hospital modules and opens the resulting Critical Incident investigation.
          </div>
        </div>
      ),
    },
    {
      id: 'dashboard',
      title: 'Security Overview Dashboard',
      icon: Activity,
      content: (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Dashboard Overview</h3>
          <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
            The dashboard presents a centralized picture of Northstar Medical Center's security posture. It displays 6 real-time metric cards, an interactive Recharts threat activity graph, the calculated Security Posture dial, and active critical incidents.
          </p>
          <p style={{ lineHeight: 1.6 }}>
            Clicking on the <strong>"Why this score?"</strong> button on the Security Posture panel opens a detailed deterministic breakdown of every contributing signal deduction.
          </p>
        </div>
      ),
    },
    {
      id: 'email_security',
      title: 'Email Security & Sender Analysis',
      icon: Mail,
      content: (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Inbound Email Protection</h3>
          <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
            The Email Security module simulates a security-aware hospital inbox. It classifies clinical correspondence across Inbox, Quarantine, and Analyzed categories.
          </p>
          <p style={{ lineHeight: 1.6 }}>
            Clicking any email opens the deep inspector, revealing look-alike domain heuristics (e.g. <code>hospital-support.example</code> vs <code>northstar-med.org</code>), display-name spoofing warnings, and synthetic SPF/DKIM/DMARC authentication results.
          </p>
        </div>
      ),
    },
    {
      id: 'linkguard',
      title: 'LinkGuard URL Scanner',
      icon: LinkIcon,
      content: (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>LinkGuard Real-Time Inspection</h3>
          <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
            LinkGuard analyzes hyperlinks embedded in clinical messages. You can paste any synthetic URL into the manual query box or click sample links.
          </p>
          <p style={{ lineHeight: 1.6 }}>
            LinkGuard assesses domain entropy, port anomalies, redirect paths, and credential collection patterns, offering simulated <strong>Block Link</strong>, <strong>Allow</strong>, and <strong>Investigate</strong> actions.
          </p>
        </div>
      ),
    },
    {
      id: 'ehr_security',
      title: 'EHR Security & Break-Glass Protocol',
      icon: Activity,
      content: (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>EHR Sentry & Velocity Tripwires</h3>
          <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
            Protects electronic patient records against bulk data theft and unauthorized chart snooping. The access velocity gauge detects when an account breaches the 5 records / 30m baseline (e.g., 47 records queried in 90 seconds).
          </p>
          <p style={{ lineHeight: 1.6 }}>
            The <strong>Break-Glass Protocol</strong> tab allows compliance reviewers to evaluate documented emergency trauma treatment exceptions without causing clinical care delays.
          </p>
        </div>
      ),
    },
    {
      id: 'network_security',
      title: 'Clinical Network Telemetry (NIDS)',
      icon: Network,
      content: (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Network Intrusion Telemetry</h3>
          <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
            Displays an interactive SVG topology connecting external gateways, clinical firewalls, DMZ proxies, and internal database VLANs.
          </p>
          <p style={{ lineHeight: 1.6 }}>
            Security analysts can inspect port scan reconnaissance telemetry (source 10.0.0.45 scanning clinical ports) and simulate instant hardware isolation into a quarantine VLAN.
          </p>
        </div>
      ),
    },
    {
      id: 'incident_investigation',
      title: 'Incident Investigation Workspace',
      icon: ShieldAlert,
      content: (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>SOC Investigation Workspace</h3>
          <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
            When an incident is selected, CareSentinel opens a full investigation dashboard presenting the complete chronological timeline, forensic evidence cards, signal attribution, and safe response actions.
          </p>
          <p style={{ lineHeight: 1.6 }}>
            Analysts can add investigation notes and adjust incident lifecycle states: <code>NEW</code> &rarr; <code>ACTIVE</code> &rarr; <code>INVESTIGATING</code> &rarr; <code>CONTAINED</code> &rarr; <code>RESOLVED</code>.
          </p>
        </div>
      ),
    },
    {
      id: 'attack_simulator',
      title: 'Attack Simulator & Kill-Chain Engine',
      icon: Play,
      content: (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Attack Simulator Engine</h3>
          <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
            Provides 9 individual signal triggers (phishing, malicious link, credential compromise, port scan, brute force, unusual login, API probe, EHR abuse, bulk access) plus the automated 11-step <strong>RUN FULL ATTACK CHAIN</strong> workflow.
          </p>
          <p style={{ lineHeight: 1.6 }}>
            All simulated events immediately propagate across the shared application store, modifying the risk score, audit ledger, and incident correlation.
          </p>
        </div>
      ),
    },
    {
      id: 'audit_ledger',
      title: 'Audit Ledger & HIPAA Governance',
      icon: ScrollText,
      content: (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Clinical Audit Ledger</h3>
          <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
            Maintains an immutable, chronological trail of all security events, automated detections, and operator containment decisions.
          </p>
          <p style={{ lineHeight: 1.6 }}>
            Logs can be filtered by system, actor, or outcome, and exported to standard CSV format for compliance reporting.
          </p>
        </div>
      ),
    },
  ];

  const currentTopicData = topics.find(t => t.id === selectedTopic) || topics[0];

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Help & Operational Documentation
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
          Comprehensive operational guide for CareSentinel modules, clinical workflows, and demo capabilities.
        </p>
      </div>

      {/* 2-Column Documentation Viewer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Navigation Sidebar */}
        <div className="card" style={{ padding: '1.25rem', backgroundColor: 'white' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
            Documentation Topics
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {topics.map(t => {
              const active = selectedTopic === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: active ? '1.5px solid var(--accent-primary)' : '1px solid transparent',
                    backgroundColor: active ? 'rgba(2, 132, 199, 0.05)' : 'transparent',
                    color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Icon size={16} />
                    <span>{t.title}</span>
                  </div>
                  {active && <ChevronRight size={14} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Panel */}
        <div className="card" style={{ padding: '2rem', backgroundColor: 'white' }}>
          {currentTopicData.content}

          <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Northstar Medical Center • Synthetic Security Documentation
            </span>
            <button
              onClick={() => setCurrentView('Overview')}
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              Return to Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpView;
