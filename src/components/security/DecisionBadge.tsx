import { CheckCircle2, ShieldCheck, ShieldX, Clock3, Ban, LockKeyhole, Eye } from 'lucide-react';

export type DecisionStatus =
  | 'pending'
  | 'approved'
  | 'blocked'
  | 'allowed'
  | 'quarantined'
  | 'declined'
  | 'isolated'
  | 'reviewed'
  | 'contained'
  | 'resolved';

const config: Record<DecisionStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  pending: { label: 'PENDING REVIEW', className: 'status-pending', icon: Clock3 },
  approved: { label: 'APPROVED', className: 'status-approved', icon: CheckCircle2 },
  blocked: { label: 'BLOCKED', className: 'status-blocked', icon: ShieldX },
  allowed: { label: 'ALLOWED', className: 'status-allowed', icon: ShieldCheck },
  quarantined: { label: 'QUARANTINED', className: 'status-quarantined', icon: LockKeyhole },
  declined: { label: 'DECLINED', className: 'status-declined', icon: Ban },
  isolated: { label: 'ISOLATED', className: 'status-isolated', icon: ShieldX },
  reviewed: { label: 'REVIEWED', className: 'status-reviewed', icon: Eye },
  contained: { label: 'CONTAINED', className: 'status-contained', icon: ShieldCheck },
  resolved: { label: 'RESOLVED', className: 'status-resolved', icon: CheckCircle2 },
};

export function DecisionBadge({
  status,
  size = 'sm',
}: {
  status: DecisionStatus;
  size?: 'sm' | 'md';
}) {
  const item = config[status] ?? config.pending;
  const Icon = item.icon;

  return (
    <span className={`decision-badge ${item.className} decision-badge-${size}`} role="status">
      <Icon size={size === 'md' ? 14 : 12} strokeWidth={2.4} />
      {item.label}
    </span>
  );
}

export function deriveDecisionStatus(event: {
  status: string;
  responseStatus?: DecisionStatus;
  metadata?: Record<string, string | number | boolean>;
}): DecisionStatus {
  if (event.responseStatus) return event.responseStatus;

  const breakGlass = event.metadata?.breakGlassDecision;
  if (breakGlass === 'approved') return 'approved';
  if (breakGlass === 'declined') return 'declined';
  if (breakGlass === 'pending') return 'pending';

  if (event.status === 'new' || event.status === 'acknowledged') return 'pending';
  if (event.status === 'resolved') return 'resolved';

  return 'reviewed';
}
