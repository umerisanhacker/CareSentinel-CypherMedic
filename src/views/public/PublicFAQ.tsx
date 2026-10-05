import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useSetAppMode, useSetCurrentView } from '../../store/store';

export function PublicFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const setAppMode = useSetAppMode();
  const setCurrentView = useSetCurrentView();

  const faqs = [
    {
      q: 'What is CareSentinel?',
      a: 'CareSentinel is a specialized Clinical Security Intelligence platform designed specifically for hospital healthcare environments. It connects signals across email gateways, identity systems, network telemetry, and electronic health records (EHR) into one unified, explainable security layer to detect multi-vector clinical cyber threats.'
    },
    {
      q: 'Does CareSentinel replace an EHR?',
      a: 'No. CareSentinel does not replace electronic health record systems like Epic, Cerner, or MEDITECH. Instead, it acts as an intelligent security observation and protection layer over your existing EHR, monitoring patient record queries for velocity anomalies, unauthorized cross-department lookups, and suspicious break-glass accesses.'
    },
    {
      q: 'Does CareSentinel replace a hospital firewall?',
      a: 'No. Firewalls and intrusion prevention systems remain essential boundary perimeter controls. CareSentinel ingests and correlates telemetry from your firewalls alongside clinical identity logins and EHR queries to recognize coordinated lateral movement and targeted attacks.'
    },
    {
      q: 'How does email security work?',
      a: 'CareSentinel inspects incoming clinical correspondence for look-alike domain permutations, display-name spoofing, and urgent billing or credential lures. It evaluates synthetic SPF, DKIM, and DMARC alignment and enables zero-disruption quarantine of weaponized emails.'
    },
    {
      q: 'How does LinkGuard work?',
      a: 'LinkGuard performs real-time deep structural analysis on hyperlinks embedded in healthcare correspondence. It evaluates domain entropy, port anomalies, redirect paths, and known credential-harvesting patterns, assigning an explainable risk score and recommending automated block or allow decisions.'
    },
    {
      q: 'Can CareSentinel detect unusual EHR access?',
      a: 'Yes. CareSentinel establishes clinical baseline models (such as expected patient-physician relationships and access velocities like 5 records per 30 minutes). When an account queries 47 charts in 90 seconds or accesses records in an unrelated department, CareSentinel immediately flags the activity and escalates incident risk.'
    },
    {
      q: 'Does CareSentinel use AI?',
      a: 'In CareSentinel, core security detection and risk scoring are strictly deterministic and rule-based. We do NOT rely on an opaque LLM as a security decision-maker because clinical environments require explainable, repeatable, and auditable decisions. AI is envisioned solely as an assistive drafting tool for investigation notes.'
    },
    {
      q: 'How does the attack simulator work?',
      a: 'The Attack Simulator allows security operators to test individual threat vectors (phishing, malicious links, brute force, unusual logins, EHR abuse) or trigger the "Run Full Attack Chain" sequence. The full chain fires 11 related events across multiple systems and demonstrates automatic real-time correlation into a Critical Incident.'
    },
    {
      q: 'Does the prototype use real patient data?',
      a: 'Strictly NO. This prototype uses 100% synthetic healthcare data modeled after Northstar Medical Center. No real patient records, real doctor accounts, or actual hospital networks are accessed or stored. It is a secure, isolated sandbox built for demonstration.'
    },
    {
      q: 'How would a hospital integrate CareSentinel in production?',
      a: 'In a production deployment, CareSentinel connects via approved, read-only gateways: HL7/FHIR API connectors for EHR audit logs, SAML/OIDC feeds from hospital Identity Providers, and standard syslog/API relays from email and firewall infrastructure. Telemetry is normalized in an on-premises or private cloud security enclave.'
    },
    {
      q: 'What happens when a threat is detected?',
      a: 'When an anomaly is flagged, CareSentinel assesses its severity, incorporates it into the deterministic risk engine, and checks for correlations with active clinical accounts. Operators can safely simulate rapid containment actions such as isolating rogue devices, revoking active EHR session tokens, or quarantining suspicious messages.'
    },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
          Questions & Answers
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Key technical and operational details regarding CareSentinel’s clinical security architecture and demo environment.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3.5rem' }}>
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="card"
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'white',
                border: isOpen ? '1px solid var(--accent-primary)' : '1px solid var(--border)',
                transition: 'all 0.2s ease',
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  color: isOpen ? 'var(--accent-primary)' : 'var(--text-primary)',
                }}
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} color="var(--text-muted)" />}
              </button>
              {isOpen && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        padding: '2rem',
        backgroundColor: 'var(--bg-main)',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <HelpCircle size={28} color="var(--accent-primary)" style={{ margin: '0 auto 0.75rem auto' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Want to test the threat workflow yourself?
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 1.25rem auto' }}>
          Enter the security console and trigger the attack simulator to see detection and correlation in action.
        </p>
        <button
          onClick={() => {
            setAppMode('console');
            setCurrentView('Attack Simulator');
          }}
          className="btn btn-primary"
        >
          Open Attack Simulator
        </button>
      </div>
    </div>
  );
}
