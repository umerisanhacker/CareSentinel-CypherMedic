import { useState } from 'react';
import { 
  useEmails, 
  useQuarantineEmail, 
  useReleaseEmail, 
  useSetCurrentView,
  useEvents
} from '../store/store';
import { DecisionBadge } from '../components/security/DecisionBadge';
import ActionNoteModal from '../components/security/ActionNoteModal';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Inbox, 
  Archive, 
  FileText, 
  Shield, 
  Search,
  ExternalLink
} from 'lucide-react';

export default function EmailSecurity() {
  const emails = useEmails();
  const quarantineEmail = useQuarantineEmail();
  const releaseEmail = useReleaseEmail();
  const setCurrentView = useSetCurrentView();
  const events = useEvents();

  const [activeTab, setActiveTab] = useState<'inbox' | 'quarantine' | 'analyzed' | 'policies'>('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(emails[0]?.id ?? null);
  const selectedEmail = emails.find(email => email.id === selectedEmailId) ?? emails[0] ?? null;
  const [searchFilter, setSearchFilter] = useState('');
  const [reviewAction, setReviewAction] = useState<'quarantine' | 'release' | null>(null);


  const latestSimulatedEmail = emails.find(em => em.id.startsWith('em-sim-'));
  const selectedEmailEvent = selectedEmail
    ? events.find(e => e.category === 'email' && e.actor === selectedEmail.recipientName && e.status !== 'resolved')
      || events.find(e => e.category === 'email' && e.actor === selectedEmail.recipientName)
    : undefined;

  const filteredEmails = emails.filter(em => {
    if (activeTab === 'inbox') return em.status === 'inbox';
    if (activeTab === 'quarantine') return em.status === 'quarantined';
    if (activeTab === 'analyzed') return true;
    return true;
  }).filter(em => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return em.subject.toLowerCase().includes(q) || em.sender.toLowerCase().includes(q) || em.recipient.toLowerCase().includes(q);
  });

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'critical':
        return <span className="badge bg-critical-light">CRITICAL RISK</span>;
      case 'high':
        return <span className="badge bg-warning-light">HIGH RISK</span>;
      case 'medium':
        return <span className="badge bg-accent-light">MEDIUM RISK</span>;
      default:
        return <span className="badge bg-positive-light">CLEAN (LOW)</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Email Security Gateway
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Inbound clinical mail inspection, look-alike domain heuristics, and sender authentication analysis.
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          padding: '0.25rem',
          borderRadius: '8px',
          border: '1px solid var(--border)',
        }}>
          {[
            { id: 'inbox', label: 'Inbox', icon: Inbox },
            { id: 'quarantine', label: 'Quarantine', icon: Archive },
            { id: 'analyzed', label: 'All Analyzed', icon: FileText },
            { id: 'policies', label: 'Security Policies', icon: Shield },
          ].map(tab => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  backgroundColor: active ? 'var(--bg-hover)' : 'transparent',
                  borderRadius: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {selectedEmail && (
        <ActionNoteModal
          open={reviewAction !== null}
          title={reviewAction === 'quarantine' ? `Review email — ${selectedEmail.subject}` : `Review release — ${selectedEmail.subject}`}
          description={reviewAction === 'quarantine'
            ? 'Confirm quarantine after reviewing sender, authentication, links, and attachment evidence.'
            : 'Confirm release after reviewing the message and false-positive indicators.'}
          actionLabel={reviewAction === 'quarantine' ? 'Quarantine Message' : 'Release to Inbox'}
          actionTone={reviewAction === 'quarantine' ? 'danger' : 'primary'}
          onCancel={() => setReviewAction(null)}
          onConfirm={(note) => {
            if (reviewAction === 'quarantine') {
              quarantineEmail(selectedEmail.id, note || 'Operator manual quarantine from Email Security view');
              setSelectedEmailId(null);
              setActiveTab('quarantine');
            } else {
              releaseEmail(selectedEmail.id, note || undefined);
              setSelectedEmailId(null);
              setActiveTab('inbox');
            }
            setReviewAction(null);
          }}
        />
      )}

      {latestSimulatedEmail && latestSimulatedEmail.id === emails[0]?.id && (
        <div className="card animate-fade-in" style={{
          padding: '1rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(239,68,68,0.07), rgba(2,132,199,0.05))',
          border: '1px solid rgba(239,68,68,0.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--critical-bg)', color: 'var(--critical)', display: 'grid', placeItems: 'center' }}>
              <AlertTriangle size={19} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--critical)', letterSpacing: '0.06em' }}>NEW SIMULATED EMAIL EVENT</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{latestSimulatedEmail.subject}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>Generated by Attack Simulator • Link + attachment inspection available</div>
            </div>
          </div>
          <span className="badge bg-critical-light">LIVE FROM CENTRAL STATE</span>
        </div>
      )}

      {activeTab === 'policies' ? (
        /* Policies Sub-view */
        <div className="card" style={{ padding: '2rem', backgroundColor: 'white' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Hospital Inbound Email Defense Policies
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-main)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>
                Look-alike Domain Enforcement
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Permutations of "northstar-med.org" or "hospital-support" with high Levenshtein similarity are automatically held for administrative quarantine.
              </p>
              <span className="badge bg-positive-light" style={{ marginTop: '0.75rem' }}>POLICY ACTIVE</span>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-main)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>
                Synthetic SPF/DKIM/DMARC Tripwires
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Messages claiming to originate from internal hospital domains failing authentication checks are flagged and isolated from clinical workstations.
              </p>
              <span className="badge bg-positive-light" style={{ marginTop: '0.75rem' }}>POLICY ACTIVE</span>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-main)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>
                LinkGuard Safe Redirection
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                All hyperlinks in external emails are wrapped and scanned in real time before doctor clicks can resolve to potential harvesting servers.
              </p>
              <span className="badge bg-positive-light" style={{ marginTop: '0.75rem' }}>POLICY ACTIVE</span>
            </div>
          </div>
        </div>
      ) : (
        /* Split view: Email List (Left) + Detailed Analysis Inspector (Right) */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
          {/* Email List */}
          <div className="card" style={{ padding: '1.25rem', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search subject, sender, recipient..."
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  width: '100%',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '600px', overflowY: 'auto' }}>
              {filteredEmails.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No messages found in this category.
                </div>
              ) : (
                filteredEmails.map(em => {
                  const isSelected = selectedEmail?.id === em.id;
                  return (
                    <div
                      key={em.id}
                      onClick={() => setSelectedEmailId(em.id)}
                      style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border)',
                        backgroundColor: isSelected ? 'rgba(2, 132, 199, 0.04)' : 'var(--bg-card)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {em.senderName}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {new Date(em.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        {em.subject}
                      </div>

                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.6rem' }}>
                        {em.preview}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {getRiskBadge(em.risk)}
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                          Status: <strong>{em.status}</strong>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Email Inspector Detail Panel */}
          {selectedEmail ? (
            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    {getRiskBadge(selectedEmail.risk)}
                    <DecisionBadge status={selectedEmail.status === 'quarantined' ? 'quarantined' : selectedEmailEvent?.responseStatus || (selectedEmail.risk === 'low' ? 'allowed' : 'pending')} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ID: {selectedEmail.id}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedEmail.subject}
                  </h2>
                </div>

                {selectedEmail.status === 'inbox' ? (
                  <button
                    onClick={() => setReviewAction('quarantine')}
                    className="btn btn-outline"
                    style={{ color: 'var(--critical)', borderColor: 'rgba(239, 68, 68, 0.4)', fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                  >
                    <ShieldAlert size={15} /> Quarantine Message
                  </button>
                ) : (
                  <button
                    onClick={() => setReviewAction('release')}
                    className="btn btn-outline"
                    style={{ color: 'var(--positive)', borderColor: 'rgba(16, 185, 129, 0.4)', fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                  >
                    <ShieldCheck size={15} /> Release to Inbox
                  </button>
                )}
              </div>

              {/* Sender & Recipient Metadata */}
              <div style={{
                backgroundColor: 'var(--bg-main)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                marginBottom: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.85rem',
              }}>
                <div>
                  Sender: <strong style={{ color: 'var(--text-primary)' }}>{selectedEmail.sender}</strong> ({selectedEmail.senderName})
                </div>
                <div>
                  Recipient: <strong style={{ color: 'var(--text-primary)' }}>{selectedEmail.recipient}</strong> ({selectedEmail.recipientName})
                </div>
                <div>
                  Sender Domain: <strong style={{ color: 'var(--text-primary)' }}>{selectedEmail.domain}</strong>
                </div>
                <div>
                  Received Timestamp: <span style={{ color: 'var(--text-secondary)' }}>{new Date(selectedEmail.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Look-alike Domain Alert Banner */}
              {selectedEmail.authIndicators.lookalikeDetected && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--critical-bg)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                }}>
                  <AlertTriangle size={20} color="var(--critical)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--critical)', fontSize: '0.9rem' }}>
                      ⚠ Look-alike Domain Pattern Detected
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                      The domain "{selectedEmail.domain}" exhibits typo-squatting characteristics intended to simulate internal Northstar hospital billing communication.
                    </div>
                  </div>
                </div>
              )}

              {/* Sender Analysis & Synthetic Authentication Breakdown */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Sender Analysis & Synthetic Authentication
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  <div style={{ padding: '0.65rem', backgroundColor: 'var(--bg-main)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.8rem' }}>
                    Address Syntax: <strong style={{ color: selectedEmail.authIndicators.syntaxValid ? 'var(--positive)' : 'var(--critical)' }}>
                      {selectedEmail.authIndicators.syntaxValid ? '✓ Valid RFC-5322' : '✗ Invalid Syntax'}
                    </strong>
                  </div>
                  <div style={{ padding: '0.65rem', backgroundColor: 'var(--bg-main)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.8rem' }}>
                    Domain Trust: <strong style={{ color: selectedEmail.authIndicators.domainTrusted ? 'var(--positive)' : 'var(--critical)' }}>
                      {selectedEmail.authIndicators.domainTrusted ? '✓ Trusted Hospital Partner' : '⚠ Untrusted / Unknown'}
                    </strong>
                  </div>
                  <div style={{ padding: '0.65rem', backgroundColor: 'var(--bg-main)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.8rem' }}>
                    Display-Name Match: <strong style={{ color: selectedEmail.authIndicators.displayNameMismatch ? 'var(--critical)' : 'var(--positive)' }}>
                      {selectedEmail.authIndicators.displayNameMismatch ? '⚠ Mismatch Flagged' : '✓ Directory Aligned'}
                    </strong>
                  </div>
                  <div style={{ padding: '0.65rem', backgroundColor: 'var(--bg-main)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.8rem' }}>
                    Synthetic SPF / DKIM / DMARC: <strong style={{ color: selectedEmail.authIndicators.syntheticSpf === 'PASS' ? 'var(--positive)' : 'var(--critical)' }}>
                      {selectedEmail.authIndicators.syntheticSpf} / {selectedEmail.authIndicators.syntheticDkim} / {selectedEmail.authIndicators.syntheticDmarc}
                    </strong>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontStyle: 'italic' }}>
                  * Synthetic authentication indicators generated for demo evaluation.
                </div>
              </div>

              {/* Embedded Links */}
              {selectedEmail.links.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Embedded Hyperlinks ({selectedEmail.links.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {selectedEmail.links.map((link, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'var(--bg-main)',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        fontSize: '0.8rem',
                      }}>
                        <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{link}</span>
                        <button
                          onClick={() => setCurrentView('LinkGuard')}
                          style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          Analyze in LinkGuard <ExternalLink size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inbound Attachments */}
              {selectedEmail.attachments.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Attached Files ({selectedEmail.attachments.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {selectedEmail.attachments.map((att, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'var(--bg-main)',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        fontSize: '0.8rem',
                      }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{att}</span>
                        <button
                          onClick={() => setCurrentView('Attachments')}
                          style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          Inspect in Attachment Sentry <ExternalLink size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Body Content */}
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Simulated Message Body
                </h3>
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                }}>
                  {selectedEmail.body}
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Select a message to view sender heuristics and authentication analysis.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
