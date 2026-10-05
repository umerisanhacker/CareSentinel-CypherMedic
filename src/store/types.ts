export type EventType = 
  | 'EMAIL_RECEIVED' | 'PHISHING_DETECTED' | 'SUSPICIOUS_LINK' | 'ATTACHMENT_ANALYZED'
  | 'FAILED_LOGIN' | 'UNUSUAL_LOGIN' | 'UNKNOWN_DEVICE' | 'CREDENTIAL_COMPROMISE'
  | 'PORT_SCAN' | 'BRUTE_FORCE' | 'SUSPICIOUS_OUTBOUND' | 'LATERAL_MOVEMENT'
  | 'APP_PROBE' | 'API_ABUSE'
  | 'EHR_ACCESS' | 'EHR_BULK_ACCESS' | 'BREAK_GLASS'
  | 'INCIDENT_CREATED' | 'AUDIT_ACTION' | 'SIMULATION_TRIGGERED';

export type Category = 'email' | 'identity' | 'network' | 'ehr' | 'system' | 'linkguard' | 'application';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type IncidentStatus = 'new' | 'active' | 'investigating' | 'contained' | 'resolved' | 'escalated';
export type WorkspaceRole = 'soc_analyst_l2' | 'incident_response';
export type EventStatus = 'new' | 'acknowledged' | 'resolved' | 'false_positive';

export interface SimulatedUser {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  normalHours: string;
  workstation: string;
  status: 'active' | 'flagged' | 'suspended';
}

export interface SimulatedDevice {
  id: string;
  name: string;
  type: string;
  ip: string;
  known: boolean;
  status: 'online' | 'isolated' | 'flagged';
  location: string;
  /** Optional synthetic biomedical/clinical-device metadata used by the device security console. */
  deviceClass?: 'clinical' | 'infrastructure' | 'endpoint';
  manufacturer?: string;
  model?: string;
  networkZone?: string;
  clinicalCriticality?: 'low' | 'medium' | 'high' | 'critical';
  patientConnected?: boolean;
  normalTrafficMbps?: number;
  currentTrafficMbps?: number;
  telemetry?: Record<string, string>;
  assignedPhysician?: string;
  assignedBiomedicalEngineer?: string;
  bedOrLocation?: string;
  safetyEnvelope?: {
    patientMonitoringRequired: boolean;
    directIsolationAllowed: boolean;
    upstreamContainmentAllowed: boolean;
    clinicalApprovalRequired: boolean;
    biomedicalApprovalRequired: boolean;
  };
  lifecycleStatus?: 'active' | 'maintenance' | 'decommissioned' | 'retired';
  firmwareVersion?: string;
  lastMaintenance?: string;
  maintenanceWindow?: string;
  clinicalOperationalStatus?: 'normal' | 'warning' | 'critical';
}

export interface SimulatedEmail {
  id: string;
  sender: string;
  senderName: string;
  domain: string;
  recipient: string;
  recipientName: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  risk: Severity;
  status: 'inbox' | 'quarantined' | 'analyzed';
  authIndicators: {
    syntaxValid: boolean;
    domainTrusted: boolean;
    displayNameMismatch: boolean;
    lookalikeDetected: boolean;
    syntheticSpf: 'PASS' | 'FAIL' | 'SOFTFAIL';
    syntheticDkim: 'PASS' | 'FAIL';
    syntheticDmarc: 'PASS' | 'FAIL';
  };
  links: string[];
  attachments: string[];
}

export interface SimulatedAttachment {
  id: string;
  filename: string;
  extension: string;
  detectedType: string;
  size: string;
  hash: string;
  archiveDepth: number;
  nestedFilesCount: number;
  compressionRatio: 'LOW' | 'MEDIUM' | 'HIGH';
  executableContent: boolean;
  scriptIndicators: boolean;
  riskScore: number;
  decision: 'CLEAN' | 'SUSPICIOUS' | 'QUARANTINED';
  uploadedAt: string;
  sender: string;
}

export interface SimulatedPatient {
  id: string;
  name: string;
  mrn: string;
  age: number;
  gender: string;
  department: string;
  primaryPhysician: string;
  room: string;
  condition: string;
  vip: boolean;
}

export interface SimulatedEHRAccess {
  id: string;
  timestamp: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  department: string;
  accessReason: string;
  relationship: 'Direct Care' | 'Consulting' | 'Unrelated' | 'Emergency Break-Glass';
  device: string;
  isAnomalous: boolean;
  isBreakGlass: boolean;
  breakGlassApproved?: boolean;
  breakGlassDecision?: 'pending' | 'approved' | 'declined';
  relatedEventId?: string;
  risk: Severity;
}

export interface SecurityEvent {
  id: string;
  timestamp: string; // ISO string
  eventType: EventType;
  category: Category;
  severity: Severity;
  title: string;
  description: string;
  source: string;
  actor?: string;
  userId?: string;
  deviceId?: string;
  system: string;
  status: EventStatus;
  riskContribution: number; // 0-25 points deducted
  /** Operator/clinical decision state for the finding. Undefined means no response has been recorded yet. */
  responseStatus?: 'pending' | 'approved' | 'blocked' | 'allowed' | 'quarantined' | 'declined' | 'isolated' | 'reviewed' | 'contained' | 'resolved';
  relatedIncidentId?: string;
  metadata: Record<string, string | number | boolean>;
}

export interface RiskFactor {
  id: string;
  label: string;
  deduction: number;
  eventId: string;
  category: Category;
}

export interface IncidentNote {
  id: string;
  author: string;
  timestamp: string;
  text: string;
}

export interface CorrelatedIncident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  affectedUserId?: string;
  affectedDeviceIds?: string[];
  affectedSystems: string[];
  clinicalImpactScore?: number;
  eventIds: string[];
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
  createdAt: string;
  updatedAt: string;
  description: string;
  assignedInvestigator?: string;
  notes?: IncidentNote[];
  recommendedActions?: string[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  system: string;
  action: string;
  outcome: 'success' | 'failed' | 'warning';
  relatedEventId?: string;
  details?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: Severity;
  relatedEventId?: string;
  relatedIncidentId?: string;
  targetView?: string;
}

export interface SecurityPosture {
  score: number; // 0-100, derived
  label: string; // 'Protected' | 'Good' | 'Fair' | 'Poor' | 'Critical'
  categoryScores: Record<Category, number>;
  riskFactors: RiskFactor[];
  lastCalculated: string;
}

export interface NetworkTelemetryNode {
  id: string;
  name: string;
  type: 'internet' | 'firewall' | 'dmz' | 'app_servers' | 'ehr_db' | 'workstation';
  ip: string;
  status: 'normal' | 'alert' | 'isolated';
  trafficRate: string;
}

export interface AppState {
  workspaceRole: WorkspaceRole;
  appMode: 'public' | 'console';
  publicPage: 'home' | 'features' | 'how-it-works' | 'security' | 'faq' | 'privacy' | 'terms' | 'login';
  currentView: string;
  events: SecurityEvent[];
  incidents: CorrelatedIncident[];
  auditLog: AuditEvent[];
  notifications: AppNotification[];
  users: SimulatedUser[];
  devices: SimulatedDevice[];
  emails: SimulatedEmail[];
  attachments: SimulatedAttachment[];
  patients: SimulatedPatient[];
  ehrAccesses: SimulatedEHRAccess[];
  securityPosture: SecurityPosture;
  attackChainProgress: number; // 0-11 steps
  isRunningChain: boolean;
  searchQuery: string;
  selectedIncidentId: string | null;
  guidedDemoActive: boolean;
  guidedDemoStep: number;
  networkNodes: NetworkTelemetryNode[];
}
