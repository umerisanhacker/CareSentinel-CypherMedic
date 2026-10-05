/* eslint-disable react-refresh/only-export-components -- Store intentionally co-locates the provider and its hooks as the single state API. */
import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { 
  AppState, 
  IncidentStatus, 
  IncidentNote,
  WorkspaceRole 
} from './types';
import type { Action } from './actions';
import { rootReducer } from './reducer';
import { 
  initialUsers, 
  initialDevices, 
  initialEmails, 
  initialAttachments, 
  initialPatients, 
  initialEHRAccesses, 
  initialNetworkNodes, 
  initialEvents, 
  initialIncidents, 
  initialAuditLog, 
  initialNotifications, 
  initialPosture 
} from './initialData';

const initialState: AppState = {
  workspaceRole: 'soc_analyst_l2',
  appMode: 'public',
  publicPage: 'home',
  currentView: 'Overview',
  events: initialEvents,
  incidents: initialIncidents,
  auditLog: initialAuditLog,
  notifications: initialNotifications,
  users: initialUsers,
  devices: initialDevices,
  emails: initialEmails,
  attachments: initialAttachments,
  patients: initialPatients,
  ehrAccesses: initialEHRAccesses,
  securityPosture: initialPosture,
  attackChainProgress: 0,
  isRunningChain: false,
  searchQuery: '',
  selectedIncidentId: null,
  guidedDemoActive: false,
  guidedDemoStep: 0,
  networkNodes: initialNetworkNodes,
};

const SecurityStoreContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export function SecurityStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  return (
    <SecurityStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </SecurityStoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(SecurityStoreContext);
  if (!context) throw new Error('useStore must be used within SecurityStoreProvider');
  return context;
}

export function useAppMode() {
  const { state } = useStore();
  return state.appMode;
}

export function usePublicPage() {
  const { state } = useStore();
  return state.publicPage;
}

export function useWorkspaceRole() {
  const { state } = useStore();
  return state.workspaceRole;
}

export function useSetWorkspaceRole() {
  const { dispatch } = useStore();
  return useCallback((role: WorkspaceRole) => dispatch({ type: 'SET_WORKSPACE_ROLE', payload: role }), [dispatch]);
}

export function useCurrentView() {
  const { state } = useStore();
  return state.currentView;
}

export function useSetCurrentView() {
  const { dispatch } = useStore();
  return useCallback((view: string) => dispatch({ type: 'SET_VIEW', payload: view }), [dispatch]);
}

export function useSetAppMode() {
  const { dispatch } = useStore();
  return useCallback((mode: 'public' | 'console') => dispatch({ type: 'SET_APP_MODE', payload: mode }), [dispatch]);
}

export function useSetPublicPage() {
  const { dispatch } = useStore();
  return useCallback((page: 'home' | 'features' | 'how-it-works' | 'security' | 'faq' | 'privacy' | 'terms' | 'login') => 
    dispatch({ type: 'SET_PUBLIC_PAGE', payload: page }), [dispatch]);
}

export function useEvents() {
  const { state } = useStore();
  return state.events;
}

export function useIncidents() {
  const { state } = useStore();
  return state.incidents;
}

export function usePosture() {
  const { state } = useStore();
  return state.securityPosture;
}

export function useNotifications() {
  const { state } = useStore();
  return state.notifications;
}

export function useEmails() {
  const { state } = useStore();
  return state.emails;
}

export function useAttachments() {
  const { state } = useStore();
  return state.attachments;
}

export function useEHRAccesses() {
  const { state } = useStore();
  return state.ehrAccesses;
}

export function usePatients() {
  const { state } = useStore();
  return state.patients;
}

export function useDevices() {
  const { state } = useStore();
  return state.devices;
}

export function useUsers() {
  const { state } = useStore();
  return state.users;
}

export function useAuditLog() {
  const { state } = useStore();
  return state.auditLog;
}

export function useResolveSecurityEvent() {
  const { dispatch } = useStore();
  return useCallback((eventId: string, action: string, details?: string) => {
    dispatch({ type: 'RESOLVE_SECURITY_EVENT', payload: { eventId, action, details } });
  }, [dispatch]);
}

export function useMarkNotificationsRead() {
  const { dispatch } = useStore();
  return useCallback(() => dispatch({ type: 'MARK_NOTIFICATIONS_READ' }), [dispatch]);
}

export function useQuarantineEmail() {
  const { dispatch } = useStore();
  return useCallback((emailId: string, reason?: string) => {
    dispatch({ type: 'QUARANTINE_EMAIL', payload: { emailId, reason } });
  }, [dispatch]);
}

export function useReleaseEmail() {
  const { dispatch } = useStore();
  return useCallback((emailId: string, reason?: string) => {
    dispatch({ type: 'RELEASE_EMAIL', payload: { emailId, reason } });
  }, [dispatch]);
}

export function useQuarantineAttachment() {
  const { dispatch } = useStore();
  return useCallback((attachmentId: string, reason?: string) => {
    dispatch({ type: 'QUARANTINE_ATTACHMENT', payload: { attachmentId, reason } });
  }, [dispatch]);
}

export function useFlagUser() {
  const { dispatch } = useStore();
  return useCallback((userId: string, reason?: string) => {
    dispatch({ type: 'FLAG_USER', payload: { userId, reason } });
  }, [dispatch]);
}

export function useIsolateDevice() {
  const { dispatch } = useStore();
  return useCallback((deviceId: string) => {
    dispatch({ type: 'ISOLATE_DEVICE', payload: { deviceId } });
  }, [dispatch]);
}

export function useIsolateNetworkNode() {
  const { dispatch } = useStore();
  return useCallback((nodeId: string, reason?: string) => {
    dispatch({ type: 'ISOLATE_NETWORK_NODE', payload: { nodeId, reason } });
  }, [dispatch]);
}

export function useUpdateIncidentStatus() {
  const { dispatch } = useStore();
  return useCallback((incidentId: string, status: IncidentStatus) => {
    dispatch({ type: 'UPDATE_INCIDENT_STATUS', payload: { incidentId, status } });
  }, [dispatch]);
}

export function useAddIncidentNote() {
  const { dispatch } = useStore();
  return useCallback((incidentId: string, text: string, author: string = 'Security Analyst') => {
    const note: IncidentNote = {
      id: `note-${Date.now()}`,
      author,
      timestamp: new Date().toISOString(),
      text,
    };
    dispatch({ type: 'ADD_INCIDENT_NOTE', payload: { incidentId, note } });
  }, [dispatch]);
}

export function useApproveBreakGlass() {
  const { dispatch } = useStore();
  return useCallback((accessId: string, reason?: string) => {
    dispatch({ type: 'APPROVE_BREAK_GLASS', payload: { accessId, reason } });
  }, [dispatch]);
}

export function useDeclineBreakGlass() {
  const { dispatch } = useStore();
  return useCallback((accessId: string, reason?: string) => {
    dispatch({ type: 'DECLINE_BREAK_GLASS', payload: { accessId, reason } });
  }, [dispatch]);
}

export function useCreateIncidentFromEvent() {
  const { dispatch } = useStore();
  return useCallback((eventId: string) => {
    dispatch({ type: 'CREATE_INCIDENT_FROM_EVENT', payload: { eventId } });
  }, [dispatch]);
}

export function useSelectIncident() {
  const { dispatch } = useStore();
  return useCallback((id: string | null) => {
    dispatch({ type: 'SET_SELECTED_INCIDENT', payload: id });
    if (id) {
      dispatch({ type: 'SET_VIEW', payload: 'Incidents' });
    }
  }, [dispatch]);
}

export function useResetDemo() {
  const { dispatch } = useStore();
  return useCallback(() => {
    dispatch({ type: 'RESET_DEMO' });
  }, [dispatch]);
}

// Attack Simulation Engine
export function useSimulateAttack() {
  const { dispatch } = useStore();
  
  return useCallback((simulationType: string) => {
    dispatch({ type: 'TRIGGER_SIMULATION', payload: { simulationType } });
  }, [dispatch]);
}

// Full Attack Chain Sequence Runner
export function useRunFullChain() {
  const { state, dispatch } = useStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return useCallback(() => {
    if (state.isRunningChain) return;

    dispatch({ type: 'SET_RUNNING_CHAIN', payload: true });
    dispatch({ type: 'SET_ATTACK_CHAIN_PROGRESS', payload: 0 });

    const chainSimulationTriggers = [
      { step: 1, type: 'SIMULATE PHISHING', name: 'Phishing Email Delivered' },
      { step: 2, type: 'SIMULATE MALICIOUS LINK', name: 'Malicious URL Analyzed & Clicked' },
      { step: 3, type: 'SIMULATE CREDENTIAL COMPROMISE', name: 'Credential Compromise Injected' },
      { step: 4, type: 'SIMULATE PORT SCAN', name: 'Network Port Reconnaissance' },
      { step: 5, type: 'SIMULATE BRUTE FORCE', name: 'Brute Force Authentication' },
      { step: 6, type: 'SIMULATE UNUSUAL LOGIN', name: 'Unusual Login from Unknown Device' },
      { step: 7, type: 'SIMULATE APPLICATION ATTACK SIGNAL', name: 'Application API Abuse Probe' },
      { step: 8, type: 'SIMULATE EHR ABUSE', name: 'EHR Access Relationship Anomaly' },
      { step: 9, type: 'SIMULATE BULK ACCESS', name: 'EHR Bulk Access Velocity Tripwire' },
    ];

    let currentStepIndex = 0;

    const executeNextStep = () => {
      if (currentStepIndex < chainSimulationTriggers.length) {
        const item = chainSimulationTriggers[currentStepIndex];
        const stepNum = item.step;
        dispatch({ type: 'SET_ATTACK_CHAIN_PROGRESS', payload: stepNum });
        dispatch({ type: 'TRIGGER_SIMULATION', payload: { simulationType: item.type } });

        currentStepIndex++;
        timerRef.current = setTimeout(executeNextStep, 950);
      } else if (currentStepIndex === chainSimulationTriggers.length) {
        // Step 10: Correlation Engine Synthesis
        dispatch({ type: 'SET_ATTACK_CHAIN_PROGRESS', payload: 10 });
        dispatch({
          type: 'ADD_AUDIT',
          payload: {
            id: `aud-corr-${Date.now()}`,
            timestamp: new Date().toISOString(),
            actor: 'CareSentinel Correlation Engine',
            system: 'SOC Correlation Core',
            action: 'Step 10/11: Multi-vector attack chain fused into a correlated incident',
            outcome: 'success',
            details: 'Linked 9 disparate alerts across Email, IAM, Network, and EHR into unified kill-chain.',
          }
        });
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: `not-corr-${Date.now()}`,
            title: 'ATTACK CHAIN FUSED',
            message: 'All 9 stages correlated across Email, IAM, Network, and EHR telemetry. Final incident identity is resolved from shared state.',
            timestamp: new Date().toISOString(),
            read: false,
            severity: 'critical',
            targetView: 'Incidents',
          }
        });

        currentStepIndex++;
        timerRef.current = setTimeout(executeNextStep, 950);
      } else {
        // Step 11: Let the reducer resolve the actual correlated incident ID from current state.
        dispatch({ type: 'FINALIZE_ATTACK_CHAIN' });
      }
    };

    executeNextStep();
  }, [state.isRunningChain, dispatch]);
}
