import type { AppState, AuditEvent, AppNotification, SecurityEvent, SimulatedEmail, SimulatedEHRAccess } from './types';
import type { Action } from './actions';
import { calculatePosture } from './riskEngine';
import { correlateEvents, calculateIncidentRisk } from './correlationEngine';
import { createInitialBaseline } from './initialData';

function responseStatusForAction(actionName: string): SecurityEvent['responseStatus'] {
  const action = actionName.toLowerCase();
  if (action.includes('quarantine')) return 'quarantined';
  if (action.includes('block')) return 'blocked';
  if (action.includes('allow') || action.includes('release')) return 'allowed';
  if (action.includes('approve')) return 'approved';
  if (action.includes('decline') || action.includes('reject')) return 'declined';
  if (action.includes('isolate')) return 'isolated';
  if (action.includes('contain')) return 'contained';
  if (action.includes('review')) return 'reviewed';
  return 'resolved';
}

function synchronizeIncidentStatuses(incidents: AppState['incidents'], events: SecurityEvent[]): AppState['incidents'] {
  const now = new Date().toISOString();
  return incidents.map(incident => {
    if (incident.status === 'resolved') return incident;
    const hasActiveSignal = incident.eventIds.some(id =>
      events.some(event =>
        event.id === id &&
        (event.status === 'new' || event.status === 'acknowledged')
      )
    );
    return hasActiveSignal
      ? incident
      : { ...incident, status: 'resolved' as const, updatedAt: now };
  });
}

function resolveSecurityEvent(state: AppState, eventId: string, actionName: string, details?: string): AppState {
  const target = state.events.find(event => event.id === eventId);
  if (!target) return state;

  const updatedEvents = state.events.map(event =>
    event.id === eventId
      ? { ...event, status: 'resolved' as const, responseStatus: responseStatusForAction(actionName) }
      : event
  );

  const updatedIncidents = synchronizeIncidentStatuses(state.incidents, updatedEvents);

  const now = new Date().toISOString();
  const audit: AuditEvent = {
    id: 'aud-response-' + Date.now(),
    timestamp: now,
    actor: 'SOC Analyst',
    system: target.system,
    action: 'Response completed: ' + actionName,
    outcome: 'success',
    relatedEventId: eventId,
    details: details || target.description,
  };

  const resolvedIncidentIds = new Set(updatedIncidents.filter(i => i.status === 'resolved').map(i => i.id));
  const remainingNotifications = state.notifications.filter(
    notification => notification.relatedEventId !== eventId &&
      (!notification.relatedIncidentId || !resolvedIncidentIds.has(notification.relatedIncidentId))
  );

  return {
    ...state,
    events: updatedEvents,
    incidents: updatedIncidents,
    securityPosture: calculatePosture(updatedEvents),
    notifications: remainingNotifications,
    auditLog: [audit, ...state.auditLog],
  };
}

function createIncidentFromEvent(state: AppState, eventId: string): AppState {
  const event = state.events.find(e => e.id === eventId);
  if (!event) return state;

  const existing = state.incidents.find(incident =>
    incident.eventIds.includes(eventId) &&
    incident.status !== 'resolved'
  );
  if (existing) {
    return {
      ...state,
      selectedIncidentId: existing.id,
      currentView: 'Incidents',
      appMode: 'console',
    };
  }

  const now = new Date().toISOString();
  const riskScore = calculateIncidentRisk([event.id], state.events);
  const incidentId = `INC-SIG-${Date.now().toString().slice(-8)}`;
  const incident = {
    id: incidentId,
    title: `Identity Signal Investigation — ${event.actor || event.userId || 'Affected Account'}`,
    severity: event.severity,
    status: 'investigating' as const,
    affectedUserId: event.userId,
    affectedSystems: [event.system],
    eventIds: [event.id],
    riskScore,
    riskFactors: [{
      id: `rf-${event.id}`,
      label: event.title,
      deduction: event.riskContribution || 15,
      eventId: event.id,
      category: event.category,
    }],
    createdAt: now,
    updatedAt: now,
    description: `Analyst-initiated SOC investigation opened from the ${event.eventType} signal. The signal remains linked to the original telemetry and audit trail.`,
    assignedInvestigator: 'SOC Analyst L2 (Synthetic)',
    recommendedActions: [
      'Review authentication context and device identity',
      'Validate session timing and network origin',
      'Revoke or reset credentials if compromise is confirmed',
      'Review correlated EHR and application activity',
    ],
    notes: [{
      id: `note-signal-${Date.now()}`,
      author: 'SOC Workspace',
      timestamp: now,
      text: `Investigation opened directly from security signal ${event.id}; no automatic multi-vector incident existed yet.`,
    }],
  };

  const notifications = state.notifications.map(notification =>
    notification.relatedEventId === event.id
      ? { ...notification, relatedIncidentId: incidentId }
      : notification
  );

  return {
    ...state,
    incidents: [incident, ...state.incidents],
    notifications,
    selectedIncidentId: incidentId,
    currentView: 'Incidents',
    appMode: 'console',
  };
}

function createClinicalEscalationNotifications(device: AppState['devices'][number], eventId: string, timestamp: string): AppNotification[] {
  return [
    { id: 'not-clinical-' + Date.now(), title: 'Clinical Team Review Required', message: device.name + ' remains operational. Assigned physician ' + (device.assignedPhysician || 'clinical owner') + ' should verify patient/device behaviour.', timestamp, read: false, severity: 'high', relatedEventId: eventId, targetView: 'Devices' },
    { id: 'not-biomed-' + (Date.now() + 1), title: 'Biomedical Engineering Review Required', message: device.name + ' requires biomedical inspection of connectivity and device integrity. Engineer: ' + (device.assignedBiomedicalEngineer || 'Biomedical Engineering') + '.', timestamp, read: false, severity: 'high', relatedEventId: eventId, targetView: 'Devices' },
  ];
}

function safeContainClinicalDevice(state: AppState, deviceId: string, eventId: string): AppState {
  const device = state.devices.find(d => d.id === deviceId);
  const event = state.events.find(e => e.id === eventId);
  if (!device || !event) return state;
  const now = new Date().toISOString();
  const updatedEvents = state.events.map(e => e.id === eventId ? { ...e, status: 'resolved' as const, responseStatus: 'contained' as const, metadata: { ...e.metadata, containmentMode: 'UPSTREAM_SAFE_CONTAINMENT', clinicalOperationPreserved: true, patientMonitoringInterrupted: false, responseAuthorization: 'SOC_SAFE_CONTAINMENT_APPROVED' } } : e);
  const updatedDevices = state.devices.map(d => d.id === deviceId ? { ...d, status: 'online' as const, currentTrafficMbps: d.normalTrafficMbps ?? d.currentTrafficMbps } : d);
  const audit: AuditEvent = { id: 'aud-safe-contain-' + Date.now(), timestamp: now, actor: 'SOC Analyst', system: 'Clinical Safety Response Engine', action: 'Safe containment approved — malicious network path restricted', outcome: 'success', relatedEventId: eventId, details: 'Contained suspicious network activity upstream of ' + device.name + '; clinical operation preserved. Patient-connected device was not directly isolated.' };
  const notifications = createClinicalEscalationNotifications(device, eventId, now);
  notifications[0].message += ' SOC containment is active; patient monitoring was not interrupted.';
  notifications[1].message += ' SOC containment is active while the device remains clinically available.';
  return { ...state, events: updatedEvents, devices: updatedDevices, notifications: [...notifications, ...state.notifications], auditLog: [audit, ...state.auditLog], securityPosture: calculatePosture(updatedEvents) };
}

function escalateClinicalDevice(state: AppState, deviceId: string, eventId: string): AppState {
  const device = state.devices.find(d => d.id === deviceId);
  const event = state.events.find(e => e.id === eventId);
  if (!device || !event) return state;
  const now = new Date().toISOString();
  const notifications = createClinicalEscalationNotifications(device, eventId, now);
  const updatedEvents = state.events.map(e => e.id === eventId ? { ...e, responseStatus: 'reviewed' as const, metadata: { ...e.metadata, clinicalEscalation: 'ACTIVE', clinicalTeamNotified: true, biomedicalTeamNotified: true } } : e);
  const audit: AuditEvent = { id: 'aud-clinical-escalate-' + Date.now(), timestamp: now, actor: 'SOC Analyst', system: 'Clinical Safety Response Engine', action: 'Clinical + biomedical escalation initiated', outcome: 'success', relatedEventId: eventId, details: 'Assigned physician: ' + (device.assignedPhysician || 'Unassigned') + '; biomedical engineer: ' + (device.assignedBiomedicalEngineer || 'Unassigned') + '.' };
  return { ...state, events: updatedEvents, notifications: [...notifications, ...state.notifications], auditLog: [audit, ...state.auditLog] };
}
export function rootReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TRIGGER_SIMULATION': {
      const { simulationType } = action.payload;
      const timestamp = new Date().toISOString();
      const eventId = `sim-evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      
      let event: SecurityEvent;
      let auditAction = '';
      let notifTitle = '';
      let targetView = 'Overview';
      let notifSeverity: 'low' | 'medium' | 'high' | 'critical' = 'high';

      // Updates to module states
      let updatedEmails = [...state.emails];
      let updatedEHRAccesses = [...state.ehrAccesses];
      let updatedUsers = [...state.users];
      let updatedDevices = [...state.devices];
      let updatedNetworkNodes = [...state.networkNodes];
      let updatedAttachments = [...state.attachments];

      switch (simulationType) {
        case 'Phishing':
        case 'SIMULATE PHISHING': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'PHISHING_DETECTED',
            category: 'email',
            severity: 'high',
            title: 'Simulated Phishing Campaign Intercepted',
            description: 'Look-alike domain "hospital-support.example" targeting Dr. Sarah Wilson.',
            source: 'CareSentinel Email Gateway',
            actor: 'Dr. Sarah Wilson',
            userId: 'dr.sarah',
            system: 'Exchange / Email Gateway',
            status: 'new',
            riskContribution: 14,
            metadata: { 
              sender: 'hospital-billing@hospital-support.example', 
              domain: 'hospital-support.example', 
              lookalikeScore: 0.94,
              url: 'https://secure-hospital-login.example/account'
            },
          };
          auditAction = 'Synthetic phishing email injected & flagged by inbound heuristics';
          notifTitle = 'Phishing Email Intercepted';
          targetView = 'Email Security';
          notifSeverity = 'high';

          const newEmail: SimulatedEmail = {
            id: `em-sim-${Date.now()}`,
            sender: 'hospital-billing@hospital-support.example',
            senderName: 'Northstar Financial Support Desk',
            domain: 'hospital-support.example',
            recipient: 'sarah.wilson@northstar-med.org',
            recipientName: 'Dr. Sarah Wilson',
            subject: 'Urgent Patient Billing Reconciliation Manifest',
            preview: 'Action Required: Inpatient billing ledger updates must be verified prior to end of shift...',
            body: 'Dr. Wilson,\n\nPlease review the attached billing reconciliation manifest for Cardiology admissions. Due to regulatory policy revisions, you must authenticate via the hospital ledger portal link below:\n\nhttps://secure-hospital-login.example/account\n\nNorthstar Health Financial Office\nConfidentiality Notice: Simulated healthcare communication.',
            timestamp,
            risk: 'high',
            status: 'inbox',
            authIndicators: {
              syntaxValid: true,
              domainTrusted: false,
              displayNameMismatch: true,
              lookalikeDetected: true,
              syntheticSpf: 'FAIL',
              syntheticDkim: 'FAIL',
              syntheticDmarc: 'FAIL',
            },
            links: ['https://secure-hospital-login.example/account'],
            attachments: ['patient_billing_manifest.zip'],
          };
          updatedEmails = [newEmail, ...updatedEmails];

          // Phishing mail carries a synthetic attachment so the same simulation
          // propagates into Attachment Security without requiring a second click.
          const newAttachment = {
            id: `att-sim-${Date.now()}`,
            filename: 'patient_billing_manifest.zip',
            extension: '.zip' as const,
            detectedType: 'ZIP Archive (Synthetic)',
            size: '2.8 MB',
            hash: '7b3d4f0f8c2a9e11b8d4a7c1f0e6aa2c1d5f8b3e6c9a0d2f4b7e1c3a5d9f0b2',
            archiveDepth: 2,
            nestedFilesCount: 7,
            compressionRatio: 'HIGH' as const,
            executableContent: true,
            scriptIndicators: true,
            riskScore: 91,
            decision: 'SUSPICIOUS' as const,
            uploadedAt: timestamp,
            sender: 'hospital-billing@hospital-support.example',
          };
          // Attach it to the synthetic inbox event so Email Security and
          // Attachment Security tell the same story.
          updatedAttachments = [newAttachment, ...updatedAttachments];
          break;
        }

        case 'Malicious Link':
        case 'SIMULATE MALICIOUS LINK': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'SUSPICIOUS_LINK',
            category: 'linkguard',
            severity: 'critical',
            title: 'Malicious Credential Harvesting URL Intercepted',
            description: 'LinkGuard intercepted link to credential collection proxy: https://secure-hospital-login.example/account',
            source: 'LinkGuard Edge',
            actor: 'Dr. Sarah Wilson',
            userId: 'dr.sarah',
            system: 'LinkGuard Safe-Proxy',
            status: 'new',
            riskContribution: 18,
            metadata: { 
              url: 'https://secure-hospital-login.example/account', 
              domain: 'secure-hospital-login.example', 
              riskScore: 88, 
              decision: 'BLOCK',
              reasons: 'Credential collection pattern detected; Look-alike domain masquerading as hospital portal'
            },
          };
          auditAction = 'LinkGuard blocked simulated credential-harvesting URL';
          notifTitle = 'Malicious URL Intercepted by LinkGuard';
          targetView = 'LinkGuard';
          notifSeverity = 'critical';
          break;
        }

        case 'Credential Compromise':
        case 'SIMULATE CREDENTIAL COMPROMISE': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'CREDENTIAL_COMPROMISE',
            category: 'identity',
            severity: 'critical',
            title: 'Simulated Credential Replay Signal: Dr. Sarah Wilson',
            description: 'Active Directory token harvested through phishing replica site; OAuth token replay detected.',
            source: 'Identity Threat Telemetry',
            actor: 'Dr. Sarah Wilson',
            userId: 'dr.sarah',
            system: 'Hospital IAM Provider',
            status: 'new',
            riskContribution: 20,
            metadata: { tokenEntropy: 'high', authSource: 'External VPN Gateway', tokenCompromised: true },
          };
          auditAction = 'Simulated credential token exposure flagged in Identity Provider';
          notifTitle = 'Credential Compromise Signal';
          targetView = 'Identity';
          notifSeverity = 'critical';


          break;
        }

        case 'Medical Device Traffic':
        case 'SIMULATE MEDICAL DEVICE TRAFFIC': {
          const targetDevice = state.devices.find(d => d.id === 'dev-006');
          event = {
            id: eventId,
            timestamp,
            eventType: 'SUSPICIOUS_OUTBOUND',
            category: 'network',
            severity: 'high',
            title: 'ICU Medical Device Network Anomaly Detected',
            description: 'Synthetic traffic anomaly detected on ICU Patient Monitor 021. Connection volume and outbound destinations are above the device baseline.',
            source: 'Medical Device NIDS',
            actor: 'Synthetic Threat Simulator',
            deviceId: 'dev-006',
            system: 'ICU Medical Device Network',
            status: 'new',
            riskContribution: 20,
            metadata: {
              deviceName: targetDevice?.name || 'ICU Patient Monitor 021',
              deviceIp: targetDevice?.ip || '10.20.10.21',
              networkZone: targetDevice?.networkZone || 'ICU-VLAN',
              normalTrafficMbps: targetDevice?.normalTrafficMbps || 1.2,
              observedTrafficMbps: 8.9,
              connectionCount: 27,
              normalConnectionCount: 4,
              unknownDestinations: 3,
              clinicalCriticality: targetDevice?.clinicalCriticality || 'critical',
              patientConnected: targetDevice?.patientConnected ?? true,
              decision: 'REVIEW_REQUIRED',
            },
          };
          auditAction = 'Synthetic abnormal network traffic injected against ICU Patient Monitor 021';
          notifTitle = 'Medical Device Network Anomaly Detected';
          targetView = 'Devices';
          notifSeverity = 'high';

          updatedDevices = updatedDevices.map(d =>
            d.id === 'dev-006'
              ? { ...d, status: 'flagged' as const, currentTrafficMbps: 8.9 }
              : d
          );
          break;
        }

        case 'Port Scan':
        case 'SIMULATE PORT SCAN': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'PORT_SCAN',
            category: 'network',
            severity: 'high',
            title: 'Clinical Subnet Port Scan Detected',
            description: 'Subnet scan targeting clinical FHIR endpoints (ports 22, 80, 443, 8080, 8443).',
            source: 'Network Intrusion Detection System',
            actor: '10.0.0.45',
            system: 'Internal Clinical Firewall',
            status: 'new',
            riskContribution: 15,
            metadata: { sourceIP: '10.0.0.45', targetNodeId: 'node-fw', rate: '520 pkts/sec', scannedPorts: '22, 80, 443, 8080, 8443' },
          };
          auditAction = 'Simulated port scan pattern registered in NIDS';
          notifTitle = 'Clinical Subnet Port Scan Detected';
          targetView = 'Network';
          notifSeverity = 'high';

          updatedNetworkNodes = updatedNetworkNodes.map(n => 
            (n.id === 'node-fw' || n.id === 'node-app') ? { ...n, status: 'alert', trafficRate: '340 Mbps (Active Port Scan)' } : n
          );
          break;
        }

        case 'Brute Force':
        case 'SIMULATE BRUTE FORCE': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'BRUTE_FORCE',
            category: 'network',
            severity: 'high',
            title: 'Simulated SSH/Reverse-Proxy Brute Force Attack',
            description: '140 rapid authentication attempts against clinical DMZ reverse proxy within 60s.',
            source: 'Auth Sentry',
            actor: '10.0.0.45',
            system: 'DMZ Reverse Proxy',
            status: 'new',
            riskContribution: 16,
            metadata: { attempts: 140, targetNodeId: 'node-dmz', window: '60s', rateLimitTriggered: true },
          };
          auditAction = 'Simulated brute-force sequence logged and rate-limited';
          notifTitle = 'Brute Force Attempt Detected';
          targetView = 'Network';
          notifSeverity = 'high';

          updatedNetworkNodes = updatedNetworkNodes.map(n => 
            n.id === 'node-dmz' ? { ...n, status: 'alert', trafficRate: '195 Mbps (Auth Spike - 140 req/min)' } : n
          );
          break;
        }

        case 'Unusual Login':
        case 'SIMULATE UNUSUAL LOGIN': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'UNUSUAL_LOGIN',
            category: 'identity',
            severity: 'high',
            title: 'Unusual Login from Unknown Device: Dr. Sarah Wilson',
            description: 'Dr. Sarah Wilson logged in from Rogue Device (192.168.1.100) at 03:17 (outside 07:00-17:00 shift).',
            source: 'IAM Provider',
            actor: 'Dr. Sarah Wilson',
            userId: 'dr.sarah',
            deviceId: 'dev-003',
            system: 'Single Sign-On (SSO)',
            status: 'new',
            riskContribution: 16,
            metadata: { 
              device: 'Unknown-Device-External', 
              ip: '192.168.1.100', 
              expectedWorkstation: 'Hospital Workstation 04',
              time: '03:17',
              authResult: 'SUCCESS',
              anomalyReason: 'Login outside shift window (07:00-17:00) from unregistered external IP'
            },
          };
          auditAction = 'Simulated anomalous authentication outside clinical hours recorded';
          notifTitle = 'Anomalous Identity Login Flagged';
          targetView = 'Identity';
          notifSeverity = 'high';

          updatedDevices = updatedDevices.map(d => 
            d.id === 'dev-003' ? { ...d, status: 'flagged' } : d
          );
          updatedUsers = updatedUsers.map(u => 
            u.id === 'dr.sarah' ? { ...u, status: 'flagged' } : u
          );
          break;
        }

        case 'Application Attack Signal':
        case 'SIMULATE APPLICATION ATTACK SIGNAL': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'APP_PROBE',
            category: 'application',
            severity: 'high',
            title: 'Simulated API Abuse on /synthetic-api/patient-records',
            description: 'Automated parameter tampering and scraping probe bypassing pagination controls on FHIR server.',
            source: 'Application Security Gateway',
            actor: 'Dr. Sarah Wilson',
            userId: 'dr.sarah',
            system: 'Clinical API Gateway',
            status: 'new',
            riskContribution: 16,
            metadata: { endpoint: '/synthetic-api/patient-records', targetNodeId: 'node-app', pattern: 'Parameter tampering' },
          };
          auditAction = 'Simulated application security probe registered on clinical API endpoint';
          notifTitle = 'API Access Anomaly Detected';
          targetView = 'Network';
          notifSeverity = 'high';

          updatedNetworkNodes = updatedNetworkNodes.map(n => 
            n.id === 'node-app' ? { ...n, status: 'alert', trafficRate: '124 Mbps (API Query Anomalies)' } : n
          );
          break;
        }

        case 'EHR Abuse':
        case 'SIMULATE EHR ABUSE': {
          event = {
            id: eventId,
            timestamp,
            eventType: 'EHR_ACCESS',
            category: 'ehr',
            severity: 'critical',
            title: 'Simulated Cross-Department EHR Relationship Anomaly',
            description: 'Cardiology physician accessing unrelated Neurology chart Thomas Brody (#8819) without clinical order.',
            source: 'EHR Connector Sentry',
            actor: 'Dr. Sarah Wilson',
            userId: 'dr.sarah',
            system: 'Epic/Cerner EHR Connector',
            status: 'new',
            riskContribution: 18,
            metadata: { physicianDept: 'Cardiology', targetPatient: 'Thomas Brody (#8819)', reason: 'None charted' },
          };
          auditAction = 'Simulated clinical relationship anomaly recorded in EHR audit ledger';
          notifTitle = 'EHR Relationship Anomaly Flagged';
          targetView = 'EHR Security';
          notifSeverity = 'critical';

          const newEHRAccess: SimulatedEHRAccess = {
            id: `ehr-sim-${Date.now()}`,
            timestamp,
            doctorId: 'dr.sarah',
            doctorName: 'Dr. Sarah Wilson',
            patientId: 'pat-8819',
            patientName: 'Thomas Brody (#8819)',
            department: 'Neurology (Unrelated)',
            accessReason: 'No charted clinical justification provided (Anomalous chart access)',
            relationship: 'Unrelated',
            device: 'Unknown-Device-External (192.168.1.100)',
            isAnomalous: true,
            isBreakGlass: false,
            risk: 'critical',
            relatedEventId: eventId,
          };
          updatedEHRAccesses = [newEHRAccess, ...updatedEHRAccesses];
          break;
        }

        case 'Bulk Access':
        case 'SIMULATE BULK ACCESS':
        default: {
          event = {
            id: eventId,
            timestamp,
            eventType: 'EHR_BULK_ACCESS',
            category: 'ehr',
            severity: 'critical',
            title: 'Simulated EHR Bulk Record Exfiltration Attempt',
            description: 'Account queried 47 patient charts in 90 seconds (Baseline: 5 records / 30m). Velocity tripwire breached.',
            source: 'EHR Audit Velocity Engine',
            actor: 'Dr. Sarah Wilson',
            userId: 'dr.sarah',
            system: 'EHR Patient Data Layer',
            status: 'new',
            riskContribution: 22,
            metadata: { recordsAccessed: 47, windowSeconds: 90, riskTier: 'EXFILTRATION_VELOCITY' },
          };
          auditAction = 'Simulated EHR bulk access anomaly triggered velocity tripwire';
          notifTitle = 'EHR Bulk Access Velocity Alert';
          targetView = 'EHR Security';
          notifSeverity = 'critical';

          const newEHRAccess: SimulatedEHRAccess = {
            id: `ehr-sim-bulk-${Date.now()}`,
            timestamp,
            doctorId: 'dr.sarah',
            doctorName: 'Dr. Sarah Wilson',
            patientId: 'pat-bulk-47',
            patientName: 'Bulk Export Query (47 Clinical Charts)',
            department: 'Multi-Department Export',
            accessReason: 'Automated FHIR query sequence - Velocity threshold breached',
            relationship: 'Unrelated',
            device: 'Unknown-Device-External (192.168.1.100)',
            isAnomalous: true,
            isBreakGlass: false,
            risk: 'critical',
            relatedEventId: eventId,
          };
          updatedEHRAccesses = [newEHRAccess, ...updatedEHRAccesses];
          break;
        }
      }

      // A phishing simulation is a multi-signal delivery event: the same synthetic
      // message contains a suspicious URL and a suspicious attachment. Emit those
      // downstream telemetry records into the same central event stream so each
      // security module immediately reflects the exact same simulation.
      const generatedEvents: SecurityEvent[] = [event];

      if (simulationType === 'Phishing' || simulationType === 'SIMULATE PHISHING') {
        const linkEvent: SecurityEvent = {
          id: `${eventId}-link`,
          timestamp,
          eventType: 'SUSPICIOUS_LINK',
          category: 'linkguard',
          severity: 'critical',
          title: 'Malicious URL Found Inside Phishing Email',
          description: 'LinkGuard extracted the credential-harvesting URL from the simulated phishing message.',
          source: 'LinkGuard Email Connector',
          actor: 'Dr. Sarah Wilson',
          userId: 'dr.sarah',
          system: 'LinkGuard Safe-Proxy',
          status: 'new',
          riskContribution: 18,
          metadata: {
            url: 'https://secure-hospital-login.example/account',
            domain: 'secure-hospital-login.example',
            riskScore: 88,
            decision: 'BLOCK',
            parentEventId: eventId,
          },
        };
        const attachmentEvent: SecurityEvent = {
          id: `${eventId}-attachment`,
          timestamp,
          eventType: 'ATTACHMENT_ANALYZED',
          category: 'email',
          severity: 'high',
          title: 'Suspicious Phishing Attachment Detected',
          description: 'Static inspection found executable/script indicators in patient_billing_manifest.zip.',
          source: 'Attachment Sentinel',
          actor: 'Dr. Sarah Wilson',
          userId: 'dr.sarah',
          system: 'Attachment Security Scanner',
          status: 'new',
          riskContribution: 12,
          metadata: {
            filename: 'patient_billing_manifest.zip',
            decision: 'SUSPICIOUS',
            riskScore: 91,
            parentEventId: eventId,
          },
        };
        generatedEvents.push(linkEvent, attachmentEvent);

      }

      const newEvents = [...generatedEvents, ...state.events];
      const newIncidents = correlateEvents(newEvents, state.incidents);
      const newPosture = calculatePosture(newEvents);

      const newAudit: AuditEvent = {
        id: `aud-sim-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp,
        actor: 'Security Analyst (Simulator)',
        system: event.system,
        action: auditAction,
        outcome: 'warning',
        relatedEventId: eventId,
        details: event.description,
      };

      const newNotif: AppNotification = {
        id: `not-sim-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        title: notifTitle,
        message: event.description,
        timestamp,
        read: false,
        severity: notifSeverity,
        relatedEventId: eventId,
        targetView,
      };

      return {
        ...state,
        events: newEvents,
        incidents: newIncidents,
        securityPosture: newPosture,
        emails: updatedEmails,
        attachments: updatedAttachments,
        ehrAccesses: updatedEHRAccesses,
        users: updatedUsers,
        devices: updatedDevices,
        networkNodes: updatedNetworkNodes,
        notifications: [newNotif, ...state.notifications],
        auditLog: [newAudit, ...state.auditLog],
      };
    }

    case 'RESOLVE_SECURITY_EVENT': {
      return resolveSecurityEvent(state, action.payload.eventId, action.payload.action, action.payload.details);
    }

    case 'ADD_EVENT': {
      const newEvents = [action.payload, ...state.events];
      const newIncidents = correlateEvents(newEvents, state.incidents);
      const newPosture = calculatePosture(newEvents);
      
      const newNotif: AppNotification = {
        id: `not-${Date.now()}`,
        title: action.payload.severity === 'critical' ? 'CRITICAL ALERT DETECTED' : 'Security Alert',
        message: `${action.payload.title} — ${action.payload.system}`,
        timestamp: new Date().toISOString(),
        read: false,
        severity: action.payload.severity,
        relatedEventId: action.payload.id,
      };

      return {
        ...state,
        events: newEvents,
        incidents: newIncidents,
        securityPosture: newPosture,
        notifications: [newNotif, ...state.notifications],
      };
    }
    
    case 'ADD_EVENTS': {
      const newEvents = [...action.payload, ...state.events];
      const newIncidents = correlateEvents(newEvents, state.incidents);
      const newPosture = calculatePosture(newEvents);
      return {
        ...state,
        events: newEvents,
        incidents: newIncidents,
        securityPosture: newPosture,
      };
    }

    case 'ADD_AUDIT':
      return { ...state, auditLog: [action.payload, ...state.auditLog] };

    case 'ADD_AUDITS':
      return { ...state, auditLog: [...action.payload, ...state.auditLog] };

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };

    case 'SET_INCIDENTS':
      return { ...state, incidents: action.payload };

    case 'MARK_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      };

    case 'SET_ATTACK_CHAIN_PROGRESS':
      return { ...state, attackChainProgress: action.payload };

    case 'SET_RUNNING_CHAIN':
      return { ...state, isRunningChain: action.payload };

    case 'FINALIZE_ATTACK_CHAIN': {
      const activeIncident = [...state.incidents]
        .filter(i => i.status !== 'resolved')
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

      const now = new Date().toISOString();
      const incidentId = activeIncident?.id;
      const audit: AuditEvent = {
        id: `aud-finish-${Date.now()}`,
        timestamp: now,
        actor: 'Kill-Chain Automator',
        system: 'SOC Incident Desk',
        action: incidentId
          ? `Step 11/11: Kill-chain complete; Incident ${incidentId} workspace prepared`
          : 'Step 11/11: Kill-chain complete; no active incident was synthesized',
        outcome: incidentId ? 'success' : 'warning',
        details: incidentId
          ? 'Ready for analyst investigation and containment workflows.'
          : 'Telemetry was generated successfully but the correlation engine did not produce an active incident.',
      };

      const notification: AppNotification = {
        id: `not-complete-${Date.now()}`,
        title: incidentId ? 'KILL CHAIN COMPLETED' : 'KILL CHAIN COMPLETED — REVIEW TELEMETRY',
        message: incidentId
          ? `All attack stages executed and correlated. Opening Incident ${incidentId}.`
          : 'All attack stages executed. Review the active security telemetry in the SOC workspace.',
        timestamp: now,
        read: false,
        severity: incidentId ? 'critical' : 'high',
        relatedIncidentId: incidentId,
        targetView: 'Incidents',
      };

      return {
        ...state,
        attackChainProgress: 11,
        isRunningChain: false,
        selectedIncidentId: incidentId || null,
        currentView: 'Incidents',
        appMode: 'console',
        notifications: [notification, ...state.notifications],
        auditLog: [audit, ...state.auditLog],
      };
    }

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    case 'SET_VIEW':
      return { 
        ...state, 
        currentView: action.payload,
        appMode: 'console',
      };

    case 'SET_WORKSPACE_ROLE':
      return {
        ...state,
        workspaceRole: action.payload,
        currentView: action.payload === 'incident_response' ? 'Incident Response' : state.currentView === 'Incident Response' ? 'Overview' : state.currentView,
        appMode: 'console',
      };

    case 'SET_APP_MODE':
      return { ...state, appMode: action.payload };

    case 'SET_PUBLIC_PAGE':
      return { 
        ...state, 
        publicPage: action.payload,
        appMode: 'public',
      };

    case 'SET_SELECTED_INCIDENT':
      return { ...state, selectedIncidentId: action.payload };

    case 'RECALCULATE_POSTURE':
      return { ...state, securityPosture: calculatePosture(state.events) };

    case 'QUARANTINE_EMAIL': {
      const { emailId, reason } = action.payload;
      const target = state.emails.find(e => e.id === emailId);
      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Security Analyst (Simulated)',
        system: 'Email Security Gateway',
        action: `Quarantined email: "${target?.subject || emailId}"`,
        outcome: 'success',
        details: reason || 'Isolated by operator due to malicious threat score.',
      };
      const updatedEmails = state.emails.map(e => 
        e.id === emailId ? { ...e, status: 'quarantined' as const } : e
      );

      // Also mark any related email events as resolved
      const updatedEvents = state.events.map(ev => 
        (ev.category === 'email' && ev.userId === target?.recipient?.split('@')[0])
          ? { ...ev, status: 'resolved' as const, responseStatus: 'quarantined' as const }
          : ev
      );

      return {
        ...state,
        emails: updatedEmails,
        events: updatedEvents,
        incidents: synchronizeIncidentStatuses(state.incidents, updatedEvents),
        securityPosture: calculatePosture(updatedEvents),
        auditLog: [newAudit, ...state.auditLog],
        notifications: state.notifications.filter(n => !n.relatedEventId || !updatedEvents.some(ev => ev.id === n.relatedEventId && ev.status === 'resolved')),
      };
    }

    case 'RELEASE_EMAIL': {
      const { emailId } = action.payload;
      const target = state.emails.find(e => e.id === emailId);
      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Security Analyst (Simulated)',
        system: 'Email Security Gateway',
        action: `Released email from quarantine: "${target?.subject || emailId}"`,
        outcome: 'success',
        details: 'Analyst reviewed email body and false-positive indicators.',
      };
      const releasedEvents = state.events.map(ev =>
        ev.category === 'email' && ev.userId === target?.recipient?.split('@')[0]
          ? { ...ev, status: 'resolved' as const, responseStatus: 'allowed' as const }
          : ev
      );
      return {
        ...state,
        emails: state.emails.map(e => e.id === emailId ? { ...e, status: 'inbox' as const } : e),
        events: releasedEvents,
        incidents: synchronizeIncidentStatuses(state.incidents, releasedEvents),
        securityPosture: calculatePosture(releasedEvents),
        notifications: state.notifications.filter(n => !n.relatedEventId || !releasedEvents.some(ev => ev.id === n.relatedEventId && ev.status === 'resolved')),
        auditLog: [newAudit, ...state.auditLog],
      };
    }

    case 'QUARANTINE_ATTACHMENT': {
      const { attachmentId } = action.payload;
      const att = state.attachments.find(a => a.id === attachmentId);
      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Sandbox Operator',
        system: 'Attachment Threat Sandbox',
        action: `Quarantined file: ${att?.filename || attachmentId}`,
        outcome: 'success',
        details: 'Dynamic execution flagged malicious archive structure.',
      };
      const updatedEvents = state.events.map(ev =>
        ev.eventType === 'ATTACHMENT_ANALYZED' && ev.status !== 'resolved'
          ? { ...ev, status: 'resolved' as const, responseStatus: 'quarantined' as const }
          : ev
      );
      return {
        ...state,
        attachments: state.attachments.map(a => 
          a.id === attachmentId ? { ...a, decision: 'QUARANTINED' as const } : a
        ),
        events: updatedEvents,
        incidents: synchronizeIncidentStatuses(state.incidents, updatedEvents),
        securityPosture: calculatePosture(updatedEvents),
        notifications: state.notifications.filter(n => !n.relatedEventId || !updatedEvents.some(ev => ev.id === n.relatedEventId && ev.eventType === 'ATTACHMENT_ANALYZED' && ev.status === 'resolved')),
        auditLog: [newAudit, ...state.auditLog],
      };
    }

    case 'FLAG_USER': {
      const { userId } = action.payload;
      const usr = state.users.find(u => u.id === userId);
      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'SOC Incident Handler',
        system: 'Active Directory / IAM',
        action: `Flagged user account: ${usr?.name || userId} for password reset`,
        outcome: 'success',
        details: 'Active SSO sessions revoked. Mandatory MFA re-enrollment required.',
      };
      const updatedEvents = state.events.map(ev =>
        ev.userId === userId && ev.category === 'identity' && ev.status !== 'resolved'
          ? { ...ev, status: 'resolved' as const, responseStatus: 'reviewed' as const }
          : ev
      );
      return {
        ...state,
        users: state.users.map(u => u.id === userId ? { ...u, status: 'flagged' as const } : u),
        events: updatedEvents,
        incidents: synchronizeIncidentStatuses(state.incidents, updatedEvents),
        securityPosture: calculatePosture(updatedEvents),
        notifications: state.notifications.filter(n => !n.relatedEventId || !updatedEvents.some(ev => ev.id === n.relatedEventId && ev.userId === userId && ev.status === 'resolved')),
        auditLog: [newAudit, ...state.auditLog],
      };
    }

    case 'UNFLAG_USER': {
      const { userId } = action.payload;
      return {
        ...state,
        users: state.users.map(u => u.id === userId ? { ...u, status: 'active' as const } : u),
      };
    }

    case 'SAFE_CONTAIN_DEVICE': {
      return safeContainClinicalDevice(state, action.payload.deviceId, action.payload.eventId);
    }

    case 'ESCALATE_CLINICAL_DEVICE': {
      return escalateClinicalDevice(state, action.payload.deviceId, action.payload.eventId);
    }

    case 'ISOLATE_DEVICE': {
      const { deviceId } = action.payload;
      const dev = state.devices.find(d => d.id === deviceId);
      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'SOC Network Defender',
        system: 'Network Access Control (NAC)',
        action: `Isolated device: ${dev?.name || deviceId} (${dev?.ip})`,
        outcome: 'success',
        details: 'Endpoint severed from clinical VLAN 5. Traffic redirected to blackhole sandbox.',
      };
      const updatedEvents = state.events.map(ev =>
        (ev.deviceId === deviceId || (ev.category === 'network' && String(ev.metadata.sourceIP || '') === dev?.ip)) && ev.status !== 'resolved'
          ? { ...ev, status: 'resolved' as const, responseStatus: 'isolated' as const }
          : ev
      );
      return {
        ...state,
        devices: state.devices.map(d => d.id === deviceId ? { ...d, status: 'isolated' as const } : d),
        events: updatedEvents,
        incidents: synchronizeIncidentStatuses(state.incidents, updatedEvents),
        securityPosture: calculatePosture(updatedEvents),
        notifications: state.notifications.filter(n => !n.relatedEventId || !updatedEvents.some(ev => ev.id === n.relatedEventId && ev.deviceId === deviceId && ev.status === 'resolved')),
        auditLog: [newAudit, ...state.auditLog],
      };
    }

    case 'RESTORE_DEVICE': {
      const { deviceId } = action.payload;
      return {
        ...state,
        devices: state.devices.map(d => d.id === deviceId ? { ...d, status: 'online' as const } : d),
      };
    }

    case 'ISOLATE_NETWORK_NODE': {
      const { nodeId } = action.payload;
      const node = state.networkNodes.find(n => n.id === nodeId);
      if (!node) return state;

      const updatedEvents = state.events.map(ev =>
        ev.category === 'network' &&
        ev.status !== 'resolved' &&
        (
          ev.metadata.targetNodeId === nodeId ||
          ev.metadata.sourceIP === node.ip
        )
          ? { ...ev, status: 'resolved' as const, responseStatus: 'isolated' as const }
          : ev
      );
      const now = new Date().toISOString();
      const audit: AuditEvent = {
        id: `aud-node-isolate-${Date.now()}`,
        timestamp: now,
        actor: 'SOC Network Defender',
        system: 'Network Access Control (NAC)',
        action: `Isolated network node: ${node.name}`,
        outcome: 'success',
        details: `Synthetic node ${node.ip} moved to quarantine state.`,
      };

      return {
        ...state,
        networkNodes: state.networkNodes.map(n => n.id === nodeId ? { ...n, status: 'isolated' as const } : n),
        events: updatedEvents,
        incidents: synchronizeIncidentStatuses(state.incidents, updatedEvents),
        securityPosture: calculatePosture(updatedEvents),
        notifications: state.notifications.filter(n =>
          !n.relatedEventId ||
          !updatedEvents.some(ev => ev.id === n.relatedEventId && ev.status === 'resolved')
        ),
        auditLog: [audit, ...state.auditLog],
      };
    }

    case 'UPDATE_INCIDENT_STATUS': {
      const { incidentId, status } = action.payload;
      const inc = state.incidents.find(i => i.id === incidentId);
      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'SOC Incident Commander',
        system: 'CareSentinel Incident Core',
        action: `Incident ${incidentId} transitioned to: ${status.toUpperCase()}`,
        outcome: 'success',
        details: `Updated from ${inc?.status} to ${status}. Recalculating security posture.`,
      };

      // If resolving incident, mark all associated events as resolved
      let updatedEvents = state.events;
      if (status === 'resolved' && inc) {
        updatedEvents = state.events.map(ev => 
          inc.eventIds.includes(ev.id) ? { ...ev, status: 'resolved' as const, responseStatus: 'resolved' as const } : ev
        );
      }

      const updatedIncidents = state.incidents.map(i => 
        i.id === incidentId ? { ...i, status, updatedAt: new Date().toISOString() } : i
      );

      return {
        ...state,
        incidents: synchronizeIncidentStatuses(updatedIncidents, updatedEvents),
        events: updatedEvents,
        securityPosture: calculatePosture(updatedEvents),
        selectedIncidentId: status === 'resolved' ? null : state.selectedIncidentId,
        notifications: status === 'resolved'
          ? state.notifications.filter(n => !n.relatedIncidentId || n.relatedIncidentId !== incidentId)
          : state.notifications,
        auditLog: [newAudit, ...state.auditLog],
      };
    }

    case 'ADD_INCIDENT_NOTE': {
      const { incidentId, note } = action.payload;
      return {
        ...state,
        incidents: state.incidents.map(i => {
          if (i.id === incidentId) {
            return {
              ...i,
              notes: [...(i.notes || []), note],
              updatedAt: new Date().toISOString(),
            };
          }
          return i;
        }),
      };
    }

    case 'APPROVE_BREAK_GLASS': {
      const { accessId } = action.payload;
      const acc = state.ehrAccesses.find(a => a.id === accessId);
      if (!acc || acc.breakGlassDecision === 'approved') return state;

      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Clinical Privacy & Compliance Officer',
        system: 'EHR Audit Core',
        action: `Emergency break-glass reviewed & approved: ${acc.doctorName} -> ${acc.patientName}`,
        outcome: 'success',
        details: `Clinical emergency justification verified: ${acc.accessReason}`,
      };
      const updatedEvents = state.events.map(ev =>
        ev.eventType === 'BREAK_GLASS' && ev.metadata.accessId === accessId
          ? { ...ev, status: 'resolved' as const, responseStatus: 'approved' as const, metadata: { ...ev.metadata, breakGlassApproved: true, breakGlassDecision: 'approved' } }
          : ev
      );
      return {
        ...state,
        ehrAccesses: state.ehrAccesses.map(a => 
          a.id === accessId ? { ...a, breakGlassApproved: true, breakGlassDecision: 'approved', risk: 'low' as const } : a
        ),
        events: updatedEvents,
        incidents: synchronizeIncidentStatuses(state.incidents, updatedEvents),
        securityPosture: calculatePosture(updatedEvents),
        notifications: state.notifications.filter(n => !n.relatedEventId || !updatedEvents.some(ev => ev.id === n.relatedEventId && ev.eventType === 'BREAK_GLASS' && ev.status === 'resolved')),
        auditLog: [newAudit, ...state.auditLog],
      };
    }

    case 'DECLINE_BREAK_GLASS': {
      const { accessId } = action.payload;
      const acc = state.ehrAccesses.find(a => a.id === accessId);
      if (!acc || acc.breakGlassDecision === 'declined') return state;

      const newAudit: AuditEvent = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Clinical Privacy & Compliance Officer',
        system: 'EHR Audit Core',
        action: `Emergency break-glass reviewed & declined: ${acc.doctorName} -> ${acc.patientName}`,
        outcome: 'warning',
        details: `Emergency access was not approved by the synthetic compliance reviewer. Recorded reason: ${acc.accessReason}`,
      };
      const updatedEvents = state.events.map(ev =>
        ev.eventType === 'BREAK_GLASS' && ev.metadata.accessId === accessId
          ? { ...ev, status: 'resolved' as const, responseStatus: 'declined' as const, metadata: { ...ev.metadata, breakGlassApproved: false, breakGlassDecision: 'declined' } }
          : ev
      );
      return {
        ...state,
        ehrAccesses: state.ehrAccesses.map(a =>
          a.id === accessId ? { ...a, breakGlassApproved: false, breakGlassDecision: 'declined', risk: 'medium' as const } : a
        ),
        events: updatedEvents,
        incidents: synchronizeIncidentStatuses(state.incidents, updatedEvents),
        securityPosture: calculatePosture(updatedEvents),
        notifications: state.notifications.filter(n => !n.relatedEventId || !updatedEvents.some(ev => ev.id === n.relatedEventId && ev.eventType === 'BREAK_GLASS' && ev.status === 'resolved')),
        auditLog: [newAudit, ...state.auditLog],
      };
    }

    case 'CREATE_INCIDENT_FROM_EVENT': {
      return createIncidentFromEvent(state, action.payload.eventId);
    }

    case 'SET_GUIDED_DEMO':
      return {
        ...state,
        guidedDemoActive: action.payload.active,
        guidedDemoStep: action.payload.step ?? state.guidedDemoStep,
      };

    case 'RESET_DEMO': {
      const baseline = createInitialBaseline();
      return {
        ...baseline,
        workspaceRole: state.workspaceRole,
        currentView: state.currentView,
        appMode: state.appMode,
      };
    }

    default:
      return state;
  }
}
