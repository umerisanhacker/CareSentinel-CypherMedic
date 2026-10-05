import { useState } from 'react';
import { 
  useStore, 
  useSimulateAttack, 
  useRunFullChain,
  useResetDemo
} from '../store/store';
import { 
  Play, 
  CheckCircle2, 
  Mail, 
  Link as LinkIcon, 
  Lock, 
  Network, 
  Users, 
  Server, 
  Activity, 
  Database, 
  RefreshCw,
  Terminal,
  RotateCcw,
  AlertTriangle,
  X,
  ShieldCheck
} from 'lucide-react';

export function AttackSimulator() {
  const { state } = useStore();
  const simulateAttack = useSimulateAttack();
  const runFullChain = useRunFullChain();
  const resetDemo = useResetDemo();

  const [lastFired, setLastFired] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  const manualSimulations = [
    {
      name: 'SIMULATE PHISHING',
      type: 'SIMULATE PHISHING',
      category: 'Email Gateway',
      icon: Mail,
      desc: 'Inbound look-alike billing lure targeting Dr. Sarah Wilson',
      color: 'var(--accent-primary)',
    },
    {
      name: 'SIMULATE MALICIOUS LINK',
      type: 'SIMULATE MALICIOUS LINK',
      category: 'LinkGuard',
      icon: LinkIcon,
      desc: 'Credential harvesting landing page intercepted by LinkGuard safe-proxy',
      color: 'var(--accent-secondary)',
    },
    {
      name: 'SIMULATE CREDENTIAL COMPROMISE',
      type: 'SIMULATE CREDENTIAL COMPROMISE',
      category: 'Identity Sentry',
      icon: Lock,
      desc: 'OAuth bearer token exposure and token exfiltration signal',
      color: 'var(--warning)',
    },
    {
      name: 'SIMULATE PORT SCAN',
      type: 'SIMULATE PORT SCAN',
      category: 'Clinical Network NIDS',
      icon: Network,
      desc: 'Reconnaissance scan across clinical server ports 22, 80, 443, 8080, 8443',
      color: 'var(--accent-primary)',
    },
    {
      name: 'SIMULATE BRUTE FORCE',
      type: 'SIMULATE BRUTE FORCE',
      category: 'DMZ Reverse Proxy',
      icon: Terminal,
      desc: 'Rapid parallel failed authentication attempts on hospital reverse proxy',
      color: 'var(--warning)',
    },
    {
      name: 'SIMULATE UNUSUAL LOGIN',
      type: 'SIMULATE UNUSUAL LOGIN',
      category: 'IAM Provider',
      icon: Users,
      desc: 'Off-hours login (03:17) from Rogue Device 192.168.1.100',
      color: 'var(--warning)',
    },
    {
      name: 'SIMULATE APPLICATION ATTACK SIGNAL',
      type: 'SIMULATE APPLICATION ATTACK SIGNAL',
      category: 'API Gateway',
      icon: Server,
      desc: 'Parameter scraping probe on /synthetic-api/patient-records',
      color: 'var(--accent-secondary)',
    },
    {
      name: 'SIMULATE EHR ABUSE',
      type: 'SIMULATE EHR ABUSE',
      category: 'EHR Sentry',
      icon: Activity,
      desc: 'Physician accessing unrelated neurology patient charts without clinical order',
      color: 'var(--critical)',
    },
    {
      name: 'SIMULATE BULK ACCESS',
      type: 'SIMULATE BULK ACCESS',
      category: 'EHR Velocity Tripwire',
      icon: Database,
      desc: '47 patient records queried in 90 seconds (9.4x above baseline rate)',
      color: 'var(--critical)',
    },
  ];

  const chainSteps = [
    'Phishing email detected',
    'Malicious URL detected',
    'Credential compromise simulated',
    'Port scan detected',
    'Brute-force pattern detected',
    'Unusual login detected',
    'Application attack signal detected',
    'EHR anomaly detected',
    'Bulk access detected',
    'Events correlated',
    'Critical incident created',
  ];

  const handleManualTrigger = (type: string, name: string) => {
    simulateAttack(type);
    setLastFired(name);
    setTimeout(() => setLastFired(null), 3500);
  };

  const handleConfirmReset = () => {
    resetDemo();
    setShowResetModal(false);
    setResetSuccessMessage('Demo environment restored.');
    setTimeout(() => setResetSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header with Prominent Reset Demo Control */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Attack Simulator & Kill-Chain Engine
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Inject individual synthetic threat signals or execute the unified multi-vector clinical kill-chain.
          </p>
        </div>

        {/* Highly visible Reset Demo Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowResetModal(true)}
            className="btn btn-outline"
            style={{
              padding: '0.65rem 1.15rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              borderColor: 'var(--border)',
              backgroundColor: 'white',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease',
            }}
          >
            <RotateCcw size={16} color="var(--warning)" />
            <span>↻ Reset Demo Environment</span>
          </button>
        </div>
      </div>

      {resetSuccessMessage && (
        <div style={{
          padding: '0.85rem 1.25rem',
          backgroundColor: 'var(--positive-bg)',
          border: '1px solid var(--positive)',
          color: 'var(--positive)',
          borderRadius: '10px',
          fontSize: '0.9rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <ShieldCheck size={20} /> {resetSuccessMessage}
        </div>
      )}

      {lastFired && (
        <div style={{
          padding: '0.75rem 1.25rem',
          backgroundColor: 'var(--positive-bg)',
          border: '1px solid var(--positive)',
          color: 'var(--positive)',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <CheckCircle2 size={16} /> Signal Dispatched: {lastFired} &rarr; Real event added to Central State; Propagated across modules, risk posture & audit ledger!
        </div>
      )}

      {/* KILL CHAIN RUNNER (Section 34 Featured Hero Demo) */}
      <div className="card" style={{
        padding: '2rem',
        backgroundColor: 'white',
        border: '1.5px solid rgba(239, 68, 68, 0.4)',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge bg-critical-light">MAJOR DEMO WORKFLOW</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>11 Sequenced Stages</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Full Clinical Attack Chain Simulation
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '720px', marginTop: '0.25rem', lineHeight: 1.5 }}>
              Executes the complete hospital threat lifecycle: from initial phishing delivery and credential theft to network port reconnaissance, rogue login, and EHR bulk access exfiltration. Progressively dispatches shared synthetic security events and synthesizes the critical incident.
            </p>
          </div>

          <button
            onClick={runFullChain}
            disabled={state.isRunningChain}
            className="btn btn-primary"
            style={{
              padding: '0.85rem 1.75rem',
              fontSize: '1rem',
              backgroundColor: 'var(--critical)',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
            }}
          >
            {state.isRunningChain ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> EXECUTING KILL-CHAIN...
              </>
            ) : (
              <>
                <Play size={18} /> RUN FULL ATTACK CHAIN
              </>
            )}
          </button>
        </div>

        {/* Live Stepper Visualization */}
        <div style={{
          backgroundColor: 'var(--bg-main)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Kill-Chain Progression ({state.attackChainProgress} / 11 Completed)
            </span>
            <span style={{ fontSize: '0.75rem', color: state.isRunningChain ? 'var(--critical)' : 'var(--text-muted)', fontWeight: 600 }}>
              {state.isRunningChain ? '● LIVE PROPAGATION ACTIVE' : state.attackChainProgress === 11 ? 'Completed' : 'Ready to Run'}
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1.25rem' }}>
            <div style={{
              width: `${(state.attackChainProgress / 11) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--critical)',
              transition: 'width 0.4s ease',
            }} />
          </div>

          {/* Step Badges Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.6rem' }}>
            {chainSteps.map((stepName, idx) => {
              const stepNumber = idx + 1;
              const isDone = state.attackChainProgress >= stepNumber;
              const isCurrent = state.attackChainProgress === stepNumber;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: isCurrent ? 'rgba(239, 68, 68, 0.1)' : isDone ? 'white' : 'transparent',
                    border: isCurrent ? '1.5px solid var(--critical)' : isDone ? '1px solid var(--border)' : '1px dashed var(--border)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: isDone ? 'var(--critical)' : 'var(--border)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}>
                    {isDone ? <CheckCircle2 size={13} /> : stepNumber}
                  </div>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: isCurrent || isDone ? 700 : 500,
                    color: isCurrent ? 'var(--critical)' : isDone ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}>
                    {stepName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MANUAL TRIGGER BUTTONS */}
      <div className="card" style={{ padding: '2rem', backgroundColor: 'white' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Discrete Signal Simulators (Manual Triggers)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Trigger individual telemetry events. CareSentinel creates real synthetic security events in central state, updates the targeted module, notifies operators, recalculates posture, and correlates incidents in real time.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}>
          {manualSimulations.map((sim) => {
            const Icon = sim.icon;
            return (
              <div
                key={sim.name}
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        padding: '0.4rem',
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        color: sim.color,
                      }}>
                        <Icon size={16} />
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {sim.category}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {sim.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {sim.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleManualTrigger(sim.type, sim.name)}
                  className="btn btn-outline"
                  style={{ width: '100%', fontSize: '0.825rem', padding: '0.55rem', fontWeight: 600 }}
                >
                  <Play size={14} /> Trigger Signal
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal for Reset Demo Environment (Section 11) */}
      {showResetModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div className="card animate-fade-in" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--warning-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--warning)',
                }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Reset Demo Environment?
                  </h3>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Baseline Restoration
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                style={{ color: 'var(--text-muted)', padding: '0.25rem', borderRadius: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '1.75rem',
            }}>
              This will clear all simulated security events, incidents, notifications, audit entries, and attack-chain progress and restore the synthetic hospital to its initial baseline.
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
            }}>
              <button
                onClick={() => setShowResetModal(false)}
                className="btn btn-outline"
                style={{ padding: '0.6rem 1.25rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="btn btn-danger"
                style={{
                  padding: '0.6rem 1.25rem',
                  backgroundColor: 'var(--critical)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                }}
              >
                <RotateCcw size={15} /> Reset Environment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttackSimulator;
