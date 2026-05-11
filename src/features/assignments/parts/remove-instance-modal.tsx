import { useEffect, useState, type FormEvent } from 'react';
import { Button, Modal } from '@shared/ui';
import { AlertTriangle } from '@shared/ui/icons';
import { useToast } from '@shared/hooks/use-toast';
import type { InstanceStatus } from '@shared/types';
import { useDeleteInstance } from '../api/use-assignments-api';

interface Props {
  open: boolean;
  onClose: () => void;
  /**
   * When the modal closes after a successful delete, this fires AFTER the
   * mutation resolves. Used so a parent (e.g. a detail screen) can navigate
   * away — the row the user was looking at no longer exists.
   */
  onDeleted?: () => void;
  instanceId: string;
  status: InstanceStatus;
  assignmentTitle?: string;
  candidateName?: string;
  /** ISO score timestamp + value, if scored. Used for the confirmation copy. */
  score?: { value: number; scoredAt: string } | null;
}

const TYPED_CONFIRM = 'REMOVE';

interface Copy {
  title: string;
  body: string;
  confirmLabel: string;
  needsForce: boolean;
}

const copyFor = (
  status: InstanceStatus,
  candidate: string,
  score: Props['score']
): Copy => {
  switch (status) {
    case 'pending':
      return {
        title: 'Revoke assignment',
        body: `Take this assignment back from ${candidate}? They haven't started yet, so nothing is lost on their side.`,
        confirmLabel: 'Revoke',
        needsForce: false,
      };
    case 'submitted':
      return {
        title: 'Discard submission',
        body: `${candidate} has already submitted their work. Removing the assignment will delete their submission, their session, and any captured screenshots metadata. This can't be undone.`,
        confirmLabel: 'Discard submission',
        needsForce: false,
      };
    case 'closed':
      return {
        title: 'Remove closed assignment',
        body: `This instance was auto-closed (the deadline passed before ${candidate} started). Remove it from your dashboard?`,
        confirmLabel: 'Remove',
        needsForce: false,
      };
    case 'scored': {
      const scoreNote = score
        ? ` (current score: ${score.value}/100)`
        : '';
      return {
        title: 'Remove scored assignment',
        body: `${candidate}'s work was already scored${scoreNote}. Removing this will permanently delete the instance, the session, and the score itself. This is destructive and cannot be undone. Type ${TYPED_CONFIRM} to confirm.`,
        confirmLabel: 'Remove permanently',
        needsForce: true,
      };
    }
    case 'in_progress':
      // The backend blocks this; the modal still renders something useful if
      // it somehow opens for an in_progress row (shouldn't, but defensive).
      return {
        title: "Can't remove right now",
        body: `${candidate} is actively working on this assignment. Wait until they submit or let the deadline close it before removing.`,
        confirmLabel: 'OK',
        needsForce: false,
      };
  }
};

export const RemoveInstanceModal = ({
  open,
  onClose,
  onDeleted,
  instanceId,
  status,
  assignmentTitle,
  candidateName,
  score,
}: Props) => {
  const remove = useDeleteInstance();
  const { push } = useToast();
  const [typed, setTyped] = useState('');

  // Reset the typed-confirm field every time we open. Otherwise a previous
  // typed value would stick across opens.
  useEffect(() => {
    if (open) setTyped('');
  }, [open]);

  const candidate = candidateName ?? 'this candidate';
  const c = copyFor(status, candidate, score);
  const inProgress = status === 'in_progress';
  const typedOK = !c.needsForce || typed.trim() === TYPED_CONFIRM;

  const onConfirm = async (e?: FormEvent) => {
    e?.preventDefault();
    if (inProgress) {
      onClose();
      return;
    }
    if (!typedOK) return;
    try {
      const result = await remove.mutateAsync({ id: instanceId, force: c.needsForce });
      const bits: string[] = [];
      if (result.deleted.session) bits.push('session');
      if (result.deleted.score) bits.push('score');
      if (result.deleted.blockedAttempts > 0)
        bits.push(`${result.deleted.blockedAttempts} blocked-attempt log${result.deleted.blockedAttempts === 1 ? '' : 's'}`);
      const tail = bits.length ? ` (removed ${bits.join(', ')})` : '';
      push(`Assignment removed${tail}`, 'success');
      onClose();
      onDeleted?.();
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not remove', 'error');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={c.title}
      description={
        assignmentTitle && candidateName
          ? `${assignmentTitle} · ${candidateName}`
          : assignmentTitle ?? candidateName ?? undefined
      }
      width="sm"
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            {inProgress ? 'Close' : 'Cancel'}
          </Button>
          {!inProgress && (
            <Button
              variant="ghost"
              type="submit"
              form="remove-instance-form"
              loading={remove.isPending}
              disabled={!typedOK}
              className="text-danger hover:bg-rose-50"
            >
              {c.confirmLabel}
            </Button>
          )}
        </>
      }
    >
      <form id="remove-instance-form" onSubmit={onConfirm} className="space-y-4">
        <div className="flex gap-3">
          <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
          <p className="text-sm text-ink leading-relaxed">{c.body}</p>
        </div>

        {c.needsForce && (
          <label className="block">
            <span className="block text-xs font-medium text-ink-muted mb-1.5">
              Type <span className="font-mono text-ink">{TYPED_CONFIRM}</span> to confirm
            </span>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoFocus
              spellCheck={false}
              className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5 text-sm text-ink font-mono"
              placeholder={TYPED_CONFIRM}
            />
          </label>
        )}
      </form>
    </Modal>
  );
};
