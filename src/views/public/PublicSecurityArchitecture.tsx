import { Shield, ArrowDown, Database, Mail, Users, Network, Activity, Layers, FileCheck, CheckCircle, ExternalLink } from 'lucide-react';
import { useSetAppMode, useSetCurrentView } from '../../store/store';

export function PublicSecurityArchitecture() {
  const setAppMode = useSetAppMode();
  const setCurrentView = useSetCurrentView();

  const architectureLayers = [
    {
      level: '1. Ingestion Layer',
      title: 'Hospital Clinical & Infrastructure Telemetry',
      components: [
        { name: 'Hospital Email Gateways', desc: 'Exchange / O365 / Secure Clinical Mail relays', icon: Mail },
        { name: 'Identity & SSO Provider', desc: 'Active Directory, Okta, Clinical Smart Card IAM', icon: Users },
        { name: 'EHR / Clinical Systems', desc: 'Epic, Cerner, FHIR REST APIs, HL7 feeds', icon: Database },
        { name: 'Network & Cloud Infrastructure', desc: 'Edge Firewalls, DMZ Proxies, Workstation IPS', icon: Network },
      ],
    },
    {
      level: '2. Integration Layer',
      title: 'CareSentinel Normalization & Ingestion Gateway',
      components: [
        { name: 'Connector Protocol Adapters', desc: 'Normalized JSON schema translation across clinical feeds', icon: Layers },
        { name: 'Synthetic Hospital Sandbox', desc: 'Controlled HIPAA-compliant testbed (Northstar Medical Center)', icon: Shield },
      ],
    },
    {
      level: '3. Intelligence Core',
      title: 'CareSentinel Multi-Vector Processing Engine',
      components: [
        { name: 'Detection Engine', desc: 'Domain heuristics, LinkGuard lexical scan, behavioral window checks', icon: FileCheck },
        { name: 'Correlation Engine', desc: 'Cross-domain entity grouping (physician ID, IP, target asset)', icon: Layers },
        { name: 'Deterministic Risk Engine', desc: 'Rule-based additive scoring with explainable attribution', icon: Shield },
      ],
    },
    {
      level: '4. Operations & Governance',
      title: 'Security Operations & Clinical Audit',
      components: [
        { name: 'Security Operations Console', desc: 'Live multi-system triage, incident drill-down, containment', icon: Activity },
        { name: 'Immutable Audit Ledger', desc: 'Verifiable chronological record for compliance and governance', icon: CheckCircle },
      ],
    },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
          Technical Topology
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Hospital Integration Architecture
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '680px', margin: '0 auto' }}>
          How CareSentinel interfaces with hospital infrastructure to unify disparate medical and cybersecurity signals into one actionable intelligence layer.
        </p>
      </div>

      {/* Synthetic Hospital Disclaimer Banner */}
      <div style={{
        padding: '1.25rem 1.75rem',
        backgroundColor: 'var(--positive-bg)',
        border: '1px solid var(--positive)',
        borderRadius: '12px',
        marginBottom: '3rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <Shield size={24} color="var(--positive)" />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Synthetic Hospital Environment (Northstar Medical Center)
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            In a real hospital deployment, CareSentinel would integrate with production clinical gateways via standard HL7/FHIR connectors, SAML/OIDC feeds, and syslog/SIEM streams. This prototype runs on 100% synthetic simulated telemetry.
          </div>
        </div>
      </div>

      {/* Layer Flow */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative' }}>
        {architectureLayers.map((layer, idx) => (
          <div key={layer.level}>
            <div className="card" style={{ padding: '2rem', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {layer.level}
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {layer.title}
                  </h3>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {layer.components.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.name} style={{
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '1.25rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                        <div style={{ backgroundColor: 'white', padding: '0.4rem', borderRadius: '6px', boxShadow: 'var(--shadow-sm)', color: 'var(--accent-primary)' }}>
                          <Icon size={18} />
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{c.name}</div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {c.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {idx < architectureLayers.length - 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <ArrowDown size={18} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <button
          onClick={() => {
            setAppMode('console');
            setCurrentView('Integration');
          }}
          className="btn btn-primary"
          style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}
        >
          View Live Integration Status in Console <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
}
