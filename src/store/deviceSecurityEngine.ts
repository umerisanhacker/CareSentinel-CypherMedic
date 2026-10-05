import type { SecurityEvent, SimulatedDevice } from './types';

export type DeviceRuleId =
  | 'TRAFFIC_SPIKE'
  | 'CONNECTION_SPIKE'
  | 'UNKNOWN_DESTINATION'
  | 'NETWORK_ZONE_DEVIATION'
  | 'CRITICAL_PATIENT_DEVICE'
  | 'DEVICE_FLAGGED'
  | 'DEVICE_ISOLATED';

export interface DeviceRuleFinding {
  id: DeviceRuleId;
  label: string;
  points: number;
  triggered: boolean;
  detail: string;
}

export interface DeviceSecurityAssessment {
  riskScore: number;
  clinicalImpactScore: number;
  riskLabel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  clinicalImpactLabel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  trafficRatio: number;
  baselineTraffic: number;
  currentTraffic: number;
  connectionCount?: number;
  unknownDestinationCount: number;
  healthStatus: 'NORMAL' | 'WARNING' | 'CRITICAL';
  cyberStatus: 'NORMAL' | 'ANOMALY' | 'ISOLATED';
  findings: DeviceRuleFinding[];
}

const severityWeight: Record<SecurityEvent['severity'], number> = {
  info: 5,
  low: 10,
  medium: 18,
  high: 25,
  critical: 30,
};

function riskLabel(score: number): DeviceSecurityAssessment['riskLabel'] {
  if (score >= 80) return 'CRITICAL';
  if (score >= 55) return 'HIGH';
  if (score >= 30) return 'MEDIUM';
  return 'LOW';
}

function impactLabel(score: number): DeviceSecurityAssessment['clinicalImpactLabel'] {
  if (score >= 80) return 'CRITICAL';
  if (score >= 55) return 'HIGH';
  if (score >= 25) return 'MEDIUM';
  return 'LOW';
}

function numberMeta(event: SecurityEvent | undefined, key: string): number | undefined {
  const value = event?.metadata?.[key];
  return typeof value === 'number' ? value : undefined;
}

export function assessMedicalDevice(
  device: SimulatedDevice,
  events: SecurityEvent[],
): DeviceSecurityAssessment {
  const deviceEvents = events.filter(
    event => event.deviceId === device.id && (event.status === 'new' || event.status === 'acknowledged')
  );
  const activeEvent = [...deviceEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];

  const baselineTraffic = device.normalTrafficMbps ?? 0;
  const currentTraffic = device.currentTrafficMbps ?? baselineTraffic;
  const trafficRatio = baselineTraffic > 0 ? currentTraffic / baselineTraffic : 1;
  const connectionCount = numberMeta(activeEvent, 'connectionCount');
  const baselineConnections = numberMeta(activeEvent, 'baselineConnections') ?? 0;
  const unknownDestinationCount =
    numberMeta(activeEvent, 'unknownDestinations') ??
    numberMeta(activeEvent, 'unknownDestinationCount') ??
    0;

  const findings: DeviceRuleFinding[] = [
    {
      id: 'TRAFFIC_SPIKE',
      label: 'Traffic exceeds synthetic baseline',
      points: 25,
      triggered: trafficRatio >= 3,
      detail: trafficRatio >= 3
        ? `${trafficRatio.toFixed(1)}× baseline traffic observed.`
        : 'Traffic remains within the synthetic baseline envelope.',
    },
    {
      id: 'CONNECTION_SPIKE',
      label: 'Connection count exceeds baseline',
      points: 15,
      triggered: Boolean(connectionCount && baselineConnections && connectionCount >= baselineConnections * 4),
      detail: connectionCount && baselineConnections
        ? `${connectionCount} connections observed against a baseline of ${baselineConnections}.`
        : 'No connection-count deviation recorded.',
    },
    {
      id: 'UNKNOWN_DESTINATION',
      label: 'Unknown network destinations',
      points: 20,
      triggered: unknownDestinationCount > 0,
      detail: unknownDestinationCount > 0
        ? `${unknownDestinationCount} previously unseen destination(s) observed.`
        : 'No unknown destinations recorded.',
    },
    {
      id: 'NETWORK_ZONE_DEVIATION',
      label: 'Network-zone deviation',
      points: 10,
      triggered: Boolean(activeEvent?.metadata?.networkZoneDeviation),
      detail: activeEvent?.metadata?.networkZoneDeviation
        ? String(activeEvent.metadata.networkZoneDeviation)
        : 'No network-zone deviation recorded.',
    },
    {
      id: 'CRITICAL_PATIENT_DEVICE',
      label: 'Patient-connected critical device',
      points: 20,
      triggered: Boolean(device.patientConnected && device.clinicalCriticality === 'critical'),
      detail: device.patientConnected && device.clinicalCriticality === 'critical'
        ? 'Patient-connected critical clinical asset; disruptive isolation requires safety review.'
        : 'Device does not meet the critical patient-connected condition.',
    },
    {
      id: 'DEVICE_FLAGGED',
      label: 'Device is flagged',
      points: 10,
      triggered: device.status === 'flagged',
      detail: device.status === 'flagged' ? 'Device currently has an active anomaly state.' : 'Device is not currently flagged.',
    },
    {
      id: 'DEVICE_ISOLATED',
      label: 'Device is isolated',
      points: 0,
      triggered: device.status === 'isolated',
      detail: device.status === 'isolated' ? 'Device is in synthetic isolation state.' : 'Device is not isolated.',
    },
  ];

  const eventPoints = deviceEvents.reduce((sum, event) => sum + Math.min(severityWeight[event.severity], 30), 0);
  const rulePoints = findings.filter(f => f.triggered).reduce((sum, f) => sum + f.points, 0);
  const riskScore = Math.min(100, Math.max(0, Math.round(Math.min(55, eventPoints) + rulePoints)));

  const criticalityBase: Record<NonNullable<SimulatedDevice['clinicalCriticality']>, number> = {
    low: 10,
    medium: 25,
    high: 55,
    critical: 75,
  };
  const impactScore = Math.min(
    100,
    Math.max(
      0,
      (device.clinicalCriticality ? criticalityBase[device.clinicalCriticality] : 10) +
        (device.patientConnected ? 20 : 0) +
        (device.safetyEnvelope?.clinicalApprovalRequired ? 5 : 0),
    ),
  );

  const healthStatus =
    device.clinicalOperationalStatus ??
    (Object.values(device.telemetry ?? {}).some(value => /alarm|critical|unstable|fault/i.test(value))
      ? 'critical'
      : 'normal');

  return {
    riskScore,
    clinicalImpactScore: impactScore,
    riskLabel: riskLabel(riskScore),
    clinicalImpactLabel: impactLabel(impactScore),
    trafficRatio,
    baselineTraffic,
    currentTraffic,
    connectionCount,
    unknownDestinationCount,
    healthStatus: healthStatus.toUpperCase() as DeviceSecurityAssessment['healthStatus'],
    cyberStatus: device.status === 'isolated' ? 'ISOLATED' : deviceEvents.length > 0 || device.status === 'flagged' ? 'ANOMALY' : 'NORMAL',
    findings,
  };
}

export function getDeviceTimeline(device: SimulatedDevice, events: SecurityEvent[]) {
  return events
    .filter(event => event.deviceId === device.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .map(event => ({
      id: event.id,
      timestamp: event.timestamp,
      severity: event.severity,
      title: event.title,
      description: event.description,
      source: event.source,
      status: event.status,
      responseStatus: event.responseStatus,
    }));
}

export function getDeviceNetworkPath(device: SimulatedDevice, event?: SecurityEvent) {
  const source = event?.metadata?.sourceIP || event?.metadata?.source || event?.actor || 'Synthetic Threat Simulator';
  const destination = event?.metadata?.destinationIP || device.ip;
  return [
    String(source),
    device.networkZone || 'Clinical VLAN',
    device.name,
    String(destination),
  ];
}
