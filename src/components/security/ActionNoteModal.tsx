import { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  description: string;
  actionLabel: string;
  actionTone?: 'danger' | 'primary';
  onCancel: () => void;
  onConfirm: (note: string) => void;
}

export default function ActionNoteModal({
  open,
  title,
  description,
  actionLabel,
  actionTone = 'primary',
  onCancel,
  onConfirm,
}: Props) {
  const [note, setNote] = useState('');

  if (!open) return null;

  const confirm = () => {
    onConfirm(note.trim());
    setNote('');
  };

  const cancel = () => {
    setNote('');
    onCancel();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        background: 'rgba(15,23,42,.55)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
    >
      <div className="card" style={{
        width: '100%',
        maxWidth: 560,
        padding: '1.5rem',
        background: 'white',
        borderRadius: 16,
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: 'var(--accent-primary)', marginBottom: '.35rem' }}>
              <CheckCircle2 size={18} />
              <span style={{ fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em' }}>Operator Review</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{title}</h3>
            <p style={{ marginTop: '.35rem', fontSize: '.8rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>{description}</p>
          </div>
          <button onClick={cancel} aria-label="Close review dialog" style={{ color: 'var(--text-muted)' }}>
            <X size={19} />
          </button>
        </div>

        <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '.4rem' }}>
          Review note <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Why was this action taken? Add useful analyst context for the audit trail..."
          rows={4}
          style={{
            width: '100%',
            resize: 'vertical',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '.75rem',
            fontSize: '.82rem',
            color: 'var(--text-primary)',
            outline: 'none',
            background: 'var(--bg-main)',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.6rem', marginTop: '1rem' }}>
          <button onClick={cancel} className="btn btn-secondary">Cancel</button>
          <button
            onClick={confirm}
            className={actionTone === 'danger' ? 'btn btn-danger' : 'btn btn-primary'}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
