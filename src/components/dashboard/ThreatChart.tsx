import { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import type { SecurityEvent } from '../../store/types';

interface Props {
  events: SecurityEvent[];
}

export default function ThreatChart({ events }: Props) {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  const chartData = useMemo(() => {
    // Deterministic synthetic baseline: most periods are quiet, with a few
    // believable operational spikes. Simulator events are layered on top.
    const baseline24h = [
      { time: '00:00', email: 1, identity: 0, network: 1, ehr: 0 },
      { time: '04:00', email: 0, identity: 0, network: 0, ehr: 0 },
      { time: '08:00', email: 2, identity: 1, network: 1, ehr: 0 },
      { time: '12:00', email: 3, identity: 1, network: 2, ehr: 1 },
      { time: '16:00', email: 2, identity: 0, network: 1, ehr: 0 },
      { time: '20:00', email: 1, identity: 0, network: 1, ehr: 0 },
    ];

    const activeCounts = events.reduce(
      (acc, event) => {
        if (event.status === 'resolved' || event.status === 'false_positive') return acc;
        if (event.category === 'email') acc.email += 1;
        if (event.category === 'identity') acc.identity += 1;
        if (event.category === 'network') acc.network += 1;
        if (event.category === 'ehr' && event.metadata.breakGlassApproved !== true) acc.ehr += 1;
        return acc;
      },
      { email: 0, identity: 0, network: 0, ehr: 0 }
    );

    if (timeframe === '24h') {
      return baseline24h.map((point, index) => {
        const isRecentBucket = index >= 4;
        const isCurrentBucket = index === 5;
        return {
          ...point,
          email: point.email + (isCurrentBucket ? Math.min(5, activeCounts.email) : isRecentBucket ? Math.min(2, activeCounts.email) : 0),
          identity: point.identity + (isCurrentBucket ? Math.min(5, activeCounts.identity) : 0),
          network: point.network + (isCurrentBucket ? Math.min(5, activeCounts.network) : 0),
          ehr: point.ehr + (isCurrentBucket ? Math.min(5, activeCounts.ehr) : 0),
        };
      });
    }

    if (timeframe === '7d') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
      const normal = [
        [3, 1, 2, 0],
        [2, 0, 1, 0],
        [4, 1, 2, 1],
        [2, 0, 1, 0],
        [5, 1, 3, 1],
        [1, 0, 1, 0],
        [2, 1, 2, 0],
      ];
      return days.map((day, index) => ({
        time: day,
        email: normal[index][0] + (index === 6 ? activeCounts.email : 0),
        identity: normal[index][1] + (index === 6 ? activeCounts.identity : 0),
        network: normal[index][2] + (index === 6 ? activeCounts.network : 0),
        ehr: normal[index][3] + (index === 6 ? activeCounts.ehr : 0),
      }));
    }

    return [
      { time: 'Week 1', email: 18, identity: 7, network: 14, ehr: 4 },
      { time: 'Week 2', email: 22, identity: 9, network: 16, ehr: 5 },
      { time: 'Week 3', email: 19, identity: 8, network: 13, ehr: 4 },
      { time: 'Week 4', email: 25, identity: 10, network: 18, ehr: 6 },
    ];
  }, [timeframe, events]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header with Timeframe toggles */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Security Activity Telemetry
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Multi-vector signal rates across synthetic hospital infrastructure
          </div>
        </div>

        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-main)',
          padding: '0.2rem',
          borderRadius: '8px',
          border: '1px solid var(--border)',
        }}>
          {(['24h', '7d', '30d'] as const).map(tf => {
            const active = timeframe === tf;
            const label = tf === '24h' ? 'Last 24 Hours' : tf === '7d' ? 'Last 7 Days' : 'Last 30 Days';
            return (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  backgroundColor: active ? 'white' : 'transparent',
                  borderRadius: '6px',
                  boxShadow: active ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recharts Multi-Area Visualization */}
      <div style={{ flex: 1, minHeight: '260px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEHR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--critical)" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="var(--critical)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorIdentity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEmail" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--warning)" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="var(--warning)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderColor: 'var(--border)', 
                borderRadius: '8px',
                boxShadow: 'var(--shadow-md)',
                fontSize: '0.8rem',
              }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '0.8rem', paddingBottom: '8px' }}
            />
            <Area 
              type="monotone" 
              name="EHR Anomalies" 
              dataKey="ehr" 
              stroke="var(--critical)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorEHR)" 
            />
            <Area 
              type="monotone" 
              name="Identity Anomalies" 
              dataKey="identity" 
              stroke="var(--accent-primary)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorIdentity)" 
            />
            <Area 
              type="monotone" 
              name="Email Threats" 
              dataKey="email" 
              stroke="var(--warning)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorEmail)" 
            />
            <Area 
              type="monotone" 
              name="Network Threats" 
              dataKey="network" 
              stroke="var(--accent-secondary)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorNetwork)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
