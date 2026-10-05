import { DecisionBadge } from '../components/security/DecisionBadge';
import ActionNoteModal from '../components/security/ActionNoteModal';
import { useState } from 'react';
import { 
  useEvents, 
  useStore,
  useIsolateNetworkNode 
} from '../store/store';
import { 
  Network, 
  Server, 
  Shield, 
  Database, 
  ShieldAlert, 
  CheckCircle2
} from 'lucide-react';
import type { NetworkTelemetryNode } from '../store/types';

export default function NetworkView() {
  const events = useEvents();
  const { state } = useStore();
  const isolateNetworkNode = useIsolateNetworkNode();

  const [selectedNodeId, setSelectedNodeId] = useState<string>(state.networkNodes[2]?.id || state.networkNodes[0]?.id || '');
  const selectedNode = state.networkNodes.find(node => node.id === selectedNodeId) || state.networkNodes[0];
  const [isolationNotice, setIsolationNotice] = useState<string | null>(null);
  const [showIsolationReview, setShowIsolationReview] = useState(false);

  const networkEvents = events.filter(e => e.category === 'network' && (e.status === 'new' || e.status === 'acknowledged'));

  const handleIsolateNode = (node: NetworkTelemetryNode, note: string) => {
    isolateNetworkNode(node.id, note || undefined);
    setShowIsolationReview(false);
    setIsolationNotice(`Node ${node.name} (${node.ip}) isolated into synthetic Quarantine VLAN.`);
    setTimeout(() => setIsolationNotice(null), 3500);
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Clinical Network Intrusion Detection (NIDS)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
          Synthetic telemetry monitoring clinical firewalls, DMZ reverse proxies, and healthcare VLAN traffic.
        </p>
      </div>

      {isolationNotice && (
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
          <CheckCircle2 size={16} /> {isolationNotice}
        </div>
      )}

      {/* Interactive Network Topology Diagram */}
      <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Hospital Clinical Network Topology
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Click any node to view real-time synthetic traffic telemetry and isolation controls
            </div>
          </div>
          <span className="badge bg-positive-light">NIDS Telemetry Active</span>
        </div>

        {/* SVG Flow diagram */}
        <div style={{
          position: 'relative',
          height: '240px',
          backgroundColor: 'var(--bg-main)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          overflow: 'hidden',
        }}>
          {/* Subtle connection line */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="var(--border)" strokeWidth="2" strokeDasharray="6 4" />
          </svg>

          {state.networkNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const hasAlert = node.status === 'alert';
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                style={{
                  position: 'relative',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: hasAlert ? 'var(--critical-bg)' : isSelected ? 'var(--accent-light)' : 'white',
                  border: isSelected ? '2px solid var(--accent-primary)' : hasAlert ? '2px solid var(--critical)' : '1px solid var(--border)',
                  color: hasAlert ? 'var(--critical)' : isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.15s ease, border-color 0.15s ease',
                }}>
                  {node.type === 'internet' ? <Network size={24} /> :
                   node.type === 'firewall' ? <Shield size={24} /> :
                   node.type === 'ehr_db' ? <Database size={24} /> :
                   <Server size={24} />}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {node.name.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {node.ip}
                  </div>
                </div>

                {hasAlert && (
                  <DecisionBadge status="pending" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Selected Node Details (Left) + Intrusion Telemetry Alerts (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Selected Node Inspector */}
        <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.35rem' }}>
              <DecisionBadge status={selectedNode?.status === 'isolated' ? 'isolated' : selectedNode?.status === 'alert' ? 'pending' : 'allowed'} />
              <span className="badge bg-accent-light">
                NODE: {selectedNode?.status?.toUpperCase() || 'UNKNOWN'}
              </span>
            </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {selectedNode?.name || 'No network node selected'}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                IP Address: <strong>{selectedNode?.ip || '—'}</strong> • Interface: eth0
              </div>
            </div>

            <button
              onClick={() => selectedNode && setShowIsolationReview(true)}
              className="btn btn-outline"
              style={{ color: 'var(--critical)', borderColor: 'rgba(239, 68, 68, 0.4)', fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              <ShieldAlert size={14} /> Isolate Node
            </button>
          </div>

          <ActionNoteModal
            open={showIsolationReview}
            title={`Review network isolation — ${selectedNode?.name || 'node'}`}
            description="Confirm the containment decision. The optional note is stored in the synthetic audit ledger for traceability."
            actionLabel="Isolate Node"
            actionTone="danger"
            onCancel={() => setShowIsolationReview(false)}
            onConfirm={(note) => selectedNode && handleIsolateNode(selectedNode, note)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Throughput Rate</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {selectedNode?.trafficRate || '—'}
              </div>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACL Security Rule</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.3rem' }}>
                Strict Medical VLAN
              </div>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IPS Sensor State</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--positive)', marginTop: '0.3rem' }}>
                Active Inspection
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong>Inspection Summary:</strong> Node telemetry is monitored for non-standard port scans, unauthorized lateral SSH attempts, and rapid API querying characteristic of clinical record exfiltration.
          </div>
        </div>

        {/* NIDS Intrusion Alerts List */}
        <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              NIDS Signatures & Reconnaissance ({networkEvents.length})
            </h3>
            <span className="badge bg-warning-light">Port Scan Telemetry</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {networkEvents.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No active network intrusion signatures.
              </div>
            ) : (
              networkEvents.map(evt => (
                <div key={evt.id} style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {evt.title}
                    </span>
                    <span className="badge bg-critical-light">
                      {evt.severity.toUpperCase()}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                    {evt.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>Source: <strong>{evt.metadata.sourceIP || evt.actor || '10.0.0.45'}</strong></span>
                    <span>Scanned Ports: <strong>{String(evt.metadata.scannedPorts || '22, 80, 443, 8080, 8443')}</strong></span>
                    <span>Rate: <strong>{String(evt.metadata.rate || '450 pkts/sec')}</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
