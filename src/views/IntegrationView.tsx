import { 
  Network, 
  Mail, 
  Users, 
  Activity, 
  ShieldCheck, 
  Server
} from 'lucide-react';

export function IntegrationView() {
  const integrationPoints = [
    {
      name: 'Hospital Inbound Email Gateway',
      type: 'Connector: Microsoft Exchange / O365 / Proofpoint Relay',
      status: 'SYNTHETIC CONNECTOR ACTIVE',
      latency: '24ms',
      telemetry: 'Inbound message headers, envelope recipient, SPF/DKIM/DMARC auth records, raw body links',
      icon: Mail,
    },
    {
      name: 'Identity & Access Management (IAM)',
      type: 'Connector: Active Directory / Okta / Imprivata Clinical SmartCard',
      status: 'SYNTHETIC CONNECTOR ACTIVE',
      latency: '18ms',
      telemetry: 'Single sign-on tokens, station login timestamps, Kerberos tickets, biometric smartcard taps',
      icon: Users,
    },
    {
      name: 'Electronic Health Record (EHR) Sentry',
      type: 'Connector: Epic Interconnect / Cerner Millenium / HL7 FHIR v4 API',
      status: 'SYNTHETIC CONNECTOR ACTIVE',
      latency: '42ms',
      telemetry: 'Patient chart opens, clinical orders, break-glass justification reasons, bulk query logs',
      icon: Activity,
    },
    {
      name: 'Clinical Network Telemetry & NIDS',
      type: 'Connector: Palo Alto / Cisco Firepower / Suricata Syslog Feed',
      status: 'SYNTHETIC CONNECTOR ACTIVE',
      latency: '12ms',
      telemetry: 'NetFlow IPFIX streams, IDS alert signatures, clinical subnet port scans, DNS lookups',
      icon: Network,
    },
    {
      name: 'Clinical API & Application Gateway',
      type: 'Connector: Kong / Envoy / FHIR Gateway Reverse Proxy',
      status: 'SYNTHETIC CONNECTOR ACTIVE',
      latency: '15ms',
      telemetry: 'REST HTTP transactions, authorization token verification, rate limit tripwire anomalies',
      icon: Server,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Hospital Integration Architecture
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
          Conceptual production architecture and synthetic hospital connector telemetry feeds.
        </p>
      </div>

      {/* Synthetic Disclaimer Banner */}
      <div style={{
        padding: '1.25rem 1.5rem',
        backgroundColor: 'var(--positive-bg)',
        border: '1px solid var(--positive)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <ShieldCheck size={24} color="var(--positive)" style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Conceptual Production Architecture (Current Prototype Uses Synthetic Data)
          </div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            In a real hospital, CareSentinel interfaces with production clinical infrastructure using read-only connectors and signed security streams. No production healthcare systems are contacted in this evaluation environment.
          </div>
        </div>
      </div>

      {/* Conceptual Data Pipeline Architecture */}
      <div className="card" style={{ padding: '2rem', backgroundColor: 'white' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          Five-Stage Ingestion to Response Pipeline
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          {[
            { step: '1. Hospital Ingress', desc: 'Email, Active Directory, Epic/Cerner EHR, Core Network Firewalls' },
            { step: '2. Normalization', desc: 'CareSentinel Protocol Adapters map disparate events to Unified Schema' },
            { step: '3. Detection Engine', desc: 'Heuristics, LinkGuard sandboxing, shift window comparison' },
            { step: '4. Correlation Engine', desc: 'Synthesizes related multi-vector signals into single incident' },
            { step: '5. SOC Actions & Audit', desc: 'Simulated device isolation, token revocation, and immutable ledger' },
          ].map((item, idx) => (
            <div key={idx} style={{
              padding: '1.25rem 1rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: '10px',
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
                {item.step}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Synthetic Connectors */}
      <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          Synthetic Hospital Connectors (Northstar Medical Center)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {integrationPoints.map((ip) => {
            const Icon = ip.icon;
            return (
              <div key={ip.name} style={{
                padding: '1.25rem',
                backgroundColor: 'var(--bg-main)',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)',
                  }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {ip.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {ip.type}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Ingestion Latency: <strong>{ip.latency}</strong>
                  </div>
                  <span className="badge bg-positive-light">
                    {ip.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default IntegrationView;
