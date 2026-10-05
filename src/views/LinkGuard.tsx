import { useState } from 'react';
import { DecisionBadge, deriveDecisionStatus } from '../components/security/DecisionBadge';
import { useEvents, useSetCurrentView, useResolveSecurityEvent } from '../store/store';
import { 
  Link as LinkIcon, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Search
} from 'lucide-react';

export default function LinkGuard() {
  const events = useEvents();
  const setCurrentView = useSetCurrentView();
  const resolveSecurityEvent = useResolveSecurityEvent();

  const linkEvents = events.filter(e => e.category === 'linkguard');

  const [inputUrl, setInputUrl] = useState('https://secure-hospital-login.example/account');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    url: string;
    domain: string;
    protocol: string;
    port: string;
    subdomain: string;
    encoding: string;
    redirectIndicators: string;
    reputation: string;
    riskScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    reasons: string[];
    recommendedAction: 'BLOCK' | 'ALLOW' | 'INVESTIGATE';
  } | null>(null);

  const [simulatedAction, setSimulatedAction] = useState<string | null>(null);
  const latestLinkEvent = linkEvents.find(e => e.status === 'new' || e.status === 'acknowledged');
  const runAnalysis = (urlToAnalyze: string) => {
    if (!urlToAnalyze.trim()) return;
    setAnalyzing(true);

    const urlLower = urlToAnalyze.toLowerCase();
    let riskScore = 20;
    let reasons: string[] = [];
    let rec: 'BLOCK' | 'ALLOW' | 'INVESTIGATE' = 'ALLOW';

    if (urlLower.includes('login') || urlLower.includes('account') || urlLower.includes('verify') || urlLower.includes('secure')) {
      riskScore += 35;
      reasons.push('Credential collection pattern detected in URI path');
    }
    if (urlLower.includes('hospital-login') || urlLower.includes('hospital-support') || urlLower.includes('.example') || urlLower.includes('.net') || urlLower.includes('northstar-billing')) {
      riskScore += 32;
      reasons.push('Look-alike domain pattern masquerading as hospital portal');
    }
    if (urlLower.startsWith('http://')) {
      riskScore += 15;
      reasons.push('Unencrypted HTTP protocol used for sensitive clinical portal');
    }
    if (reasons.length === 0) {
      reasons.push('Valid SSL certificate and trusted internal medical domain structure');
    }

    riskScore = Math.min(100, Math.max(10, riskScore));
    const riskLevel = riskScore >= 80 ? 'CRITICAL' : riskScore >= 60 ? 'HIGH' : riskScore >= 40 ? 'MEDIUM' : 'LOW';
    rec = riskScore >= 65 ? 'BLOCK' : riskScore >= 45 ? 'INVESTIGATE' : 'ALLOW';

    // Parse parts
    let domain = 'unknown';
    let protocol = 'https:';
    let port = '443 (Default)';
    let subdomain = 'None';
    try {
      const parsed = new URL(urlToAnalyze);
      domain = parsed.hostname;
      protocol = parsed.protocol;
      port = parsed.port || (protocol === 'https:' ? '443 (Default)' : '80 (Default)');
      const parts = parsed.hostname.split('.');
      if (parts.length > 2) {
        subdomain = parts.slice(0, parts.length - 2).join('.');
      }
    } catch {
      domain = urlToAnalyze.split('/')[2] || urlToAnalyze;
    }

    setTimeout(() => {
      setAnalysisResult({
        url: urlToAnalyze,
        domain,
        protocol,
        port,
        subdomain,
        encoding: 'UTF-8 / Standard ASCII',
        redirectIndicators: riskScore >= 65 ? '1 Hidden Proxy Hop Detected' : 'Direct Target (0 Redirects)',
        reputation: riskScore >= 65 ? 'Flagged Malicious (Reputation: 12/100)' : 'Trusted Domain (Reputation: 96/100)',
        riskScore,
        riskLevel,
        reasons,
        recommendedAction: rec,
      });
      setAnalyzing(false);
    }, 400);
  };

  // Security signals remain telemetry-only until an analyst explicitly opens
  // the finding with "Inspect URL" or runs a manual URL analysis. This prevents
  // response controls and detailed analysis from appearing automatically.
  const handleAnalyze = () => {
    runAnalysis(inputUrl);
  };

  const handleInspectEvent = (eventUrl: string) => {
    setInputUrl(eventUrl);
    runAnalysis(eventUrl);
  };

  const executeAction = (actionName: string) => {
    setSimulatedAction(actionName);
    const eventId = latestLinkEvent?.id;

    if (eventId) {
      resolveSecurityEvent(
        eventId,
        actionName,
        `Operator enacted ${actionName} for ${inputUrl}. The finding remains available in the event and audit history.`,
      );
    }

    // Once an analyst has chosen a response, remove the active explanation card.
    // The underlying finding remains visible in historical telemetry/audit views.
    setAnalysisResult(null);
    setTimeout(() => setSimulatedAction(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          LinkGuard Protection
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
          Deep lexical, domain reputation, and credential-harvesting analysis for healthcare hyperlinks.
        </p>
      </div>

      {simulatedAction && (
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
          <CheckCircle2 size={16} /> Safe Response Enacted: {simulatedAction} committed to LinkGuard proxy rules & Audit Ledger!
        </div>
      )}

      {latestLinkEvent && (
        <div className="card animate-fade-in" style={{
          padding: '1rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(239,68,68,0.07), rgba(14,165,233,0.05))',
          border: '1px solid rgba(239,68,68,0.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--critical-bg)', color: 'var(--critical)', display: 'grid', placeItems: 'center' }}>
              <ShieldAlert size={19} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--critical)', letterSpacing: '0.06em' }}>NEW LINKGUARD SIGNAL</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{latestLinkEvent.title}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>Central event detected • risk {latestLinkEvent.riskContribution}/25 • investigation ready</div>
            </div>
          </div>
          <button onClick={() => handleInspectEvent(String(latestLinkEvent.metadata?.url || inputUrl))} className="btn btn-danger" style={{ padding: '0.5rem 0.85rem', fontSize: '0.78rem' }}>
            Inspect Signal <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Intercepted Links Table (if any link events exist in central state) */}
      <div className="card" style={{ padding: '1.5rem', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} color="var(--critical)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Live Intercepted Healthcare Hyperlinks ({linkEvents.length})
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.55rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span className="badge bg-positive-light">LinkGuard Safe-Proxy Active</span>
          </div>
        </div>

        {linkEvents.length === 0 ? (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-main)',
            borderRadius: '8px',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
          }}>
            No suspicious links intercepted yet. Trigger "SIMULATE MALICIOUS LINK" in Attack Simulator to inject real telemetry.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Timestamp</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Target User</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Intercepted URL</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Risk Score</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Decision Status</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {linkEvents.map(evt => {
                  const url = (evt.metadata?.url as string) || 'https://secure-hospital-login.example/account';
                  return (
                    <tr key={evt.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-muted)' }}>
                        {evt.timestamp.split('T')[1]?.substring(0, 8) || '09:43:00'}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>
                        {evt.actor || 'Dr. Sarah Wilson'}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', color: 'var(--critical)', fontFamily: 'monospace' }}>
                        {url}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem', flexWrap: 'wrap' }}>
                          <span className={`badge ${Number(evt.metadata?.riskScore || 0) >= 80 ? 'bg-critical-light' : Number(evt.metadata?.riskScore || 0) >= 60 ? 'bg-warning-light' : 'bg-positive-light'}`}>
                            {Number(evt.metadata?.riskScore || 0)}/100 ({evt.severity.toUpperCase()})
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem' }}>
                        <DecisionBadge status={deriveDecisionStatus(evt)} />
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem' }}>
                        <button
                          onClick={() => handleInspectEvent(url)}
                          className="btn btn-outline"
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
                        >
                          <Search size={12} /> Inspect URL
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual URL Input Card */}
      <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Manual URL Security Analysis
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Paste any clinical hyperlink to execute structural inspection, domain entropy evaluation, and simulated containment:
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <LinkIcon size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="e.g. https://secure-hospital-login.example/account"
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing || !inputUrl.trim()}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
          >
            {analyzing ? 'ANALYZING...' : 'Analyze URL'}
          </button>
        </div>

        {/* Quick sample chips */}
        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>Try sample synthetic URLs:</span>
          <button 
            onClick={() => { setInputUrl('https://secure-hospital-login.example/account'); runAnalysis('https://secure-hospital-login.example/account'); }}
            style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}
          >
            secure-hospital-login.example (Phish)
          </button>
          <span>•</span>
          <button 
            onClick={() => { setInputUrl('https://ehr.northstar-med.internal/labs/8819'); runAnalysis('https://ehr.northstar-med.internal/labs/8819'); }}
            style={{ color: 'var(--positive)', textDecoration: 'underline' }}
          >
            ehr.northstar-med.internal (Clean)
          </button>
        </div>
      </div>

      {/* Analysis Result Card */}
      {analysisResult && (
        <div className="card animate-fade-in" style={{ padding: '2rem', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className={`badge ${
                  analysisResult.riskLevel === 'CRITICAL' ? 'bg-critical-light' : 
                  analysisResult.riskLevel === 'HIGH' ? 'bg-warning-light' : 'bg-positive-light'
                }`}>
                  {analysisResult.riskLevel} THREAT RISK
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Decision: {analysisResult.recommendedAction}
                </span>
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                {analysisResult.url}
              </h2>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                LinkGuard Score
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: analysisResult.riskScore >= 65 ? 'var(--critical)' : 'var(--positive)',
                lineHeight: 1,
              }}>
                {analysisResult.riskScore} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 100</span>
              </div>
            </div>
          </div>

          {/* Lexical & Structural Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.825rem' }}>
              Domain: <strong style={{ color: 'var(--text-primary)' }}>{analysisResult.domain}</strong>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.825rem' }}>
              Protocol: <strong style={{ color: 'var(--text-primary)' }}>{analysisResult.protocol}</strong>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.825rem' }}>
              Target Port: <strong style={{ color: 'var(--text-primary)' }}>{analysisResult.port}</strong>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.825rem' }}>
              Subdomain: <strong style={{ color: 'var(--text-primary)' }}>{analysisResult.subdomain}</strong>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.825rem' }}>
              Encoding: <strong style={{ color: 'var(--text-primary)' }}>{analysisResult.encoding}</strong>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.825rem' }}>
              Redirects: <strong style={{ color: 'var(--text-primary)' }}>{analysisResult.redirectIndicators}</strong>
            </div>
          </div>

          {/* Explainable Reasons */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Explainable Risk Reasons
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {analysisResult.reasons.map((r, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.6rem 0.85rem',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                }}>
                  <AlertTriangle size={16} color={analysisResult.riskScore >= 60 ? 'var(--critical)' : 'var(--positive)'} />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated Action Controls */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Actions modify synthetic in-memory state and log verification to the audit ledger.
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {latestLinkEvent && (
                <>
                  <button
                    onClick={() => executeAction('Block Link')}
                    className="btn btn-danger"
                    style={{ padding: '0.55rem 1.25rem' }}
                  >
                    <ShieldAlert size={16} /> Block Link
                  </button>
                  <button
                    onClick={() => executeAction('Allow Link')}
                    className="btn btn-secondary"
                    style={{ padding: '0.55rem 1.25rem' }}
                  >
                    <CheckCircle2 size={16} /> Allow
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setCurrentView('Incidents');
                }}
                className="btn btn-outline"
                style={{ padding: '0.55rem 1.25rem' }}
              >
                Investigate in Incident Desk <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
