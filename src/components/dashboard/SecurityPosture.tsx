import { useState } from 'react';
import type { SecurityPosture as SecurityPostureType } from '../../store/types';
import { Shield, HelpCircle, X, CheckCircle2, ChevronRight } from 'lucide-react';
import { useSetCurrentView } from '../../store/store';

interface Props {
  posture: SecurityPostureType;
}

export default function SecurityPosture({ posture }: Props) {
  const [showWhyModal, setShowWhyModal] = useState(false);
  const setCurrentView = useSetCurrentView();

  const dashArray = 251.2; // 2 * pi * r (r=40)
  const dashOffset = dashArray - (dashArray * posture.score) / 100;

  const getStrokeColor = (score: number) => {
    if (score >= 90) return 'var(--positive)';
    if (score >= 75) return '#eab308';
    if (score >= 60) return '#f97316';
    return 'var(--critical)';
  };

  const categoryMap: Record<string, { label: string; view: string }> = {
    identity: { label: 'Identity Security', view: 'Identity' },
    network: { label: 'Network Security', view: 'Network' },
    email: { label: 'Email Security', view: 'Email Security' },
    ehr: { label: 'EHR Security', view: 'EHR Security' },
    application: { label: 'Application Security', view: 'Application Security' },
    linkguard: { label: 'LinkGuard', view: 'LinkGuard' },
  };

  return (
    <>
      <div className="card" style={{ padding: '1.5rem', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Security Posture
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Deterministic decision-support scoring
            </div>
          </div>
          <button
            onClick={() => setShowWhyModal(true)}
            className="btn btn-outline"
            style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', gap: '0.35rem', color: 'var(--accent-primary)' }}
          >
            <HelpCircle size={14} /> Why this score?
          </button>
        </div>

        {/* Circular Gauge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1rem 0 1.75rem 0', position: 'relative' }}>
          <svg className="w-36 h-36" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
            <circle 
              cx="50" cy="50" r="40" 
              stroke="#e2e8f0" strokeWidth="8" fill="transparent" 
            />
            <circle 
              cx="50" cy="50" r="40" 
              stroke={getStrokeColor(posture.score)} 
              strokeWidth="8" 
              fill="transparent" 
              strokeDasharray={dashArray} 
              strokeDashoffset={dashOffset} 
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {posture.score}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              / 100
            </span>
            <span className={`badge ${posture.score >= 80 ? 'bg-positive-light' : posture.score >= 60 ? 'bg-warning-light' : 'bg-critical-light'}`} style={{ marginTop: '0.3rem', fontSize: '0.7rem' }}>
              {posture.label}
            </span>
          </div>
        </div>
        
        {/* Category Breakdown Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {Object.entries(categoryMap).map(([catKey, info]) => {
            const score = posture.categoryScores[catKey as keyof typeof posture.categoryScores] ?? 100;
            return (
              <button
                key={catKey}
                onClick={() => setCurrentView(info.view)}
                style={{
                  textAlign: 'left',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '6px',
                  transition: 'background-color 0.15s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{info.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{score}/100</span>
                    <ChevronRight size={14} color="var(--text-muted)" />
                  </div>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-main)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${score}%`, 
                      height: '100%', 
                      backgroundColor: getStrokeColor(score),
                      borderRadius: '9999px',
                      transition: 'width 0.8s ease-out' 
                    }} 
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Contributing Risk Factors Snippet */}
        {posture.riskFactors.length > 0 && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Primary Active Deductions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {posture.riskFactors.slice(0, 3).map((rf, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                    {rf.label}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--critical)' }}>
                    -{rf.deduction}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* "Why this score?" Explainability Modal */}
      {showWhyModal && (
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
            maxWidth: '620px',
            width: '100%',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg)',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Shield size={22} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Explainable Risk Attribution
                </h3>
              </div>
              <button onClick={() => setShowWhyModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                marginBottom: '1.5rem',
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  Prototype Decision-Support Scoring Formula
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  CareSentinel calculates posture deterministically from active, uncontained telemetry events. Every signal deducts points weighted by clinical severity and multi-vector correlation synergy.
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  Active Contributing Signals:
                </div>
                {posture.riskFactors.length === 0 ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--positive)', fontSize: '0.875rem' }}>
                    <CheckCircle2 size={24} style={{ margin: '0 auto 0.5rem auto' }} />
                    No active threat signals detected. Security posture is nominal (100/100).
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {posture.riskFactors.map(rf => (
                      <div key={rf.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {rf.label}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                            Category: {rf.category} • Source: Verified Telemetry
                          </div>
                        </div>
                        <span className="badge bg-critical-light" style={{ fontSize: '0.8rem' }}>
                          +{rf.deduction} Risk Points
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong>How to improve score:</strong> Resolving incidents, quarantining malicious emails, blocking links in LinkGuard, or isolating rogue devices in the console immediately recalculates posture toward 100.
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button onClick={() => setShowWhyModal(false)} className="btn btn-secondary">
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
