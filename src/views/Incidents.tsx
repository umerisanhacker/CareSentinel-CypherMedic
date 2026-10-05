import { useState } from 'react';
import { 
  useIncidents, 
  useEvents, 
  useStore, 
  useSelectIncident, 
  useUpdateIncidentStatus,
  useAddIncidentNote,
  useFlagUser,
  useSafeContainDevice,
  useQuarantineEmail
} from '../store/store';
import { 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft,
  Loader2, 
  User, 
  Check, 
  Plus, 
  MessageSquare,
  ChevronRight,
  ArrowRight,
  Mail,
  HeartPulse
} from 'lucide-react';
import { DecisionBadge, deriveDecisionStatus } from '../components/security/DecisionBadge';

export default function Incidents() {
  const incidents = useIncidents();
  const events = useEvents();
  const { state } = useStore();
  const selectIncident = useSelectIncident();
  const updateStatus = useUpdateIncidentStatus();
  const addNote = useAddIncidentNote();
  const flagUser = useFlagUser();
  const safeContainDevice = useSafeContainDevice();
  const quarantineEmail = useQuarantineEmail();
  const isIncidentResponse = state.workspaceRole === 'incident_response';

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newNoteText, setNewNoteText] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<{
    type: 'contained' | 'resolved';
    title: string;
    steps: { label: string; detail: string }[];
    current: number;
    running: boolean;
    completed: boolean;
  } | null>(null);

  // Selected incident ID from state or local
  const activeIncident = incidents.find(i => i.id === state.selectedIncidentId) || null;
  const activeClinicalEvent = activeIncident
    ? events.find(e => activeIncident.eventIds.includes(e.id) && e.deviceId)
    : undefined;
  const activeClinicalDevice = activeClinicalEvent
    ? state.devices.find(d => d.id === activeClinicalEvent.deviceId)
    : undefined;

  const filteredIncidents = incidents.filter(i => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return i.status === 'active' || i.status === 'investigating' || i.status === 'new';
    if (filterStatus === 'contained') return i.status === 'contained';
    if (filterStatus === 'resolved') return i.status === 'resolved';
    return i.status === filterStatus;
  });

  const handleAction = (actionName: string, execute: () => void) => {
    execute();
    setActionFeedback(`Simulated Action Executed: ${actionName}`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const runResponseWorkflow = async (type: 'contained' | 'resolved', deviceId?: string, emailId?: string) => {
    if (!activeIncident) return;

    const steps = type === 'contained'
      ? [
          { label: 'Identify affected account', detail: `Locate ${activeIncident.affectedUserId || 'the affected synthetic account'} and bind the response to this incident.` },
          { label: 'Validate active session context', detail: 'Verify the correlated authentication/session evidence before containment.' },
          { label: 'Evaluate containment controls', detail: 'Check available synthetic identity, device and email controls linked to this incident.' },
          { label: 'Enforce account containment', detail: 'Flag the affected account and enforce credential reset when an affected account is present.' },
          { label: 'Revoke active sessions', detail: 'Invalidate the synthetic active sessions/tokens associated with the affected identity.' },
          { label: 'Apply related asset controls', detail: 'Isolate a correlated device and quarantine a related email when those signals exist.' },
          { label: 'Transition incident state', detail: 'Move the shared incident lifecycle state to CONTAINED.' },
          { label: 'Recalculate security posture', detail: 'Recalculate the synthetic risk/posture after containment controls are applied.' },
          { label: 'Write audit verification', detail: 'Record the containment action, actor, timestamp and outcome in the audit trail.' },
        ]
      : [
          { label: 'Verify containment state', detail: 'Confirm the incident is already contained before final closure.' },
          { label: 'Review correlated evidence', detail: 'Re-check the incident timeline and all correlated synthetic signals.' },
          { label: 'Verify account protection', detail: 'Confirm affected identity controls and active-session containment remain in place.' },
          { label: 'Verify related assets', detail: 'Confirm linked device, network and email controls are no longer exposing the incident.' },
          { label: 'Check for continuing signals', detail: 'Confirm no new correlated telemetry is keeping the incident active.' },
          { label: 'Validate investigation notes', detail: 'Confirm the investigation record contains the analyst findings and response context.' },
          { label: 'Confirm recovery readiness', detail: 'Verify the synthetic environment is ready for incident closure.' },
          { label: 'Transition incident state', detail: 'Move the shared incident lifecycle state to RESOLVED.' },
          { label: 'Write resolution audit record', detail: 'Record the final verification, actor, timestamp and closure outcome.' },
        ];

    setWorkflow({ type, title: type === 'contained' ? 'Containment Playbook' : 'Resolution Verification', steps, current: 0, running: true, completed: false });

    for (let index = 0; index < steps.length; index += 1) {
      await new Promise(resolve => setTimeout(resolve, 650));
      setWorkflow(previous => previous ? { ...previous, current: index + 1 } : previous);

      if (index === 3 && type === 'contained' && activeIncident.affectedUserId) {
        flagUser(activeIncident.affectedUserId, 'Synthetic incident containment playbook');
      }
      if (index === 5 && type === 'contained') {
        if (deviceId) {
          const deviceEvent = incidentEvents.find(e => e.deviceId === deviceId);
          if (deviceEvent) safeContainDevice(deviceId, deviceEvent.id);
        }
        if (emailId) quarantineEmail(emailId, 'Synthetic incident containment playbook');
      }
      if (index === 7) {
        updateStatus(activeIncident.id, type === 'contained' ? 'contained' : 'resolved');
      }
    }

    await new Promise(resolve => setTimeout(resolve, 350));
    setWorkflow(previous => previous ? { ...previous, running: false, completed: true } : previous);
    setActionFeedback(type === 'contained' ? 'Threat contained successfully — shared incident state updated.' : 'Incident fully resolved — shared incident state updated.');
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeIncident) return;
    addNote(activeIncident.id, newNoteText.trim(), 'SOC Lead (Investigator)');
    setNewNoteText('');
  };

  // Detailed Investigation Workspace
  if (activeIncident) {
    const incidentEvents = events.filter(e => activeIncident.eventIds.includes(e.id))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const incidentUserId = activeIncident.affectedUserId;
    const relatedNetworkEvent = incidentEvents.find(e => e.category === 'network' && e.deviceId);
    const derivedDeviceId = relatedNetworkEvent?.deviceId || (
      relatedNetworkEvent?.metadata?.sourceIP
        ? state.devices.find(d => d.ip === String(relatedNetworkEvent.metadata.sourceIP))?.id
        : undefined
    );
    const relatedEmailEvent = incidentEvents.find(e => e.category === 'email');
    const relatedEmail = relatedEmailEvent
      ? state.emails.find(email => relatedEmailEvent.actor && email.recipientName === relatedEmailEvent.actor && email.status !== 'quarantined')
        || state.emails.find(email => email.risk === 'high' || email.risk === 'critical')
      : undefined;
    const incidentResolved = activeIncident.status === 'resolved';
    const incidentContained = activeIncident.status === 'contained';
    const canContain = !incidentResolved && !incidentContained;
    const canResolve = incidentContained && !incidentResolved;
    const canExecutePlaybooks = !incidentResolved;
    const canEscalate = !isIncidentResponse && !incidentResolved && activeIncident.status !== 'escalated';
    const hasCredentialCompromise = incidentEvents.some(e => e.eventType === 'CREDENTIAL_COMPROMISE');
    const hasUnusualLogin = incidentEvents.some(e => e.eventType === 'UNUSUAL_LOGIN' || e.eventType === 'UNKNOWN_DEVICE');
    const assessment = activeIncident.riskScore >= 80
      ? { label: 'LIKELY COMPROMISE', confidence: 'HIGH', tone: 'var(--critical)', bg: 'var(--critical-bg)', recommendation: hasCredentialCompromise ? 'Flag the affected account and revoke active tokens, then validate the session and correlated clinical activity.' : 'Contain the affected asset and validate the correlated telemetry before resolving.' }
      : activeIncident.riskScore >= 60
        ? { label: 'SUSPICIOUS ACTIVITY', confidence: 'MODERATE', tone: 'var(--warning)', bg: 'var(--warning-bg)', recommendation: hasUnusualLogin ? 'Investigate the login context, device identity and network origin before deciding on account containment.' : 'Continue evidence collection and correlate additional telemetry before taking irreversible response actions.' }
        : { label: 'INCONCLUSIVE', confidence: 'LOW', tone: 'var(--accent-primary)', bg: 'var(--accent-light)', recommendation: 'Gather more evidence and avoid declaring compromise until the telemetry supports a response decision.' };

    const clinicalSafetyPanel = activeClinicalEvent && activeClinicalDevice ? (
    <div className="card" style={{ padding: '1.1rem 1.25rem', background: '#fffaf5', border: '1px solid #fed7aa', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.7rem' }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, display: 'grid', placeItems: 'center', background: '#ffedd5', color: '#c2410c' }}><HeartPulse size={18} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '.68rem', fontWeight: 850, color: '#9a3412', textTransform: 'uppercase', letterSpacing: '.05em' }}>Clinical Safety Context</div>
          <div style={{ fontSize: '.9rem', fontWeight: 850, marginTop: '.2rem' }}>{activeClinicalDevice.name} is part of this incident</div>
          <div style={{ fontSize: '.74rem', color: '#7c2d12', lineHeight: 1.5, marginTop: '.3rem' }}>
            Patient connected: <strong>{activeClinicalDevice.patientConnected ? 'Yes' : 'No'}</strong> · Physician: <strong>{activeClinicalDevice.assignedPhysician || 'Clinical team'}</strong> · Biomedical: <strong>{activeClinicalDevice.assignedBiomedicalEngineer || 'Biomedical Engineering'}</strong>
          </div>
          <div style={{ fontSize: '.74rem', color: '#7c2d12', marginTop: '.35rem' }}>
            Recommended posture: preserve clinical operation and contain the malicious path upstream where the safety envelope allows it.
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
      <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {clinicalSafetyPanel}

      {/* Top Back Navigation & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <button 
            onClick={() => selectIncident(null)}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} /> Back to Incident Queue
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Incident Lifecycle Status:
            </span>
            <span
              className={incidentResolved ? 'badge bg-positive-light' : incidentContained ? 'badge bg-warning-light' : 'badge bg-accent-light'}
              style={{ textTransform: 'uppercase', letterSpacing: '.02em' }}
              title="Read-only current state. Use the response actions below to change the incident lifecycle."
            >
              {activeIncident.status}
            </span>
            <span style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>
              Current state
            </span>
          </div>        </div>

        {workflow && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="response-workflow-title"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2000,
              background: 'rgba(10, 25, 41, 0.38)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <div className="card" style={{
              width: 'min(680px, 100%)',
              maxHeight: 'min(760px, calc(100vh - 2rem))',
              overflowY: 'auto',
              background: 'white',
              padding: '1.5rem',
              boxShadow: '0 24px 70px rgba(15, 39, 64, .22)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.15rem' }}>
                <div>
                  <div style={{ fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', color: workflow.type === 'contained' ? 'var(--warning)' : 'var(--positive)' }}>
                    Synthetic Response Execution
                  </div>
                  <h2 id="response-workflow-title" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '.2rem' }}>
                    {workflow.title}
                  </h2>
                  <p style={{ fontSize: '.78rem', color: 'var(--text-secondary)', marginTop: '.25rem' }}>
                    CareSentinel is executing each verification and response operation against the synthetic hospital environment.
                  </p>
                </div>
                <span className="badge" style={{
                  background: workflow.completed ? 'var(--positive-bg)' : 'var(--accent-light)',
                  color: workflow.completed ? 'var(--positive)' : 'var(--accent-primary)',
                  whiteSpace: 'nowrap',
                }}>
                  {workflow.completed ? 'COMPLETED' : `STEP ${Math.min(workflow.current + 1, workflow.steps.length)} / ${workflow.steps.length}`}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
                {workflow.steps.map((step, index) => {
                  const done = workflow.completed || index < workflow.current;
                  const running = !workflow.completed && index === workflow.current;
                  return (
                    <div key={step.label} style={{
                      display: 'grid',
                      gridTemplateColumns: '30px minmax(0, 1fr) 28px',
                      gap: '.75rem',
                      alignItems: 'center',
                      padding: '.72rem .8rem',
                      borderRadius: '10px',
                      border: `1px solid ${running ? 'rgba(0,145,180,.28)' : done ? 'rgba(18,150,111,.18)' : 'var(--border)'}`,
                      background: running ? 'var(--accent-light)' : done ? 'var(--positive-bg)' : 'var(--bg-main)',
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: done ? 'var(--positive)' : running ? 'white' : 'white',
                        color: done ? 'white' : 'var(--text-muted)',
                        border: running ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                        fontSize: '.7rem',
                        fontWeight: 800,
                      }}>
                        {done ? <CheckCircle2 size={15} /> : index + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: '.82rem', fontWeight: 750, color: 'var(--text-primary)' }}>{step.label}</div>
                        <div style={{ fontSize: '.7rem', color: 'var(--text-secondary)', marginTop: '.12rem', lineHeight: 1.35 }}>{step.detail}</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {running ? <Loader2 size={18} color="var(--accent-primary)" style={{ animation: 'caresentinel-spin 0.9s linear infinite' }} /> : done ? <CheckCircle2 size={17} color="var(--positive)" /> : <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border)' }} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {workflow.completed && (
                <div style={{ marginTop: '1rem', padding: '.8rem .9rem', borderRadius: '9px', background: 'var(--positive-bg)', border: '1px solid rgba(18,150,111,.2)', color: 'var(--positive)', fontSize: '.8rem', fontWeight: 700 }}>
                  <CheckCircle2 size={16} style={{ verticalAlign: 'middle', marginRight: '.4rem' }} />
                  {workflow.type === 'contained'
                    ? 'Containment completed. The incident is now CONTAINED and remains available for investigation/recovery.'
                    : 'Resolution verification completed. The incident is now RESOLVED across all CareSentinel workspaces.'}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.1rem' }}>
                <button
                  className="btn btn-secondary"
                  disabled={workflow.running}
                  onClick={() => setWorkflow(null)}
                >
                  {workflow.running ? 'Executing…' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action feedback banner */}
        {actionFeedback && (
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
            <CheckCircle2 size={16} /> {actionFeedback} (Safe Demo Mode)
          </div>
        )}

        {/* Incident Summary Banner */}
        <div className="card" style={{ padding: '2rem', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span className={`badge ${activeIncident.severity === 'critical' ? 'bg-critical-light' : 'bg-warning-light'}`} style={{ textTransform: 'uppercase' }}>
                  {activeIncident.severity} Severity
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {activeIncident.id}
                </span>
                <span className="badge bg-accent-light" style={{ textTransform: 'uppercase' }}>
                  {activeIncident.status}
                </span>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeIncident.title}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem', maxWidth: '800px', lineHeight: 1.5 }}>
                {activeIncident.description}
              </p>
            </div>

            <div style={{
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Incident Risk Score
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: activeIncident.riskScore >= 80 ? 'var(--critical)' : 'var(--warning)', lineHeight: 1, marginTop: '0.2rem' }}>
                {activeIncident.riskScore}
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Deterministic Correlation
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)',
            fontSize: '0.85rem',
          }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Affected Account</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {activeIncident.affectedUserId || 'Unknown'}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Affected Clinical Systems</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {activeIncident.affectedSystems.join(', ')}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Assigned Investigator</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {activeIncident.assignedInvestigator || 'SOC Lead Analyst'}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Created Timestamp</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {new Date(activeIncident.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Workspace: Left = Evidence & Timeline, Right = Actions & Notes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {/* Left Column: Forensic Attack Timeline & Evidence */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Timeline */}
            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Correlated Attack Timeline
                </h3>
                <span className="badge bg-accent-light">{incidentEvents.length} Signals Fused</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                {incidentEvents.map((evt, idx) => (
                  <div key={evt.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: evt.severity === 'critical' ? 'var(--critical)' : 'var(--accent-primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}>
                        {idx + 1}
                      </div>
                      {idx < incidentEvents.length - 1 && (
                        <div style={{ width: '2px', height: '40px', backgroundColor: 'var(--border)', margin: '4px 0' }} />
                      )}
                    </div>

                    <div style={{
                      flex: 1,
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                          {evt.title}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          <DecisionBadge status={deriveDecisionStatus(evt)} />
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {evt.description}
                      </p>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>System: <strong>{evt.system}</strong></span>
                        <span>Category: <strong>{evt.category}</strong></span>
                        <span style={{ color: 'var(--critical)', fontWeight: 600 }}>+{evt.riskContribution} Risk</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contributing Risk Factors */}
            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Contributing Signal Attribution
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {activeIncident.riskFactors.map(rf => (
                  <div key={rf.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                  }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {rf.label}
                    </span>
                    <span className="badge bg-critical-light" style={{ fontSize: '0.78rem' }}>
                      +{rf.deduction} Points
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Safe Response Playbooks & Investigation Notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Analyst Assessment & Decision Gate */}
            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'white', borderLeft: `4px solid ${assessment.tone}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.9rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Analyst Assessment
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {assessment.label}
                  </div>
                </div>
                <span className="badge" style={{ background: assessment.bg, color: assessment.tone, border: `1px solid ${assessment.tone}33` }}>
                  {assessment.confidence} CONFIDENCE
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.8rem' }}>
                CareSentinel does not label a person as a “hacker” from a single signal. The analyst makes that determination from correlated telemetry, identity context, device/network evidence and clinical access history.
              </p>
              <div style={{ padding: '0.8rem 0.9rem', borderRadius: '9px', background: 'var(--bg-main)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Recommended next step:</strong> {assessment.recommendation}
              </div>
            </div>

            {/* Role-specific response / investigation actions */}
            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {isIncidentResponse ? 'Incident Response Actions' : 'Investigation Actions'}
                </h3>
                <span className="badge" style={{
                  background: isIncidentResponse ? '#f3e8ff' : 'var(--accent-light)',
                  color: isIncidentResponse ? '#7c3aed' : 'var(--accent-primary)'
                }}>
                  {isIncidentResponse ? 'IR WORKSPACE' : 'SOC WORKSPACE'}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                {isIncidentResponse
                  ? 'Coordinate containment, account protection, recovery and final closure. All actions update the shared incident state and audit trail.'
                  : 'Collect evidence, assess the signal and document findings. The SOC does not execute containment or closure; escalate the case to Incident Response when intervention is required.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {canExecutePlaybooks && (<button
                  onClick={() => derivedDeviceId && handleAction(`Isolate Device ${derivedDeviceId}`, () => isolateDevice(derivedDeviceId))}
                  className="btn btn-outline"
                  disabled={!derivedDeviceId}
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--critical)', opacity: derivedDeviceId ? 1 : 0.5 }}
                >
                  <ShieldAlert size={16} /> {derivedDeviceId ? `Isolate Simulated Device (${derivedDeviceId})` : 'No related device signal'}
                </button>)}
                {canExecutePlaybooks && (<button
                  onClick={() => incidentUserId && handleAction('Flag User Account & Enforce Credential Reset', () => flagUser(incidentUserId))}
                  className="btn btn-outline"
                  disabled={!incidentUserId}
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: 'var(--warning)', opacity: incidentUserId ? 1 : 0.5 }}
                >
                  <User size={16} /> {incidentUserId ? `Flag Account & Revoke Active Tokens (${incidentUserId})` : 'No affected account'}
                </button>)}
                {canExecutePlaybooks && (<button
                  onClick={() => relatedEmail && handleAction('Quarantine Related Email', () => quarantineEmail(relatedEmail.id))}
                  className="btn btn-outline"
                  disabled={!relatedEmail}
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem', opacity: relatedEmail ? 1 : 0.5 }}
                >
                  <Mail size={16} /> {relatedEmail ? `Quarantine Related Email (${relatedEmail.id})` : 'No related email'}
                </button>)}
                {canContain && (<button
                  onClick={() => runResponseWorkflow('contained', derivedDeviceId, relatedEmail?.id)}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem' }}
                >
                  <Check size={16} /> Mark Threat Contained
                </button>)}
                {canEscalate && (
                  <button
                    onClick={() => handleAction('Escalate to Incident Response', () => updateStatus(activeIncident.id, 'escalated'))}
                    className="btn btn-outline"
                    style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem', borderColor: 'rgba(124, 58, 237, 0.35)', color: '#7c3aed' }}
                  >
                    <ArrowRight size={16} /> Escalate to Incident Response Team
                  </button>
                )}
                {canResolve && (<button
                  onClick={() => runResponseWorkflow('resolved')}
                  className="btn btn-primary"
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem', backgroundColor: 'var(--positive)' }}
                >
                  <CheckCircle2 size={16} /> Mark Fully Resolved
                </button>)}
              </div>
 
                {incidentResolved && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.55rem',
                    padding: '.7rem .85rem',
                    borderRadius: '9px',
                    background: 'var(--positive-bg)',
                    border: '1px solid rgba(18,150,111,.22)',
                    color: 'var(--positive)',
                    fontSize: '.8rem',
                    fontWeight: 700,
                  }}>
                    <CheckCircle2 size={16} /> Incident fully resolved — no further response action required.
                  </div>
                )}
              </div>

            {/* Investigation Notes */}
            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <MessageSquare size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Investigation Notes ({activeIncident.notes?.length || 0})
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', maxHeight: '240px', overflowY: 'auto' }}>
                {activeIncident.notes?.map(note => (
                  <div key={note.id} style={{
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{note.author}</span>
                      <span>{new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {note.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add clinical investigation findings, containment notes, or forensic observations..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-end', fontSize: '0.825rem', padding: '0.45rem 1rem' }}
                >
                  <Plus size={14} /> Add Note
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Incident Queue List View
  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Incident Operations Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Triage, investigate, and contain multi-vector clinical threats correlated across hospital infrastructure.
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          padding: '0.25rem',
          borderRadius: '8px',
          border: '1px solid var(--border)',
        }}>
          {['all', 'active', 'investigating', 'contained', 'resolved'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: filterStatus === status ? 700 : 500,
                color: filterStatus === status ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: filterStatus === status ? 'var(--bg-hover)' : 'transparent',
                borderRadius: '6px',
                textTransform: 'capitalize',
                transition: 'all 0.15s ease',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Cards Queue */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredIncidents.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'white' }}>
            <CheckCircle2 size={36} color="var(--positive)" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>No Incidents Found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              No security incidents match the selected filter.
            </p>
          </div>
        ) : (
          filteredIncidents.map(inc => (
            <div
              key={inc.id}
              onClick={() => selectIncident(inc.id)}
              className="card"
              style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                borderLeft: `4px solid ${inc.severity === 'critical' ? 'var(--critical)' : 'var(--warning)'}`,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className={`badge ${inc.severity === 'critical' ? 'bg-critical-light' : 'bg-warning-light'}`} style={{ textTransform: 'uppercase' }}>
                    {inc.severity}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {inc.id}
                  </span>
                  <span className="badge bg-accent-light" style={{ textTransform: 'uppercase' }}>
                    {inc.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Risk Score
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: inc.riskScore >= 80 ? 'var(--critical)' : 'var(--warning)', lineHeight: 1 }}>
                      {inc.riskScore} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 100</span>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                {inc.title}
              </h2>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {inc.description}
              </p>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border)',
              }}>
                <div>
                  Affected Account: <strong style={{ color: 'var(--text-primary)' }}>{inc.affectedUserId || 'Unknown'}</strong>
                </div>
                <div>
                  Systems: <strong style={{ color: 'var(--text-primary)' }}>{inc.affectedSystems.join(', ')}</strong>
                </div>
                <div>
                  Signals: <strong style={{ color: 'var(--text-primary)' }}>{inc.eventIds.length} telemetry events</strong>
                </div>
                <div style={{ marginLeft: 'auto', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Open Detailed Investigation Workspace <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
