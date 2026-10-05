import { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldAlert, 
  Mail, 
  Link as LinkIcon, 
  Lock, 
  Users, 
  Network, 
  Activity, 
  FileText, 
  CheckCircle
} from 'lucide-react';
import { useSetCurrentView, useSimulateAttack, useSelectIncident } from '../../store/store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function GuidedDemoModal({ isOpen, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const setCurrentView = useSetCurrentView();
  const simulateAttack = useSimulateAttack();
  const selectIncident = useSelectIncident();

  if (!isOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: 'Doctor Receives Billing Phish',
      system: 'Email Security',
      view: 'Email Security',
      icon: Mail,
      desc: 'Dr. Sarah Wilson receives an urgent clinical billing reconciliation email from look-alike domain "hospital-support.example".',
      action: () => {
        setCurrentView('Email Security');
        simulateAttack('Phishing');
      },
      actionLabel: 'Inspect Clinical Email',
    },
    {
      step: 2,
      title: 'Sender & Domain Analysis',
      system: 'Email Gateway',
      view: 'Email Security',
      icon: Mail,
      desc: 'CareSentinel validates syntax, detects homograph domain typo-squatting, and flags synthetic SPF/DKIM/DMARC failure.',
      action: () => setCurrentView('Email Security'),
      actionLabel: 'View Sender Heuristics',
    },
    {
      step: 3,
      title: 'LinkGuard Analyzes Suspicious URL',
      system: 'LinkGuard',
      view: 'LinkGuard',
      icon: LinkIcon,
      desc: 'LinkGuard inspects "http://secure-hospital-login.example/account", discovering credential harvesting indicators and a high risk score (82/100).',
      action: () => {
        setCurrentView('LinkGuard');
        simulateAttack('Malicious Link');
      },
      actionLabel: 'Analyze URL with LinkGuard',
    },
    {
      step: 4,
      title: 'Attachment Metadata Inspection',
      system: 'Attachments',
      view: 'Attachments',
      icon: FileText,
      desc: 'Attachment Sentry safely inspects "patient_billing_manifest.zip" discovering nested script files without executing dangerous payloads.',
      action: () => setCurrentView('Attachments'),
      actionLabel: 'Inspect Attachment Heuristics',
    },
    {
      step: 5,
      title: 'Simulated Credential Compromise',
      system: 'Identity Provider',
      view: 'Identity',
      icon: Lock,
      desc: 'A synthetic credential token exposure signal is registered when credentials are submitted to the replica site.',
      action: () => {
        setCurrentView('Identity');
        simulateAttack('Credential Compromise');
      },
      actionLabel: 'View Credential Signal',
    },
    {
      step: 6,
      title: 'Clinical Subnet Port Scan',
      system: 'Network NIDS',
      view: 'Network',
      icon: Network,
      desc: 'Attacker probes internal hospital ports (22, 80, 443, 8080, 8443) from IP 10.0.0.45.',
      action: () => {
        setCurrentView('Network');
        simulateAttack('Port Scan');
      },
      actionLabel: 'Inspect Network Telemetry',
    },
    {
      step: 7,
      title: 'Unusual Login from Rogue Device',
      system: 'IAM SSO',
      view: 'Identity',
      icon: Users,
      desc: 'Login using dr.sarah credentials occurs at 03:17 from unrecognized hardware (192.168.1.100), outside normal ward hours.',
      action: () => {
        setCurrentView('Identity');
        simulateAttack('Unusual Login');
      },
      actionLabel: 'View Behavioral Login Alert',
    },
    {
      step: 8,
      title: 'Cross-Department EHR Access Anomaly',
      system: 'EHR Security',
      view: 'EHR Security',
      icon: Activity,
      desc: 'Account accesses Neurology inpatient chart #8819 with no documented attending physician relationship.',
      action: () => {
        setCurrentView('EHR Security');
        simulateAttack('EHR Abuse');
      },
      actionLabel: 'Inspect Clinical Relationship',
    },
    {
      step: 9,
      title: 'EHR Bulk Access Velocity Tripwire',
      system: 'EHR Velocity Monitor',
      view: 'EHR Security',
      icon: ShieldAlert,
      desc: '47 patient records queried within 90 seconds, breaching baseline velocity controls (5 records / 30m).',
      action: () => {
        setCurrentView('EHR Security');
        simulateAttack('Bulk Access');
      },
      actionLabel: 'View Velocity Tripwire',
    },
    {
      step: 10,
      title: 'Correlation Engine Fuses Signals',
      system: 'SOC Correlation Core',
      view: 'Overview',
      icon: CheckCircle2,
      desc: 'CareSentinel automatically links all 9 multi-vector telemetry signals into a single unified incident.',
      action: () => setCurrentView('Overview'),
      actionLabel: 'View Security Posture Drop',
    },
    {
      step: 11,
      title: 'Critical Incident Created',
      system: 'Incident Management',
      view: 'Incidents',
      icon: ShieldAlert,
      desc: 'Incident INC-001 is synthesized with risk score 94/100 and complete attack timeline.',
      action: () => {
        selectIncident('INC-001');
        setCurrentView('Incidents');
      },
      actionLabel: 'Open Incident Investigation',
    },
    {
      step: 12,
      title: 'Investigator Reviews Evidence',
      system: 'Investigation Desk',
      view: 'Incidents',
      icon: FileText,
      desc: 'SOC analyst reviews forensic evidence, affected systems, and deterministic risk attribution.',
      action: () => {
        selectIncident('INC-001');
        setCurrentView('Incidents');
      },
      actionLabel: 'Examine Evidence Timeline',
    },
    {
      step: 13,
      title: 'Simulated Rapid Containment',
      system: 'Clinical Containment',
      view: 'Incidents',
      icon: CheckCircle,
      desc: 'Operator isolates simulated rogue client, revokes active EHR tokens, and blocks phishing domains.',
      action: () => {
        selectIncident('INC-001');
        setCurrentView('Incidents');
      },
      actionLabel: 'Execute Containment Playbook',
    },
    {
      step: 14,
      title: 'Audit Record Committed to Ledger',
      system: 'Audit Core',
      view: 'Audit Ledger',
      icon: CheckCircle2,
      desc: 'All detection events and clinical containment actions are verifiably recorded for HIPAA governance.',
      action: () => setCurrentView('Audit Ledger'),
      actionLabel: 'Inspect Audit Ledger',
    },
  ];

  const current = demoSteps[currentStep];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      demoSteps[nextStep].action();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      demoSteps[prevStep].action();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div className="card" style={{
        maxWidth: '640px',
        width: '100%',
        padding: '2rem',
        borderRadius: '16px',
        backgroundColor: 'white',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="badge bg-accent-light" style={{ fontSize: '0.75rem' }}>
              STEP {current.step} OF 14
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Guided Clinical Demo
            </span>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Step Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              {current.system}
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {current.title}
            </h2>
          </div>
        </div>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          {current.desc}
        </p>

        {/* Progress bar */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span>Demonstration Progress</span>
            <span>{Math.round(((currentStep + 1) / demoSteps.length) * 100)}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${((currentStep + 1) / demoSteps.length) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--accent-primary)',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="btn btn-secondary"
            style={{ opacity: currentStep === 0 ? 0.4 : 1 }}
          >
            <ArrowLeft size={16} /> Previous
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => {
                current.action();
              }}
              className="btn btn-outline"
              style={{ fontSize: '0.85rem' }}
            >
              {current.actionLabel}
            </button>

            {currentStep < demoSteps.length - 1 ? (
              <button
                onClick={handleNext}
                className="btn btn-primary"
              >
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="btn btn-primary"
                style={{ backgroundColor: 'var(--positive)' }}
              >
                Complete Tour <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
