import { useState, useMemo } from 'react';
import { Search, X, ShieldAlert, Mail, Users, HardDrive, Activity } from 'lucide-react';
import { useStore, useSetCurrentView, useSelectIncident } from '../../store/store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function GlobalSearchModal({ isOpen, onClose, initialQuery = '' }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const { state } = useStore();
  const setCurrentView = useSetCurrentView();
  const selectIncident = useSelectIncident();

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const matchedIncidents = state.incidents.filter(i => 
      i.title.toLowerCase().includes(q) || 
      i.id.toLowerCase().includes(q) || 
      (i.affectedUserId && i.affectedUserId.toLowerCase().includes(q))
    );

    const matchedUsers = state.users.filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) || 
      u.department.toLowerCase().includes(q)
    );

    const matchedEvents = state.events.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.description.toLowerCase().includes(q) || 
      e.system.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedEmails = state.emails.filter(e => 
      e.subject.toLowerCase().includes(q) || 
      e.sender.toLowerCase().includes(q) || 
      e.senderName.toLowerCase().includes(q)
    );

    const matchedPatients = state.patients.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.mrn.toLowerCase().includes(q) || 
      p.department.toLowerCase().includes(q)
    );

    const matchedDevices = state.devices.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.ip.toLowerCase().includes(q) || 
      d.location.toLowerCase().includes(q)
    );

    const total = matchedIncidents.length + matchedUsers.length + matchedEvents.length + 
                  matchedEmails.length + matchedPatients.length + matchedDevices.length;

    return {
      incidents: matchedIncidents,
      users: matchedUsers,
      events: matchedEvents,
      emails: matchedEmails,
      patients: matchedPatients,
      devices: matchedDevices,
      total,
    };
  }, [query, state]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
    }}>
      <div className="card" style={{
        maxWidth: '720px',
        width: '100%',
        padding: '1.5rem',
        borderRadius: '16px',
        backgroundColor: 'white',
        boxShadow: 'var(--shadow-lg)',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <Search size={20} color="var(--accent-primary)" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search synthetic incidents, physicians, patients, emails, devices..."
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1.05rem',
              color: 'var(--text-primary)',
            }}
          />
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
          {!query.trim() && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Type to search Northstar Medical Center synthetic telemetry...
              <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge bg-accent-light" onClick={() => setQuery('Dr. Sarah')} style={{ cursor: 'pointer' }}>Dr. Sarah</span>
                <span className="badge bg-critical-light" onClick={() => setQuery('INC-001')} style={{ cursor: 'pointer' }}>INC-001</span>
                <span className="badge bg-warning-light" onClick={() => setQuery('phishing')} style={{ cursor: 'pointer' }}>phishing</span>
                <span className="badge bg-positive-light" onClick={() => setQuery('Cardiology')} style={{ cursor: 'pointer' }}>Cardiology</span>
              </div>
            </div>
          )}

          {results && results.total === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No synthetic records matched "{query}".
            </div>
          )}

          {results && results.total > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Incidents Group */}
              {results.incidents.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Correlated Incidents ({results.incidents.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {results.incidents.map(inc => (
                      <button
                        key={inc.id}
                        onClick={() => {
                          selectIncident(inc.id);
                          setCurrentView('Incidents');
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-main)',
                          textAlign: 'left',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <ShieldAlert size={16} color="var(--critical)" />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {inc.id}: {inc.title}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                              Affected: {inc.affectedUserId} • Score: {inc.riskScore}/100
                            </div>
                          </div>
                        </div>
                        <span className="badge bg-critical-light">{inc.status.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Users Group */}
              {results.users.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Clinical Users ({results.users.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {results.users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentView('Identity');
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-main)',
                          textAlign: 'left',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Users size={16} color="var(--accent-primary)" />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{u.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{u.role} • {u.department} ({u.email})</div>
                          </div>
                        </div>
                        <span className={`badge ${u.status === 'flagged' ? 'bg-critical-light' : 'bg-positive-light'}`}>
                          {u.status.toUpperCase()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Emails Group */}
              {results.emails.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Clinical Emails ({results.emails.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {results.emails.map(em => (
                      <button
                        key={em.id}
                        onClick={() => {
                          setCurrentView('Email Security');
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-main)',
                          textAlign: 'left',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Mail size={16} color="var(--warning)" />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{em.subject}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>From: {em.sender}</div>
                          </div>
                        </div>
                        <span className="badge bg-warning-light">{em.risk.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Patients Group */}
              {results.patients.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Synthetic Patient Records ({results.patients.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {results.patients.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setCurrentView('EHR Security');
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-main)',
                          textAlign: 'left',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Activity size={16} color="var(--accent-secondary)" />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{p.name} ({p.mrn})</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{p.department} • Attending: {p.primaryPhysician} • {p.room}</div>
                          </div>
                        </div>
                        <span className="badge bg-accent-light">{p.condition}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Devices Group */}
              {results.devices.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Monitored Hardware ({results.devices.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {results.devices.map(d => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setCurrentView('Network');
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-main)',
                          textAlign: 'left',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <HardDrive size={16} color="var(--text-secondary)" />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{d.name} ({d.ip})</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{d.type} • Location: {d.location}</div>
                          </div>
                        </div>
                        <span className={`badge ${d.status === 'isolated' ? 'bg-critical-light' : 'bg-positive-light'}`}>
                          {d.status.toUpperCase()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
