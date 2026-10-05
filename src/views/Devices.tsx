import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Cpu,
  HeartPulse,
  Network,
  ShieldCheck,
  Siren,
  Stethoscope,
  UserRound,
  XCircle,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import {
  useDevices,
  useEvents,
  useSafeContainDevice,
  useEscalateClinicalDevice,
  useResolveSecurityEvent,
} from '../store/store';
import { assessMedicalDevice, getDeviceNetworkPath, getDeviceTimeline } from '../store/deviceSecurityEngine';

function statusTone(status: string) {
  if (status === 'isolated') return { bg: '#fff1f2', fg: '#be123c', label: 'ISOLATED' };
  if (status === 'flagged') return { bg: '#fff7ed', fg: '#c2410c', label: 'ANOMALY' };
  return { bg: '#ecfdf5', fg: '#047857', label: 'ONLINE' };
}

function severityTone(severity?: string) {
  if (severity === 'critical') return { bg: '#fef2f2', fg: '#b91c1c' };
  if (severity === 'high') return { bg: '#fff7ed', fg: '#c2410c' };
  if (severity === 'medium') return { bg: '#fffbeb', fg: '#a16207' };
  return { bg: '#f0fdf4', fg: '#15803d' };
}

export default function Devices() {
  const devices = useDevices();
  const events = useEvents();
  const safeContainDevice = useSafeContainDevice();
  const escalateClinicalDevice = useEscalateClinicalDevice();
  const resolveSecurityEvent = useResolveSecurityEvent();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deviceSearch, setDeviceSearch] = useState('');
  const [deviceTypeFilter, setDeviceTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [criticalityFilter, setCriticalityFilter] = useState('all');
  const [connectionFilter, setConnectionFilter] = useState('all');
  const [networkZoneFilter, setNetworkZoneFilter] = useState('all');
  const [anomaliesOnly, setAnomaliesOnly] = useState(false);

  const medicalDevices = devices.filter(d => d.deviceClass === 'clinical' || /medical|monitor|ventilator|dialysis|infusion|pacs/i.test(d.type));
  const selectedDevice = devices.find(d => d.id === selectedId) || medicalDevices[0];

  const activeDeviceEvents = useMemo(() => {
    const map = new Map<string, typeof events[number]>();
    events
      .filter(e => e.deviceId && (e.status === 'new' || e.status === 'acknowledged'))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .forEach(e => {
        if (e.deviceId && !map.has(e.deviceId)) map.set(e.deviceId, e);
      });
    return map;
  }, [events]);

  const activeEvent = selectedDevice ? activeDeviceEvents.get(selectedDevice.id) : undefined;
  const selectedAssessment = selectedDevice ? assessMedicalDevice(selectedDevice, events) : undefined;
  const selectedTimeline = selectedDevice ? getDeviceTimeline(selectedDevice, events) : [];
  const selectedNetworkPath = selectedDevice ? getDeviceNetworkPath(selectedDevice, activeEvent) : [];

  const deviceTypes = useMemo(
    () => Array.from(new Set(medicalDevices.map(d => d.type).filter(Boolean))).sort(),
    [medicalDevices]
  );
  const networkZones = useMemo(
    () => Array.from(new Set(medicalDevices.map(d => d.networkZone || 'Clinical VLAN'))).sort(),
    [medicalDevices]
  );

  const filteredDevices = useMemo(() => {
    const query = deviceSearch.trim().toLowerCase();
    return medicalDevices.filter(device => {
      const searchable = [
        device.name,
        device.ip,
        device.type,
        device.location,
        device.manufacturer,
        device.model,
      ].filter(Boolean).join(' ').toLowerCase();

      if (query && !searchable.includes(query)) return false;
      if (deviceTypeFilter !== 'all' && device.type !== deviceTypeFilter) return false;
      if (statusFilter !== 'all' && device.status !== statusFilter) return false;
      if (criticalityFilter !== 'all' && device.clinicalCriticality !== criticalityFilter) return false;
      if (connectionFilter === 'connected' && !device.patientConnected) return false;
      if (connectionFilter === 'not_connected' && device.patientConnected) return false;
      if (networkZoneFilter !== 'all' && (device.networkZone || 'Clinical VLAN') !== networkZoneFilter) return false;
      if (anomaliesOnly && !activeDeviceEvents.has(device.id)) return false;
      return true;
    });
  }, [
    medicalDevices,
    deviceSearch,
    deviceTypeFilter,
    statusFilter,
    criticalityFilter,
    connectionFilter,
    networkZoneFilter,
    anomaliesOnly,
    activeDeviceEvents,
  ]);

  const anomalyCount = activeDeviceEvents.size;
  const onlineCount = medicalDevices.filter(d => d.status === 'online').length;
  const patientConnectedCount = medicalDevices.filter(d => d.patientConnected).length;

  const hasDeviceFilters =
    deviceSearch.trim() ||
    deviceTypeFilter !== 'all' ||
    statusFilter !== 'all' ||
    criticalityFilter !== 'all' ||
    connectionFilter !== 'all' ||
    networkZoneFilter !== 'all' ||
    anomaliesOnly;

  const clearDeviceFilters = () => {
    setDeviceSearch('');
    setDeviceTypeFilter('all');
    setStatusFilter('all');
    setCriticalityFilter('all');
    setConnectionFilter('all');
    setNetworkZoneFilter('all');
    setAnomaliesOnly(false);
  };

  const handleContain = () => {
    if (!selectedDevice || !activeEvent) return;
    safeContainDevice(selectedDevice.id, activeEvent.id);
  };

  const handleEscalate = () => {
    if (!selectedDevice || !activeEvent) return;
    escalateClinicalDevice(selectedDevice.id, activeEvent.id);
  };

  const handleAllow = () => {
    if (!activeEvent) return;
    resolveSecurityEvent(
      activeEvent.id,
      'Allow / Mark Reviewed',
      'SOC analyst reviewed the synthetic medical-device telemetry and determined that containment was not required.'
    );
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="badge bg-positive-light">LIVE CLINICAL INFRASTRUCTURE</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Synthetic device environment</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Medical Devices
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem', maxWidth: '760px', lineHeight: 1.55 }}>
            Monitor connected clinical devices, their synthetic patient telemetry, network behavior, and cybersecurity state from one SOC workspace.
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          padding: '0.65rem 0.9rem',
          borderRadius: '10px',
          background: '#ecfdf5',
          color: '#047857',
          border: '1px solid #a7f3d0',
          fontSize: '0.8rem',
          fontWeight: 800,
        }}>
          <CircleDot size={15} className="animate-pulse" />
          MONITORING ACTIVE
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Clinical devices', value: medicalDevices.length, icon: Cpu, tone: 'var(--accent-primary)' },
          { label: 'Online', value: onlineCount, icon: CheckCircle2, tone: 'var(--positive)' },
          { label: 'Patient connected', value: patientConnectedCount, icon: UserRound, tone: 'var(--accent-secondary)' },
          { label: 'Active anomalies', value: anomalyCount, icon: anomalyCount ? AlertTriangle : ShieldCheck, tone: anomalyCount ? 'var(--critical)' : 'var(--positive)' },
        ].map(metric => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="card" style={{ padding: '1.15rem 1.25rem', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', fontWeight: 700 }}>{metric.label}</span>
                <Icon size={18} color={metric.tone} />
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--text-primary)' }}>{metric.value}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.55fr) minmax(360px, 0.85fr)', gap: '1.25rem', alignItems: 'start' }}>
        <div className="card" style={{ padding: '1.35rem', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-primary)' }}>Clinical Device Inventory</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.15rem' }}>Select a device to inspect telemetry and security context.</p>
            </div>
            <Stethoscope size={21} color="var(--accent-primary)" />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            gap: '0.7rem',
            padding: '0.8rem',
            marginBottom: '1rem',
            background: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0 }}>
              <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              <input
                value={deviceSearch}
                onChange={e => setDeviceSearch(e.target.value)}
                placeholder="Search device, IP, model, manufacturer..."
                aria-label="Search medical devices"
                style={{
                  width: '100%',
                  minWidth: 0,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem',
                }}
              />
            </div>
            <button
              type="button"
              onClick={clearDeviceFilters}
              disabled={!hasDeviceFilters}
              className="btn btn-outline"
              style={{ fontSize: '0.7rem', padding: '0.45rem 0.7rem', opacity: hasDeviceFilters ? 1 : 0.5 }}
            >
              Clear
            </button>

            <div style={{
              gridColumn: '1 / -1',
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(120px, 1fr))',
              gap: '0.55rem',
            }}>
              {[
                { value: deviceTypeFilter, set: setDeviceTypeFilter, label: 'Device type', options: deviceTypes },
                { value: statusFilter, set: setStatusFilter, label: 'Status', options: ['online', 'flagged', 'isolated'] },
                { value: criticalityFilter, set: setCriticalityFilter, label: 'Clinical criticality', options: ['critical', 'high', 'medium', 'low'] },
                { value: connectionFilter, set: setConnectionFilter, label: 'Patient connection', options: ['connected', 'not_connected'] },
                { value: networkZoneFilter, set: setNetworkZoneFilter, label: 'Network zone', options: networkZones },
              ].map(filter => (
                <label key={filter.label} style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: '0.61rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    {filter.label}
                  </span>
                  <select
                    value={filter.value}
                    onChange={e => filter.set(e.target.value)}
                    style={{
                      width: '100%',
                      minWidth: 0,
                      height: '34px',
                      padding: '0 0.5rem',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      background: 'white',
                      color: 'var(--text-primary)',
                      fontSize: '0.68rem',
                      fontWeight: 650,
                      outline: 'none',
                    }}
                  >
                    <option value="all">All</option>
                    {filter.options.map(option => (
                      <option key={option} value={option}>
                        {option === 'not_connected' ? 'Not connected' : option.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setAnomaliesOnly(value => !value)}
                aria-pressed={anomaliesOnly}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  border: anomaliesOnly ? '1px solid #f59e0b' : '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '0.42rem 0.65rem',
                  background: anomaliesOnly ? '#fff7ed' : 'white',
                  color: anomaliesOnly ? '#c2410c' : 'var(--text-secondary)',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <AlertTriangle size={13} />
                Anomalies only
              </button>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                Showing {filteredDevices.length} of {medicalDevices.length} devices
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '0.7rem' }}>
            {filteredDevices.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '10px', color: 'var(--text-muted)' }}>
                <SlidersHorizontal size={22} style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>No devices match these filters</div>
                <div style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>Adjust the filters or clear them to restore the full inventory.</div>
              </div>
            ) : filteredDevices.map(device => {
              const tone = statusTone(device.status);
              const event = activeDeviceEvents.get(device.id);
              const isSelected = selectedDevice?.id === device.id;
              return (
                <button
                  key={device.id}
                  onClick={() => setSelectedId(device.id)}
                  style={{
                    textAlign: 'left',
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: isSelected ? '1.5px solid var(--accent-primary)' : event ? '1px solid #fed7aa' : '1px solid var(--border)',
                    background: isSelected ? 'var(--bg-hover)' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: 0 }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: event ? '#fff7ed' : '#eff6ff',
                        color: event ? '#c2410c' : 'var(--accent-primary)',
                        flexShrink: 0,
                      }}>
                        <HeartPulse size={21} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{device.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.73rem', marginTop: '0.15rem' }}>
                          {device.type} · {device.location}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      padding: '0.3rem 0.5rem',
                      borderRadius: '999px',
                      background: event ? '#fff7ed' : tone.bg,
                      color: event ? '#c2410c' : tone.fg,
                      fontSize: '0.64rem',
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                    }}>
                      {event ? 'ANOMALY' : tone.label}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', marginTop: '0.9rem' }}>
                    <div>
                      <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>NETWORK</div>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)' }}>{device.networkZone || 'Clinical VLAN'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>TRAFFIC</div>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: event ? 'var(--critical)' : 'var(--text-primary)' }}>
                        {device.currentTrafficMbps ?? '—'}{device.currentTrafficMbps ? ' Mbps' : ''}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>CRITICALITY</div>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>{device.clinicalCriticality || '—'}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedDevice && (
          <div className="card" style={{ padding: '1.35rem', background: 'white', position: 'sticky', top: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-primary)', fontSize: '0.72rem', fontWeight: 800 }}>
                  <HeartPulse size={15} /> DEVICE TELEMETRY
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>{selectedDevice.name}</h2>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{selectedDevice.model || selectedDevice.type} · {selectedDevice.ip}</p>
              </div>
              <span style={{
                padding: '0.35rem 0.55rem',
                borderRadius: '8px',
                background: statusTone(selectedDevice.status).bg,
                color: statusTone(selectedDevice.status).fg,
                fontSize: '0.66rem',
                fontWeight: 800,
              }}>
                {statusTone(selectedDevice.status).label}
              </span>
            </div>

            {selectedAssessment && (
              <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '10px', background: selectedAssessment.riskLabel === 'CRITICAL' || selectedAssessment.riskLabel === 'HIGH' ? '#fff7ed' : '#f0fdf4', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 800 }}>SECURITY RISK</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 850, marginTop: '0.2rem' }}>{selectedAssessment.riskScore}/100</div>
                  <div style={{ fontSize: '0.66rem', fontWeight: 800, color: selectedAssessment.riskLabel === 'LOW' ? 'var(--positive)' : 'var(--critical)' }}>{selectedAssessment.riskLabel}</div>
                </div>
                <div style={{ padding: '0.75rem', borderRadius: '10px', background: selectedAssessment.clinicalImpactLabel === 'CRITICAL' || selectedAssessment.clinicalImpactLabel === 'HIGH' ? '#fef2f2' : '#f8fafc', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 800 }}>CLINICAL IMPACT</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 850, marginTop: '0.2rem' }}>{selectedAssessment.clinicalImpactScore}/100</div>
                  <div style={{ fontSize: '0.66rem', fontWeight: 800, color: selectedAssessment.clinicalImpactLabel === 'LOW' ? 'var(--positive)' : 'var(--critical)' }}>{selectedAssessment.clinicalImpactLabel}</div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '1rem', padding: '0.9rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-primary)' }}>DEVICE STATE</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.65rem', marginTop: '0.65rem' }}>
                <div><div style={{ fontSize: '0.61rem', color: 'var(--text-muted)' }}>CLINICAL</div><div style={{ fontSize: '0.72rem', fontWeight: 800 }}>{selectedAssessment?.healthStatus || 'UNKNOWN'}</div></div>
                <div><div style={{ fontSize: '0.61rem', color: 'var(--text-muted)' }}>CYBER</div><div style={{ fontSize: '0.72rem', fontWeight: 800 }}>{selectedAssessment?.cyberStatus || 'UNKNOWN'}</div></div>
                <div><div style={{ fontSize: '0.61rem', color: 'var(--text-muted)' }}>LIFECYCLE</div><div style={{ fontSize: '0.72rem', fontWeight: 800 }}>{(selectedDevice.lifecycleStatus || 'active').toUpperCase()}</div></div>
              </div>
            </div>

            <div style={{ marginTop: '1rem', padding: '0.9rem', borderRadius: '10px', background: 'white', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-primary)' }}>DETERMINISTIC DETECTION</div>
              <div style={{ display: 'grid', gap: '0.45rem', marginTop: '0.65rem' }}>
                {(selectedAssessment?.findings || []).filter(f => f.triggered).map(f => (
                  <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.7rem' }}>
                    <span style={{ fontWeight: 750, color: 'var(--text-secondary)' }}>{f.label}</span>
                    <span style={{ fontWeight: 800, color: 'var(--critical)', whiteSpace: 'nowrap' }}>+{f.points}</span>
                  </div>
                ))}
                {(selectedAssessment?.findings || []).every(f => !f.triggered) && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--positive)', fontWeight: 700 }}>No deterministic anomaly rules triggered.</div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '1rem', padding: '0.9rem', borderRadius: '10px', background: 'white', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-primary)' }}>NETWORK PATH</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
                {selectedNetworkPath.map((node, index) => (
                  <span key={node + index} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ padding: '0.3rem 0.45rem', borderRadius: '7px', background: index === selectedNetworkPath.length - 1 ? '#fff7ed' : '#f8fafc', border: '1px solid var(--border)', fontSize: '0.66rem', fontWeight: 750 }}>{node}</span>
                    {index < selectedNetworkPath.length - 1 && <ChevronRight size={12} color="var(--text-muted)" />}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '1rem', padding: '0.9rem', borderRadius: '10px', background: 'white', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800 }}>DEVICE LIFECYCLE</div>
                <span style={{ fontSize: '0.63rem', fontWeight: 800, color: 'var(--positive)' }}>{selectedDevice.lifecycleStatus?.toUpperCase() || 'ACTIVE'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem', marginTop: '0.65rem', fontSize: '0.68rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Firmware</span><div style={{ fontWeight: 750 }}>{selectedDevice.firmwareVersion || 'Synthetic'}</div></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Last maintenance</span><div style={{ fontWeight: 750 }}>{selectedDevice.lastMaintenance || '—'}</div></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Maintenance window</span><div style={{ fontWeight: 750 }}>{selectedDevice.maintenanceWindow || '—'}</div></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Biomedical owner</span><div style={{ fontWeight: 750 }}>{selectedDevice.assignedBiomedicalEngineer || '—'}</div></div>
              </div>
            </div>

            <div style={{ marginTop: '1rem', padding: '0.9rem', borderRadius: '10px', background: 'white', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800 }}>DEVICE TIMELINE</div>
              <div style={{ marginTop: '0.65rem', display: 'grid', gap: '0.55rem' }}>
                {selectedTimeline.length === 0 ? (
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>No security events recorded for this device.</div>
                ) : selectedTimeline.slice(0, 6).map(item => (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '62px 1fr', gap: '0.55rem', fontSize: '0.67rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <div><div style={{ fontWeight: 800 }}>{item.title}</div><div style={{ color: 'var(--text-muted)', marginTop: '0.1rem' }}>{item.source} · {item.status}</div></div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '1rem', padding: '0.9rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800 }}>CORRELATED SECURITY SIGNALS</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.45 }}>
                {selectedTimeline.length} event(s) are linked directly to this device. Active signals are correlated into the existing Incident Core; no second incident store is created.
              </div>
            </div>

            <div style={{ marginTop: '1.15rem', display: 'grid', gap: '0.65rem' }}>
              {Object.entries(selectedDevice.telemetry || {}).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.7rem 0.75rem', borderRadius: '9px', background: 'var(--bg-main)' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{key}</span>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1rem', padding: '0.9rem', borderRadius: '10px', background: activeEvent ? '#fff7ed' : '#f8fafc', border: activeEvent ? '1px solid #fed7aa' : '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.72rem', fontWeight: 800, color: activeEvent ? '#c2410c' : 'var(--text-primary)' }}>
                {activeEvent ? <Siren size={15} /> : <Network size={15} />}
                {activeEvent ? 'CYBERSECURITY ANOMALY' : 'NETWORK BASELINE'}
              </div>
              <div style={{ marginTop: '0.45rem', fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {activeEvent
                  ? activeEvent.description
                  : `Normal traffic baseline: ${selectedDevice.normalTrafficMbps ?? '—'} Mbps. Current traffic: ${selectedDevice.currentTrafficMbps ?? '—'} Mbps.`}
              </div>
            </div>

            {activeEvent && (
              <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', border: '1px solid #fecaca', background: '#fef2f2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c', fontWeight: 800, fontSize: '0.82rem' }}>
                  <AlertTriangle size={17} /> SOC DECISION REQUIRED
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '0.8rem' }}>
                  <div><span style={{ fontSize: '0.65rem', color: '#991b1b' }}>RISK</span><div style={{ fontWeight: 800, fontSize: '0.9rem' }}>HIGH</div></div>
                  <div><span style={{ fontSize: '0.65rem', color: '#991b1b' }}>CLINICAL IMPACT</span><div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{selectedDevice.clinicalCriticality === 'critical' ? 'HIGH' : 'MEDIUM'}</div></div>
                </div>
                <p style={{ marginTop: '0.8rem', fontSize: '0.73rem', color: '#7f1d1d', lineHeight: 1.5 }}>
                  This is a synthetic security event. The device stays operational. CareSentinel recommends containing the malicious network path upstream rather than directly isolating a patient-connected device.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.9rem' }}>
                  <button onClick={handleContain} className="btn btn-primary" style={{ flex: 1, minWidth: '180px', background: 'var(--accent-primary)', borderColor: 'var(--accent-primary)', fontSize: '0.75rem' }}>
                    <ShieldCheck size={15} /> Approve Safe Containment
                  </button>
                  <button onClick={handleEscalate} className="btn btn-secondary" style={{ flex: 1, minWidth: '180px', fontSize: '0.75rem' }}>
                    <Stethoscope size={15} /> Escalate Clinical Team
                  </button>
                  <button onClick={handleAllow} className="btn btn-outline" style={{ flex: 1, fontSize: '0.75rem' }}>
                    <XCircle size={15} /> Dismiss
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.72rem' }}>
              <div style={{ gridColumn: '1 / -1', padding: '0.7rem', background: '#f8fafc', borderRadius: '9px', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--text-muted)' }}>Response owners</div>
                <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{selectedDevice.assignedPhysician || 'Clinical team'} · {selectedDevice.assignedBiomedicalEngineer || 'Biomedical Engineering'}</div>
                <div style={{ color: 'var(--text-muted)', marginTop: '0.15rem' }}>{selectedDevice.bedOrLocation || selectedDevice.location}</div>
              </div>
              <div style={{ padding: '0.7rem', background: 'var(--bg-main)', borderRadius: '9px' }}>
                <div style={{ color: 'var(--text-muted)' }}>Manufacturer</div>
                <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{selectedDevice.manufacturer || 'Synthetic'}</div>
              </div>
              <div style={{ padding: '0.7rem', background: 'var(--bg-main)', borderRadius: '9px' }}>
                <div style={{ color: 'var(--text-muted)' }}>Patient connected</div>
                <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{selectedDevice.patientConnected ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ padding: '1.15rem 1.3rem', background: '#f8fafc', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={18} color="var(--accent-primary)" />
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)' }}>Clinical safety boundary</div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
          Device readings and traffic are synthetic for the demo. CareSentinel separates patient telemetry from cybersecurity telemetry and requires SOC approval before disruptive containment of a clinically connected device.
        </p>
      </div>
    </div>
  );
}
