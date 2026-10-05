import { ShieldAlert } from 'lucide-react';

export function PublicPrivacy() {
  return (
    <div className="animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
          Compliance & Governance
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Prototype Privacy Notice
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Last Updated: Prototype Release v1.0 • Fictional Entity: Northstar Medical Center Demo
        </p>
      </div>

      <div style={{
        padding: '1.5rem',
        backgroundColor: 'var(--critical-bg)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        marginBottom: '2.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
      }}>
        <ShieldAlert size={24} color="var(--critical)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 700, color: 'var(--critical)', fontSize: '0.95rem' }}>
            CRITICAL DEMONSTRATION NOTICE
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
            This application is an educational prototype and hackathon demonstration. It uses strictly synthetic healthcare data. Do NOT enter or upload real patient data, medical records, hospital credentials, or protected health information (PHI).
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            1. Synthetic Healthcare Environment
          </h2>
          <p>
            All physicians (e.g., Dr. Sarah Wilson, Dr. Marcus Chen, Dr. Emily Carter), patients (e.g., Eleanor Vance, Lucas Gray), medical record numbers (MRNs), diagnostic notes, email correspondence, and security telemetry presented within CareSentinel are fictional and generated solely for algorithmic evaluation.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            2. No Collection of Protected Health Information (PHI)
          </h2>
          <p>
            CareSentinel is not a covered entity or business associate under HIPAA for the purposes of this demo. The prototype does not maintain connections to actual electronic health record databases or hospital directory servers. Any data entered into manual query fields (such as LinkGuard or Search) is processed locally in temporary client memory and is purged on session refresh.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            3. Local Browser Storage & Telemetry
          </h2>
          <p>
            State modifications performed during your session (e.g., quarantining a synthetic email, isolating a simulated device, or executing the attack simulator kill-chain) reside exclusively in browser memory. No telemetry or user input is transmitted to third-party tracking services or external LLM APIs.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            4. Production Architecture Comparison
          </h2>
          <p>
            In a prospective production hospital deployment, CareSentinel would be deployed within the hospital’s secure virtual private cloud (VPC) or on-premises data center under a formal Business Associate Agreement (BAA). Real patient data would remain encrypted in transit and at rest with role-based clinical access controls.
          </p>
        </div>
      </div>
    </div>
  );
}
