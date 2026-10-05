import { AlertCircle } from 'lucide-react';

export function PublicTerms() {
  return (
    <div className="animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
          <AlertCircle size={15} /> Legal Disclaimer
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Prototype Terms & Conditions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Effective: Prototype Evaluation • Demonstration Purposes Only
        </p>
      </div>

      <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            1. Nature of the Prototype
          </h2>
          <p>
            CareSentinel is presented strictly as a conceptual and interactive prototype for evaluating healthcare cybersecurity user experience, multi-vector event correlation, and clinical SOC workflows. It is provided "as is" without warranty of any kind.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            2. Simulated Response Actions
          </h2>
          <p>
            All containment, quarantine, isolation, and blocking capabilities provided in this prototype are simulations. Triggering "Isolate Simulated Device" or "Quarantine Email" affects only the in-memory client state of this demo. CareSentinel does not send administrative commands to any external networking hardware, real workstations, or actual mail servers.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            3. No Real Clinical or Diagnostic Reliance
          </h2>
          <p>
            No information contained within CareSentinel should be utilized for medical triage, clinical decision-making, hospital staffing, or actual cybersecurity incident handling. Fictional patient records and emergency break-glass scenarios are illustrative examples of clinical telemetry.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            4. Prohibition on Real Credentials or Attack Payloads
          </h2>
          <p>
            Users are explicitly prohibited from submitting real medical credentials, active exploit payloads, actual malware hashes, or confidential hospital trade secrets into any input fields within this demonstration application.
          </p>
        </div>
      </div>
    </div>
  );
}
