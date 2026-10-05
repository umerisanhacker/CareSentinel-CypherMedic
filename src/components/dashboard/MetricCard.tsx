import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  icon: ReactNode;
}

export default function MetricCard({ title, value, trend, trendUp, icon }: MetricCardProps) {
  const isNeutral = trend === 'Baseline stable' || trend === 'No active alerts' || trend === 'No active anomalies' || trend === 'Baseline quiet';
  const valueNumber = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  const accent = title.includes('RISK') || title.includes('POSTURE')
    ? (Number.isFinite(valueNumber) && valueNumber >= 90 ? 'var(--positive)' : Number.isFinite(valueNumber) && valueNumber >= 75 ? '#eab308' : Number.isFinite(valueNumber) && valueNumber >= 60 ? '#f97316' : 'var(--critical)')
    : title.includes('ACTIVE INCIDENTS')
      ? (Number.isFinite(valueNumber) && valueNumber === 0 ? 'var(--positive)' : 'var(--critical)')
      : title.includes('SECURITY ALERTS')
        ? (Number.isFinite(valueNumber) && valueNumber === 0 ? 'var(--accent-primary)' : 'var(--critical)')
        : title.includes('IDENTITY')
          ? (Number.isFinite(valueNumber) && valueNumber === 0 ? '#7c3aed' : 'var(--critical)')
          : title.includes('EHR')
            ? (Number.isFinite(valueNumber) && valueNumber === 0 ? '#0891b2' : 'var(--critical)')
            : title.includes('NETWORK')
              ? (Number.isFinite(valueNumber) && valueNumber === 0 ? '#2563eb' : 'var(--warning)')
              : 'var(--accent-primary)';

  return (
    <div className="card metric-card" style={{
      padding: '1.1rem 1.15rem',
      background: `linear-gradient(145deg, rgba(255,255,255,.98), color-mix(in srgb, ${accent} 5%, white))`,
      borderTop: `3px solid ${accent}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '.75rem' }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: '.67rem', fontWeight: 800, letterSpacing: '.07em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {title}
          </p>
          <p style={{ fontSize: '1.7rem', lineHeight: 1.05, fontWeight: 800, color: accent, marginTop: '.55rem', letterSpacing: '-.035em' }}>
            {value}
          </p>
        </div>

        <div style={{
          width: 40,
          height: 40,
          flex: '0 0 auto',
          display: 'grid',
          placeItems: 'center',
          borderRadius: 12,
          background: `color-mix(in srgb, ${accent} 10%, white)`,
          border: `1px solid color-mix(in srgb, ${accent} 18%, white)`,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.9)',
        }}>
          {icon}
        </div>
      </div>

      <div style={{
        marginTop: '.85rem',
        paddingTop: '.7rem',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '.3rem',
        minHeight: 25,
      }}>
        {isNeutral ? (
          <Minus size={14} color="var(--text-muted)" />
        ) : trendUp ? (
          <ArrowUpRight size={14} color="var(--critical)" />
        ) : (
          <ArrowDownRight size={14} color="var(--positive)" />
        )}
        <span style={{
          fontSize: '.72rem',
          fontWeight: 700,
          color: isNeutral ? 'var(--text-secondary)' : trendUp ? 'var(--critical)' : 'var(--positive)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {trend}
        </span>
      </div>
    </div>
  );
}
