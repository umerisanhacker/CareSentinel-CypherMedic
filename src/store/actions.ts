import type { 
  SecurityEvent, 
  CorrelatedIncident, 
  AuditEvent, 
  AppNotification, 
  IncidentStatus, 
  IncidentNote
} from './types';

export type Action =
  | { type: 'TRIGGER_SIMULATION'; payload: { simulationType: string } }
  | { type: 'ADD_EVENT'; payload: SecurityEvent }
  | { type: 'ADD_EVENTS'; payload: SecurityEvent[] }
  | { type: 'ADD_AUDIT'; payload: AuditEvent }
  | { type: 'ADD_AUDITS'; payload: AuditEvent[] }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'RESOLVE_SECURITY_EVENT'; payload: { eventId: string; action: string; details?: string } }
  | { type: 'SET_INCIDENTS'; payload: CorrelatedIncident[] }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'SET_ATTACK_CHAIN_PROGRESS'; payload: number }
  | { type: 'SET_RUNNING_CHAIN'; payload: boolean }
  | { type: 'FINALIZE_ATTACK_CHAIN' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_VIEW'; payload: string }
  | { type: 'SET_WORKSPACE_ROLE'; payload: import('./types').WorkspaceRole }
  | { type: 'SET_APP_MODE'; payload: 'public' | 'console' }
  | { type: 'SET_PUBLIC_PAGE'; payload: 'home' | 'features' | 'how-it-works' | 'security' | 'faq' | 'privacy' | 'terms' | 'login' }
  | { type: 'SET_SELECTED_INCIDENT'; payload: string | null }
  | { type: 'RECALCULATE_POSTURE' }
  | { type: 'QUARANTINE_EMAIL'; payload: { emailId: string; reason?: string } }
  | { type: 'RELEASE_EMAIL'; payload: { emailId: string; reason?: string } }
  | { type: 'QUARANTINE_ATTACHMENT'; payload: { attachmentId: string; reason?: string } }
  | { type: 'FLAG_USER'; payload: { userId: string; reason?: string } }
  | { type: 'UNFLAG_USER'; payload: { userId: string } }
  | { type: 'ISOLATE_DEVICE'; payload: { deviceId: string } }
  | { type: 'SAFE_CONTAIN_DEVICE'; payload: { deviceId: string; eventId: string } }
  | { type: 'ESCALATE_CLINICAL_DEVICE'; payload: { deviceId: string; eventId: string } }
  | { type: 'ISOLATE_NETWORK_NODE'; payload: { nodeId: string; reason?: string } }
  | { type: 'RESTORE_DEVICE'; payload: { deviceId: string } }
  | { type: 'UPDATE_INCIDENT_STATUS'; payload: { incidentId: string; status: IncidentStatus } }
  | { type: 'ADD_INCIDENT_NOTE'; payload: { incidentId: string; note: IncidentNote } }
  | { type: 'APPROVE_BREAK_GLASS'; payload: { accessId: string; reason?: string } }
  | { type: 'DECLINE_BREAK_GLASS'; payload: { accessId: string; reason?: string } }
  | { type: 'CREATE_INCIDENT_FROM_EVENT'; payload: { eventId: string } }
  | { type: 'SET_GUIDED_DEMO'; payload: { active: boolean; step?: number } }
  | { type: 'RESET_DEMO' };
