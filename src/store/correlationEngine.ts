import type { SecurityEvent, CorrelatedIncident, RiskFactor, Severity } from './types';
import { assessMedicalDevice } from './deviceSecurityEngine';

export function calculateIncidentRisk(eventIds: string[], events: SecurityEvent[]): number {
  const incidentEvents = events.filter(e => eventIds.includes(e.id));
  if (incidentEvents.length === 0) return 0;
  
  // Deterministic signal weights based on CareSentinel specification
  let totalPoints = 0;
  const categories = new Set(incidentEvents.map(e => e.category));

  incidentEvents.forEach(e => {
    switch (e.eventType) {
      case 'PHISHING_DETECTED':
      case 'EMAIL_RECEIVED':
        totalPoints += 14;
        break;
      case 'SUSPICIOUS_LINK':
        totalPoints += 18;
        break;
      case 'ATTACHMENT_ANALYZED':
        totalPoints += 12;
        break;
      case 'CREDENTIAL_COMPROMISE':
        totalPoints += 20;
        break;
      case 'UNKNOWN_DEVICE':
        totalPoints += 15;
        break;
      case 'UNUSUAL_LOGIN':
        totalPoints += 16;
        break;
      case 'PORT_SCAN':
        totalPoints += 15;
        break;
      case 'BRUTE_FORCE':
        totalPoints += 16;
        break;
      case 'SUSPICIOUS_OUTBOUND':
        totalPoints += 15;
        break;
      case 'APP_PROBE':
      case 'API_ABUSE':
        totalPoints += 16;
        break;
      case 'EHR_ACCESS':
        totalPoints += 18;
        break;
      case 'EHR_BULK_ACCESS':
        totalPoints += 22;
        break;
      default:
        totalPoints += (e.riskContribution || 10);
    }
  });

  // Cross-domain correlation synergy multiplier
  if (categories.size >= 4) {
    totalPoints = Math.round(totalPoints * 1.15);
  } else if (categories.size >= 3) {
    totalPoints = Math.round(totalPoints * 1.08);
  }

  return Math.min(100, Math.max(30, totalPoints));
}

function determineSeverity(score: number): Severity {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export function correlateEvents(events: SecurityEvent[], existingIncidents: CorrelatedIncident[]): CorrelatedIncident[] {
  const activeEvents = events.filter(e => e.status === 'new' || e.status === 'acknowledged');
  if (activeEvents.length === 0) return [];

  // Group events by target entity: primarily userId, fallback to network/infrastructure
  const byUser: Record<string, SecurityEvent[]> = {};
  const networkEvents: SecurityEvent[] = [];
  const standaloneEHREvents: SecurityEvent[] = [];

  activeEvents.forEach(e => {
    if (e.userId) {
      if (!byUser[e.userId]) byUser[e.userId] = [];
      byUser[e.userId].push(e);
    } else if (e.category === 'network' || e.category === 'application') {
      networkEvents.push(e);
    } else if (e.category === 'ehr') {
      standaloneEHREvents.push(e);
    }
  });

  // Preserve existing incidents as base
  let updatedIncidents: CorrelatedIncident[] = [...existingIncidents];

  // 1. User-Centered Multi-Vector Correlation (e.g. Dr. Sarah Wilson)
  Object.entries(byUser).forEach(([userId, userEvents]) => {
    const categories = new Set(userEvents.map(e => e.category));
    const eventTypes = new Set(userEvents.map(e => e.eventType));

    // Correlation Rule: Requires 2+ related events with high/critical signals
    // Example: Phishing + Credential Compromise, or Credential Compromise + Unusual Login, or EHR Abuse + Login
    const hasPhishing = eventTypes.has('PHISHING_DETECTED') || eventTypes.has('SUSPICIOUS_LINK');
    const hasCreds = eventTypes.has('CREDENTIAL_COMPROMISE');
    const hasLogin = eventTypes.has('UNUSUAL_LOGIN') || eventTypes.has('UNKNOWN_DEVICE');
    const hasEHR = eventTypes.has('EHR_ACCESS') || eventTypes.has('EHR_BULK_ACCESS');

    const shouldCorrelate = 
      (hasPhishing && (hasCreds || hasLogin || hasEHR)) ||
      (hasCreds && (hasLogin || hasEHR)) ||
      (hasLogin && hasEHR) ||
      (userEvents.length >= 3 && categories.size >= 2);

    if (shouldCorrelate) {
      const eventIds = userEvents.map(e => e.id);
      const riskScore = calculateIncidentRisk(eventIds, events);
      const severity = determineSeverity(riskScore);
      const systems = Array.from(new Set(userEvents.map(e => e.system)));

      const riskFactors: RiskFactor[] = userEvents.map(e => ({
        id: `rf-${e.id}`,
        label: `${e.title} (+${e.riskContribution || 15})`,
        deduction: e.riskContribution || 15,
        eventId: e.id,
        category: e.category,
      }));

      const existingIdx = updatedIncidents.findIndex(inc => 
        inc.affectedUserId === userId && inc.status !== 'resolved'
      );

      const title = hasEHR && (hasCreds || hasLogin)
        ? 'Possible Clinical Account Compromise & EHR Abuse'
        : hasCreds && hasLogin
        ? 'Possible Account Compromise: Dr. Sarah Wilson'
        : 'Multi-Stage Phishing & Credential Intrusion';

      const recommendedActions = [
        'Isolate simulated device Unknown-Device-External (192.168.1.100)',
        'Revoke active EHR session tokens for dr.sarah',
        'Flag user account for mandatory credential reset',
        'Block domain "secure-hospital-login.example" in LinkGuard',
        'Quarantine related phishing emails and malicious attachments',
        'Export forensic audit trail for HIPAA incident response'
      ];

      if (existingIdx >= 0) {
        const inc = updatedIncidents[existingIdx];
        updatedIncidents[existingIdx] = {
          ...inc,
          eventIds: Array.from(new Set([...inc.eventIds, ...eventIds])),
          affectedSystems: Array.from(new Set([...inc.affectedSystems, ...systems])),
          riskScore: Math.max(inc.riskScore, riskScore),
          severity,
          title,
          riskFactors,
          updatedAt: new Date().toISOString(),
          recommendedActions,
        };
      } else {
        const newInc: CorrelatedIncident = {
          id: 'INC-001',
          title,
          severity,
          status: 'active',
          affectedUserId: userId,
          affectedSystems: systems,
          eventIds,
          riskScore,
          riskFactors,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          description: `CareSentinel Correlation Engine synthesized ${userEvents.length} events spanning ${categories.size} telemetry categories (${Array.from(categories).join(', ')}). Multiple related signals involving user ${userId} correlate into an active clinical threat.`,
          assignedInvestigator: 'SOC Analyst L2 (Synthetic)',
          recommendedActions,
          notes: [
            {
              id: `note-${Date.now()}`,
              author: 'CareSentinel Correlation Engine',
              timestamp: new Date().toISOString(),
              text: `Deterministic correlation rule fired: Unified sequence detected across ${Array.from(categories).join(' -> ')} with risk score ${riskScore}/100.`
            }
          ]
        };
        updatedIncidents.unshift(newInc);
      }
    }
  });

  // 2. Medical-device correlation: multiple signals against one clinical asset
  const byDevice: Record<string, SecurityEvent[]> = {};
  activeEvents.filter(event => event.deviceId).forEach(event => {
    const deviceId = event.deviceId as string;
    if (!byDevice[deviceId]) byDevice[deviceId] = [];
    byDevice[deviceId].push(event);
  });

  Object.entries(byDevice).forEach(([deviceId, deviceEvents]) => {
    const device = events.find(event => event.deviceId === deviceId);
    const deviceState = device ? undefined : undefined;
    const eventIds = deviceEvents.map(event => event.id);
    const activeDevice = deviceId;
    const latestEvent = deviceEvents[0];
    const riskScore = calculateIncidentRisk(eventIds, events);
    const existingIdx = updatedIncidents.findIndex(inc =>
      inc.affectedDeviceIds?.includes(activeDevice) && inc.status !== 'resolved'
    );

    // Device telemetry is evaluated by the same deterministic engine used by Devices.
    // The correlation layer only needs the resulting score; it does not create a second state model.
    const syntheticDevice = (globalThis as { __careSentinelDevices?: Record<string, import('./types').SimulatedDevice> }).__careSentinelDevices?.[deviceId];
    const clinicalImpactScore = syntheticDevice
      ? assessMedicalDevice(syntheticDevice, events).clinicalImpactScore
      : latestEvent.severity === 'critical' ? 90 : latestEvent.severity === 'high' ? 70 : 45;

    const title = `Medical Device Security Investigation — ${latestEvent?.actor || deviceId}`;
    const riskFactors: RiskFactor[] = deviceEvents.map(event => ({
      id: `rf-${event.id}`,
      label: `${event.title} (+${event.riskContribution || 15})`,
      deduction: event.riskContribution || 15,
      eventId: event.id,
      category: event.category,
    }));

    if (existingIdx >= 0) {
      updatedIncidents[existingIdx] = {
        ...updatedIncidents[existingIdx],
        eventIds: Array.from(new Set([...updatedIncidents[existingIdx].eventIds, ...eventIds])),
        affectedDeviceIds: [activeDevice],
        riskScore: Math.max(updatedIncidents[existingIdx].riskScore, riskScore),
        severity: determineSeverity(riskScore),
        clinicalImpactScore,
        updatedAt: new Date().toISOString(),
        riskFactors,
      };
    } else {
      updatedIncidents.unshift({
        id: `INC-DEV-${Date.now().toString().slice(-6)}`,
        title,
        severity: determineSeverity(riskScore),
        status: 'investigating',
        affectedDeviceIds: [activeDevice],
        affectedSystems: Array.from(new Set(deviceEvents.map(event => event.system))),
        eventIds,
        riskScore,
        clinicalImpactScore,
        riskFactors,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: `Deterministic device correlation linked ${deviceEvents.length} active security signal(s) to medical device ${deviceId}. Clinical impact is scored separately from cybersecurity risk.`,
        assignedInvestigator: 'SOC Analyst L2 (Synthetic)',
        recommendedActions: [
          'Review device timeline and network path',
          'Validate clinical operating state',
          'Assess upstream containment before direct device isolation',
          'Escalate to biomedical engineering when required',
        ],
        notes: [{
          id: `note-device-${Date.now()}`,
          author: 'CareSentinel Device Correlation Rule',
          timestamp: new Date().toISOString(),
          text: `Deterministic device correlation fired for ${deviceId}; ${deviceEvents.length} active signal(s) linked.`,
        }],
      });
    }
  });

  // 2. Network & Authentication Incident Correlation (Port Scan + Brute Force)
  const netTypes = new Set(networkEvents.map(e => e.eventType));
  if (netTypes.has('PORT_SCAN') && netTypes.has('BRUTE_FORCE')) {
    const netEventIds = networkEvents.map(e => e.id);
    const existingNetIdx = updatedIncidents.findIndex(inc => 
      inc.title.includes('Network Reconnaissance') && inc.status !== 'resolved'
    );

    const netRisk = calculateIncidentRisk(netEventIds, events);
    const netSev = determineSeverity(netRisk);
    const netSystems = Array.from(new Set(networkEvents.map(e => e.system)));

    const netRiskFactors: RiskFactor[] = networkEvents.map(e => ({
      id: `rf-${e.id}`,
      label: `${e.title} (+${e.riskContribution || 15})`,
      deduction: e.riskContribution || 15,
      eventId: e.id,
      category: e.category,
    }));

    const netActions = [
      'Block source IP 10.0.0.45 at clinical edge firewall',
      'Enable rate-limiting & tarpitting on DMZ reverse proxy',
      'Audit SSH and reverse proxy authentication logs'
    ];

    if (existingNetIdx >= 0) {
      updatedIncidents[existingNetIdx] = {
        ...updatedIncidents[existingNetIdx],
        eventIds: Array.from(new Set([...updatedIncidents[existingNetIdx].eventIds, ...netEventIds])),
        affectedSystems: Array.from(new Set([...updatedIncidents[existingNetIdx].affectedSystems, ...netSystems])),
        riskScore: netRisk,
        severity: netSev,
        riskFactors: netRiskFactors,
        updatedAt: new Date().toISOString(),
      };
    } else {
      updatedIncidents.push({
        id: `INC-${Date.now().toString().slice(-4)}`,
        title: 'Coordinated Network Reconnaissance & Auth Brute Force',
        severity: netSev,
        status: 'active',
        affectedSystems: netSystems,
        eventIds: netEventIds,
        riskScore: netRisk,
        riskFactors: netRiskFactors,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: 'Correlation Engine detected port scanning on clinical server ports immediately paired with rapid brute-force authentication against the DMZ reverse proxy.',
        assignedInvestigator: 'Network Security Analyst (Synthetic)',
        recommendedActions: netActions,
        notes: [
          {
            id: `note-net-${Date.now()}`,
            author: 'Network Threat Correlation Rule',
            timestamp: new Date().toISOString(),
            text: 'Port scan reconnaissance followed by credential brute force from internal subnet 10.0.0.45.'
          }
        ]
      });
    }
  }

  return updatedIncidents;
}
