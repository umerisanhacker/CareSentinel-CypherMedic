import { useState, useMemo } from 'react';
import { useAuditLog } from '../store/store';
import { Search, Filter, Download } from 'lucide-react';

export default function AuditLedger() {
  const auditLog = useAuditLog();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSystem, setFilterSystem] = useState<string>('all');
  const [filterOutcome, setFilterOutcome] = useState<string>('all');

  const systems = useMemo(() => {
    return Array.from(new Set(auditLog.map(a => a.system)));
  }, [auditLog]);

  const filteredLogs = useMemo(() => {
    return auditLog.filter(log => {
      if (filterSystem !== 'all' && log.system !== filterSystem) return false;
      if (filterOutcome !== 'all' && log.outcome !== filterOutcome) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.action.toLowerCase().includes(q) ||
          log.actor.toLowerCase().includes(q) ||
          log.system.toLowerCase().includes(q) ||
          (log.details && log.details.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [auditLog, searchQuery, filterSystem, filterOutcome]);

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Actor', 'System', 'Action', 'Outcome', 'Details'];
    const rows = filteredLogs.map(l => [
      l.timestamp,
      `"${l.actor}"`,
      `"${l.system}"`,
      `"${l.action}"`,
      l.outcome,
      `"${l.details || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `caresentinel-clinical-audit-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Clinical Audit Ledger
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Immutable, chronological governance log of security detections, automated tripwires, and clinical responder decisions.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem' }}
        >
          <Download size={15} /> Export Audit Ledger (CSV)
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1.25rem', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)', flex: 1, minWidth: '240px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actions, clinicians, systems, evidence..."
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem', color: 'var(--text-primary)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <Filter size={14} /> System:
              <select
                value={filterSystem}
                onChange={(e) => setFilterSystem(e.target.value)}
                style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', fontSize: '0.8rem', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value="all">All Systems ({auditLog.length})</option>
                {systems.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Outcome:
              <select
                value={filterOutcome}
                onChange={(e) => setFilterOutcome(e.target.value)}
                style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', fontSize: '0.8rem', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value="all">All Outcomes</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="failed">Failed / Alert</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Table */}
      <div className="card" style={{ padding: '1.25rem', backgroundColor: 'white', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
              <th style={{ padding: '0.75rem 1rem' }}>Actor</th>
              <th style={{ padding: '0.75rem 1rem' }}>System</th>
              <th style={{ padding: '0.75rem 1rem' }}>Action Executed</th>
              <th style={{ padding: '0.75rem 1rem' }}>Details & Forensic Attribution</th>
              <th style={{ padding: '0.75rem 1rem' }}>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No audit records match the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.1s ease' }}>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.78rem' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                    {log.actor}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {log.system}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {log.action}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: '320px' }}>
                    {log.details || 'System event verified and recorded.'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                    <span className={`badge ${
                      log.outcome === 'success' ? 'bg-positive-light' :
                      log.outcome === 'warning' ? 'bg-warning-light' : 'bg-critical-light'
                    }`}>
                      {log.outcome.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
