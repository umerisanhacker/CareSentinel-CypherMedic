import type { AppState, SecurityEvent, Category } from './types';

export const selectEventsByCategory = (events: SecurityEvent[], category: Category) => {
  return events.filter(e => e.category === category);
};

export const selectRecentEvents = (events: SecurityEvent[], n: number) => {
  return [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, n);
};

export const selectUnreadCount = (notifications: AppState['notifications']) => {
  return notifications.filter(n => !n.read).length;
};

export const selectSearchResults = (state: AppState) => {
  const q = state.searchQuery.toLowerCase();
  if (!q) return { events: [], incidents: [], users: [], devices: [] };

  return {
    events: state.events.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)),
    incidents: state.incidents.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)),
    users: state.users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
    devices: state.devices.filter(d => d.name.toLowerCase().includes(q) || d.ip.includes(q)),
  };
};

export interface NavigationAlertCounts {
  incidents: number;
  emailSecurity: number;
  linkGuard: number;
  attachments: number;
  identity: number;
  network: number;
  applicationSecurity: number;
  ehrSecurity: number;
}

const isVerificationPending = (event: SecurityEvent) =>
  event.status === 'new' || event.status === 'acknowledged';

export const selectNavigationAlertCounts = (state: AppState): NavigationAlertCounts => {
  const pendingEvents = state.events.filter(isVerificationPending);

  return {
    incidents: state.incidents.filter(
      incident => incident.status === 'new' || incident.status === 'active' || incident.status === 'investigating' || incident.status === 'escalated'
    ).length,
    emailSecurity: pendingEvents.filter(
      event => event.category === 'email' && event.eventType === 'PHISHING_DETECTED'
    ).length,
    linkGuard: pendingEvents.filter(
      event => event.eventType === 'SUSPICIOUS_LINK'
    ).length,
    attachments: pendingEvents.filter(
      event => event.eventType === 'ATTACHMENT_ANALYZED'
    ).length,
    identity: pendingEvents.filter(
      event =>
        event.category === 'identity' &&
        ['FAILED_LOGIN', 'UNUSUAL_LOGIN', 'UNKNOWN_DEVICE', 'CREDENTIAL_COMPROMISE', 'BRUTE_FORCE'].includes(event.eventType)
    ).length,
    network: pendingEvents.filter(
      event =>
        event.category === 'network' &&
        ['PORT_SCAN', 'BRUTE_FORCE', 'SUSPICIOUS_OUTBOUND', 'LATERAL_MOVEMENT'].includes(event.eventType)
    ).length,
    applicationSecurity: pendingEvents.filter(
      event =>
        event.category === 'application' &&
        ['APP_PROBE', 'API_ABUSE'].includes(event.eventType)
    ).length,
    ehrSecurity: pendingEvents.filter(
      event =>
        event.category === 'ehr' &&
        ['EHR_ACCESS', 'EHR_BULK_ACCESS', 'BREAK_GLASS'].includes(event.eventType) &&
        !(
          event.eventType === 'BREAK_GLASS' &&
          event.metadata.breakGlassDecision !== 'pending'
        )
    ).length,
  };
};
