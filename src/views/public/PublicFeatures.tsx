import { 
  Mail, 
  Link as LinkIcon, 
  FileCheck, 
  Users, 
  Network, 
  Activity, 
  Layers, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { useSetAppMode, useSetCurrentView } from '../../store/store';

export function PublicFeatures() {
  const setAppMode = useSetAppMode();
  const setCurrentView = useSetCurrentView();

  const enterConsole = (view: string) => {
    setAppMode('console');
    setCurrentView(view);
  };

  const features = [
    {
      title: 'Email Security & Sender Analysis',
      icon: Mail,
      category: 'Inbound Protection',
      view: 'Email Security',
      description: 'Protects hospital staff from deceptive domain permutations, look-alike senders, and spear-phishing campaigns masquerading as clinical billing or credential notices.',
      highlights: [
        'Domain syntax and homograph typo-squatting detection',
        'Display-name mismatch against internal hospital directories',
        'Synthetic SPF, DKIM, and DMARC alignment validation',
        'Automated quarantine workflow with zero clinical disruption'
      ]
    },
    {
      title: 'LinkGuard Deep URL Sentry',
      icon: LinkIcon,
      category: 'Perimeter Defense',
      view: 'LinkGuard',
      description: 'Deep lexical and structural inspection of links embedded in clinical correspondence, protecting medical staff from malicious credential harvesting portals.',
      highlights: [
        'Real-time entropy analysis of query parameters and paths',
        'Port and protocol anomaly detection (non-standard web ports)',
        'Redirect chain expansion and synthetic reputation scoring',
        'Simulated Block, Allow, and Deep Investigation actions'
      ]
    },
    {
      title: 'Attachment Inspection & Payload Sandboxing',
      icon: FileCheck,
      category: 'Malware Defense',
      view: 'Attachments',
      description: 'Safe static metadata inspection of inbound clinical attachments, scrutinizing archive depth, nested executable contents, and script heuristics without dangerous payload detonation.',
      highlights: [
        'Zip bomb and recursive nested archive inspection (up to 4 levels)',
        'Suspicious extension masking and executable content flagging',
        'SHA-256 cryptographic hash verification',
        'Safe synthetic demonstration safeguards preventing arbitrary execution'
      ]
    },
    {
      title: 'Identity & Access Behavioral Sentry',
      icon: Users,
      category: 'Zero Trust Access',
      view: 'Identity',
      description: 'Monitors clinical single sign-on sessions, comparing logins against scheduled shift windows, physician ward assignments, and unrecognized hardware signatures.',
      highlights: [
        'Expected vs. actual clinical working window evaluation',
        'Rogue client and unknown device detection on hospital subnets',
        'Credential replay and token compromise telemetry',
        'Simulated account flagging and credential reset enforcement'
      ]
    },
    {
      title: 'Clinical Network Intrusion Detection (NIDS)',
      icon: Network,
      category: 'Network Telemetry',
      view: 'Network',
      description: 'Controlled network telemetry engine mapping traffic across clinical edge firewalls, DMZ reverse proxies, and internal database VLANs.',
      highlights: [
        'Port scanning and reconnaissance pattern detection (ports 22, 80, 443, 8080, 8443)',
        'Brute-force authentication velocity alerts',
        'Interactive SVG network topology with live packet flow metrics',
        'Simulated hardware node isolation into quarantine VLAN'
      ]
    },
    {
      title: 'EHR Security & Bulk Record Velocity Engine',
      icon: Activity,
      category: 'Clinical Protection',
      view: 'EHR Security',
      description: 'Specialized healthcare sentry analyzing physician-patient relationship boundaries, rapid querying velocity, and audited emergency break-glass procedures.',
      highlights: [
        'Access velocity tripwire: flags queries exceeding 5 charts/30 min',
        'Cross-department relationship anomaly detection (e.g. Cardiology accessing Neurology)',
        'Audited emergency Break-Glass access request and approval workflow',
        'Detection of anomalous bulk access and compromised synthetic clinical accounts'
      ]
    },
    {
      title: 'Deterministic Multi-Vector Correlation Engine',
      icon: Layers,
      category: 'Core Synthesis',
      view: 'Incidents',
      description: 'Synthesizes disparate security signals into a single intelligible incident, eliminating alert fatigue and presenting SOC teams with a cohesive attack chain.',
      highlights: [
        'Automatic linkage of email, link, identity, network, and EHR alerts',
        'Automated incident timeline generation with chronological forensic evidence',
        'Target entity grouping by affected physician and compromised endpoint',
        'Dynamic severity calculation and recommended response playbooks'
      ]
    },
    {
      title: 'Explainable Decision-Support Risk Engine',
      icon: ShieldCheck,
      category: 'Explainability',
      view: 'Overview',
      description: 'Calculates transparent, deterministic risk scores for individual events and overall hospital security posture without unverified black-box AI outputs.',
      highlights: [
        'Clear scoring breakdown (e.g. +20 unusual login, +18 bulk access, +14 phishing)',
        'Dedicated "Why this score?" dialog explaining evidentiary signals',
        'Dynamic posture recalculation in response to operator containment actions',
        'Category breakdown across Email, Identity, Network, Application, and EHR'
      ]
    },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
          Platform Capabilities
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Engineered for Healthcare Security Operations
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
          Every module in CareSentinel is built to protect synthetic clinical workflows, surface intrusion signals, and safeguard synthetic electronic health records.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--accent-light)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={22} />
                  </div>
                  <span className="badge bg-accent-light">{f.category}</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {f.description}
                </p>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Key Capabilities
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {f.highlights.map((h, i) => (
                      <li key={i} style={{ fontSize: '0.825rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--accent-primary)', marginTop: '2px' }}>•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => enterConsole(f.view)}
                className="btn btn-outline"
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                Open {f.view} Module <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
