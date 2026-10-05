import { useState } from 'react';
import { 
  Shield, 
  ArrowRight, 
  ShieldAlert, 
  Mail, 
  Link as LinkIcon, 
  Users, 
  Network, 
  Activity, 
  Play, 
  CheckCircle2, 
  Layers, 
  Search, 
  FileText, 
  Lock, 
  Terminal,
  ChevronRight
} from 'lucide-react';
import { useSetAppMode, useSetCurrentView, useSetPublicPage } from '../../store/store';
import AcidSquares from '../../components/effects/AcidSquares';

export function PublicHome() {
  const setAppMode = useSetAppMode();
  const setCurrentView = useSetCurrentView();
  const setPublicPage = useSetPublicPage();

  const [activeStep, setActiveStep] = useState(2); // CORRELATE by default

  const workflowSteps = [
    {
      name: 'PREVENT',
      icon: Shield,
      summary: 'Proactive email defenses, LinkGuard domain sandboxing, and attachment heuristic inspection.',
      detail: 'Stops weaponized patient billing lures, look-alike domain permutations, and script-embedded zip archives before clinical workstations can interact with malicious payloads.',
      tag: 'Edge Prevention'
    },
    {
      name: 'DETECT',
      icon: Search,
      summary: 'Continuously monitors clinical logins, unusual network telemetry, and cross-department EHR accesses.',
      detail: 'Identifies behavioral anomalies such as off-hours logins from unrecognized hardware or access to patient charts with no charted physician-patient relationship.',
      tag: 'Continuous Detection'
    },
    {
      name: 'CORRELATE',
      icon: Layers,
      summary: 'Fuses isolated alerts across email, IAM, network, and EHR layers into cohesive incidents.',
      detail: 'A phishing email, credential harvesting event, port scan, and subsequent bulk record query are recognized as one interconnected intrusion rather than disjointed noise.',
      tag: 'Multi-Vector Synthesis'
    },
    {
      name: 'EXPLAIN',
      icon: FileText,
      summary: 'Deterministic, explainable risk calculations that highlight exactly why a threat is elevated.',
      detail: 'No opaque black-box AI scores. Clear attribution: +20 unusual login, +18 look-alike domain, +22 bulk velocity anomaly, complete with evidentiary signals.',
      tag: 'Explainable Logic'
    },
    {
      name: 'RESPOND',
      icon: Terminal,
      summary: 'Simulated rapid containment actions to protect patient care without causing clinical disruptions.',
      detail: 'One-click isolation of rogue endpoints, revocation of compromised EHR session tokens, automated domain blocking in LinkGuard, and account flagging.',
      tag: 'Clinical Containment'
    },
    {
      name: 'AUDIT',
      icon: CheckCircle2,
      summary: 'Chronological, traceable ledger of all detections, clinical accesses, and responder actions.',
      detail: 'Full forensic traceability supporting HIPAA-oriented auditability, break-glass justification documentation, and historical incident review.',
      tag: 'Forensic Auditability'
    },
  ];

  const attackChainSteps = [
    { label: 'Phishing Email', category: 'Email Gateway', icon: Mail },
    { label: 'Malicious Link', category: 'LinkGuard', icon: LinkIcon },
    { label: 'Credential Compromise', category: 'Identity Telemetry', icon: Lock },
    { label: 'Unusual Login', category: 'IAM Provider', icon: Users },
    { label: 'Subnet Port Scan', category: 'NIDS Firewall', icon: Network },
    { label: 'EHR Access Anomaly', category: 'EHR Sentry', icon: Activity },
    { label: 'Bulk Record Access', category: 'EHR Velocity', icon: ShieldAlert },
    { label: 'Correlated Incident', category: 'CareSentinel Core', icon: Shield },
  ];

  const enterConsole = (view: string = 'Overview') => {
    setAppMode('console');
    setCurrentView(view);
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-main)' }}>
      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '720px',
        padding: '5rem 2rem 6rem 2rem',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, #ffffff 0%, #f0f7fc 100%)',
      }}>
        {/* Interactive AcidSquares shader background */}
        <div aria-hidden="true" className="public-home-hero-acid">
          <AcidSquares
            color1="#5227FF"
            color2="#A855F7"
            color3="#FFFFFF"
            detail="medium"
            speed={0.7}
            waveDepth={1}
            zoom={1.3}
            density={10.0}
            glow={1.0}
            exposure={2700}
            spread={0.3}
            stepSize={0.002}
            colorShift={0}
            contrast={1}
            brightness={1.0}
            opacity={1.0}
            mouseInteraction={true}
            mouseStrength={0.1}
            mouseRadius={0.35}
            blur={0}
            grain={true}
            grainIntensity={0.05}
          />
        </div>

        {/* Readability veil keeps the healthcare UI light while preserving the shader depth. */}
        <div aria-hidden="true" className="public-home-hero-acid-veil" />
        {/* Subtle clinical grid remains above the shader as a restrained texture. */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          backgroundImage: 'radial-gradient(#0284c7 0.65px, transparent 0.65px), radial-gradient(#0d9488 0.65px, #f0f7fc 0.65px)',
          backgroundSize: '26px 26px',
          backgroundPosition: '0 0, 13px 13px',
          opacity: 0.10,
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(2, 132, 199, 0.1)',
                border: '1px solid rgba(2, 132, 199, 0.25)',
                color: 'var(--accent-primary)',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '1.5rem',
              }}>
                <Shield size={14} /> DEMO MODE — Synthetic Hospital Environment
              </div>

              <h1 style={{
                fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.12,
                marginBottom: '1.25rem',
                letterSpacing: '-0.03em',
              }}>
                Clinical Security <span style={{ color: 'var(--accent-primary)' }}>Intelligence</span>
              </h1>

              <p style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '580px',
              }}>
                Protecting the systems behind modern healthcare. CareSentinel connects email, identity, network, application, and clinical access signals into one unified security intelligence layer.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <button
                  onClick={() => enterConsole('Overview')}
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)' }}
                >
                  Explore Platform <ArrowRight size={17} />
                </button>

                <button
                  onClick={() => setPublicPage('security')}
                  className="btn btn-secondary"
                  style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}
                >
                  View Security Architecture
                </button>

                <button
                  onClick={() => enterConsole('Attack Simulator')}
                  className="btn btn-outline"
                  style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem', color: 'var(--critical)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                >
                  <Play size={16} /> Run Kill-Chain Demo
                </button>
              </div>

              <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="var(--positive)" /> Deterministic Risk Engine
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="var(--positive)" /> Cross-Domain Correlation
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="var(--positive)" /> Synthetic HIPAA Testbed
                </div>
              </div>
            </div>

            {/* Interactive Hero Preview Card with Floating Chips */}
            <div style={{ position: 'relative' }}>
              {/* Floating UI Chips */}
              <div className="animate-float" style={{
                position: 'absolute',
                top: '-20px',
                right: '10px',
                backgroundColor: 'white',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                boxShadow: 'var(--shadow-md)',
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                zIndex: 20,
              }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--critical)' }}></div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--critical)' }}>Threat Detected</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Look-alike domain pattern</div>
                </div>
              </div>

              <div className="animate-float" style={{
                position: 'absolute',
                bottom: '-15px',
                left: '-15px',
                backgroundColor: 'white',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                boxShadow: 'var(--shadow-md)',
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                zIndex: 20,
                animationDelay: '1.5s',
              }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}></div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)' }}>Identity Anomaly</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Rogue device IP 192.168.1.100</div>
                </div>
              </div>

              <div className="animate-float" style={{
                position: 'absolute',
                bottom: '80px',
                right: '-20px',
                backgroundColor: 'white',
                border: '1px solid rgba(2, 132, 199, 0.3)',
                boxShadow: 'var(--shadow-md)',
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                zIndex: 20,
                animationDelay: '2.5s',
              }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}></div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>EHR Monitored</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>47 records / 90s velocity</div>
                </div>
              </div>

              {/* Main Preview Glass Card */}
              <div className="card perspective-panel" style={{
                borderRadius: '16px',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-lg)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                      Northstar SOC • Synthetic Telemetry
                    </span>
                  </div>
                  <span className="badge bg-critical-light">Illustrative Incident • Risk 94/100</span>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Active Multi-Vector Sequence
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    Account Compromise & Bulk Clinical Query
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Affected: Dr. Sarah Wilson • Systems: Email, LinkGuard, IAM, EHR
                  </div>
                </div>

                {/* Micro timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', padding: '0.5rem', backgroundColor: 'var(--bg-main)', borderRadius: '6px' }}>
                    <Mail size={16} color="var(--warning)" />
                    <span style={{ flex: 1, fontWeight: 500 }}>Phishing email delivered</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>09:41</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', padding: '0.5rem', backgroundColor: 'var(--bg-main)', borderRadius: '6px' }}>
                    <LinkIcon size={16} color="var(--critical)" />
                    <span style={{ flex: 1, fontWeight: 500 }}>LinkGuard blocked credential harvesting URL</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>09:43</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', padding: '0.5rem', backgroundColor: 'var(--bg-main)', borderRadius: '6px' }}>
                    <Users size={16} color="var(--warning)" />
                    <span style={{ flex: 1, fontWeight: 500 }}>Unusual login from Rogue Device 192.168.1.100</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>09:45</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', padding: '0.5rem', backgroundColor: 'var(--bg-main)', borderRadius: '6px' }}>
                    <ShieldAlert size={16} color="var(--critical)" />
                    <span style={{ flex: 1, fontWeight: 500 }}>Bulk EHR query: 47 patient charts in 90 seconds</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>09:48</span>
                  </div>
                </div>

                <button
                  onClick={() => enterConsole('Incidents')}
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '0.875rem' }}
                >
                  Open Investigation Workspace <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW CARESENTINEL WORKS (PREVENT -> DETECT -> CORRELATE -> EXPLAIN -> RESPOND -> AUDIT) */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--accent-primary)',
            marginBottom: '0.5rem',
          }}>
            Operational Methodology
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            How CareSentinel Protects Healthcare Systems
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '640px', margin: '0.5rem auto 0 auto' }}>
            A disciplined, multi-layered progression from perimeter prevention to deterministic correlation and verifiable clinical audit trails.
          </p>
        </div>

        {/* Steps Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {workflowSteps.map((step, idx) => {
            const active = activeStep === idx;
            const Icon = step.icon;
            return (
              <button
                key={step.name}
                onClick={() => setActiveStep(idx)}
                style={{
                  backgroundColor: active ? 'white' : 'var(--bg-card)',
                  border: active ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1.25rem 1rem',
                  textAlign: 'left',
                  boxShadow: active ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: active ? 'var(--accent-primary)' : 'var(--bg-hover)',
                  color: active ? 'white' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                }}>
                  <Icon size={18} />
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.2rem' }}>
                  STEP 0{idx + 1}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {step.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Explanation */}
        <div className="card" style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '14px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent-primary)',
                padding: '0.5rem',
                borderRadius: '8px',
              }}>
                {(() => {
                  const StepIcon = workflowSteps[activeStep].icon;
                  return <StepIcon size={24} />;
                })()}
              </div>
              <div>
                <span className="badge bg-accent-light" style={{ marginBottom: '0.25rem' }}>
                  {workflowSteps[activeStep].tag}
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>
                  Phase {activeStep + 1}: {workflowSteps[activeStep].name}
                </h3>
              </div>
            </div>
            <button
              onClick={() => enterConsole(activeStep === 0 ? 'Email Security' : activeStep === 1 ? 'Identity' : activeStep === 2 ? 'Attack Simulator' : activeStep === 3 ? 'Overview' : activeStep === 4 ? 'Incidents' : 'Audit Ledger')}
              className="btn btn-outline"
              style={{ fontSize: '0.85rem' }}
            >
              Test in Console <ChevronRight size={16} />
            </button>
          </div>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.75rem' }}>
            {workflowSteps[activeStep].summary}
          </p>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {workflowSteps[activeStep].detail}
          </p>
        </div>
      </section>

      {/* THE ATTACK CHAIN FLOWCHART VISUALIZATION */}
      <section style={{
        padding: '5rem 2rem',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', gap: '1rem' }}>
            <div>
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--accent-primary)',
                marginBottom: '0.4rem',
              }}>
                Multi-Signal Correlation
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Interactive Clinical Attack Chain
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', marginTop: '0.35rem' }}>
                Hospitals face attacks disguised across seemingly disconnected signals. CareSentinel correlates the entire progression into an explainable incident.
              </p>
            </div>

            <button
              onClick={() => {
                enterConsole('Attack Simulator');
              }}
              className="btn btn-primary"
              style={{ backgroundColor: 'var(--critical)' }}
            >
              <Play size={16} /> Launch Attack Simulator
            </button>
          </div>

          {/* Interactive Stepper Visual */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.75rem',
            marginBottom: '2rem',
          }}>
            {attackChainSteps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === attackChainSteps.length - 1;
              return (
                <div
                  key={step.label}
                  style={{
                    backgroundColor: isLast ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-main)',
                    border: isLast ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '1rem 0.75rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isLast ? 'var(--critical)' : 'white',
                    color: isLast ? 'white' : 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    SIGNAL 0{idx + 1}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {step.category}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Synthesis Note */}
          <div style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: 'var(--bg-hover)',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Layers size={20} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                These signals are not isolated anomalies. CareSentinel automatically correlates them to prevent alert fatigue.
              </span>
            </div>
            <button
              onClick={() => enterConsole('Incidents')}
              style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              View Active Incidents <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SHOWCASE */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--accent-primary)',
            marginBottom: '0.5rem',
          }}>
            Comprehensive Clinical Defense
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Integrated Security Modules
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '640px', margin: '0.5rem auto 0 auto' }}>
            Built specifically for the operational reality of hospital environments, medical personnel, and sensitive patient records.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Card 1: Email Security */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '0.5rem', borderRadius: '8px' }}>
                <Mail size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Email Security & Look-alike Detection</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Monitors clinical inboxes for deceptive sender domains, display-name spoofing, and urgent billing lures aimed at physicians.
            </p>
            <button onClick={() => enterConsole('Email Security')} style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Inspect Email Sentry <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 2: LinkGuard */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: 'var(--accent-secondary)', padding: '0.5rem', borderRadius: '8px' }}>
                <LinkIcon size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>LinkGuard URL Inspection</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Real-time deep analysis of embedded links: domain entropy, redirect chains, port validation, and credential-harvesting indicators.
            </p>
            <button onClick={() => enterConsole('LinkGuard')} style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Open LinkGuard Scanner <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 3: EHR Security */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'var(--critical-bg)', color: 'var(--critical)', padding: '0.5rem', borderRadius: '8px' }}>
                <Activity size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>EHR Sentry & Bulk Access</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Tracks record access velocity, physician-patient department relationships, and audited emergency break-glass sessions.
            </p>
            <button onClick={() => enterConsole('EHR Security')} style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View EHR Sentry <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 4: Identity & Access */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning)', padding: '0.5rem', borderRadius: '8px' }}>
                <Users size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Identity Behavioral Sentry</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Detects authentication outside scheduled clinical shift windows, unknown hardware logins, and credential compromise signals.
            </p>
            <button onClick={() => enterConsole('Identity')} style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Explore Identity View <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 5: Network Intrusion */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '0.5rem', borderRadius: '8px' }}>
                <Network size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Clinical Network Intrusion</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Synthetic NIDS telemetry monitoring clinical subnets for reconnaissance port scans, brute-force attempts, and lateral probes.
            </p>
            <button onClick={() => enterConsole('Network')} style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Inspect Network Topology <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 6: Audit Ledger */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'var(--positive-bg)', color: 'var(--positive)', padding: '0.5rem', borderRadius: '8px' }}>
                <CheckCircle2 size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Audit Ledger & Compliance</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Verifiable, chronological audit ledger tracking every detection, automated quarantine, break-glass review, and investigator action.
            </p>
            <button onClick={() => enterConsole('Audit Ledger')} style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View Audit Ledger <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* SYNTHETIC ENVIRONMENT NOTICE BANNER */}
      <section style={{
        padding: '3rem 2rem',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          backgroundColor: 'var(--bg-main)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
        }}>
          <div style={{ maxWidth: '720px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <Shield size={18} /> SYNTHETIC DEMONSTRATION ENVIRONMENT
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Northstar Medical Center Prototype
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              All doctor accounts, patient records, email communications, and security telemetry presented in this prototype are entirely synthetic. This environment demonstrates how CareSentinel connects clinical signals without exposing or accessing real hospital systems.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => enterConsole('Overview')}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              Enter Security Console <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setPublicPage('security')}
              className="btn btn-secondary"
            >
              Architecture Specs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
