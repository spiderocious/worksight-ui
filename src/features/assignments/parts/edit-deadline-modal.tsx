import { useEffect, useState, type FormEvent } from 'react';
import { Button, Modal } from '@shared/ui';
import { useToast } from '@shared/hooks/use-toast';
import type { InstanceStatus } from '@shared/types';
import { useUpdateInstanceDeadline } from '../api/use-assignments-api';

interface Props {
  open: boolean;
  onClose: () => void;
  instanceId: string;
  /** Current deadline as ISO string, or null if none. */
  currentDeadline: string | null;
  /**
   * Used to surface helpful copy & rejected by the backend for terminal states.
   * We don't disable the button locally for non-terminal statuses — the server
   * is authoritative — but we use this to nudge the reviewer.
   */
  status: InstanceStatus;
  /** Display-only, helps the reviewer confirm they're editing the right one. */
  assignmentTitle?: string;
  candidateName?: string;
}

/**
 * datetime-local inputs use the format YYYY-MM-DDTHH:mm in LOCAL time.
 * Convert an ISO string (UTC-based) to that format, in the reviewer's local
 * timezone. Returns '' for null/invalid input — that yields an empty input.
 */
const isoToLocalInputValue = (iso: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  // Build a local-time YYYY-MM-DDTHH:mm. Pad to 2 digits.
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const EditDeadlineModal = ({
  open,
  onClose,
  instanceId,
  currentDeadline,
  status,
  assignmentTitle,
  candidateName,
}: Props) => {
  const update = useUpdateInstanceDeadline();
  const { push } = useToast();
  const [deadline, setDeadline] = useState('');

  // Re-prefill every time the modal opens with a different instance.
  useEffect(() => {
    if (!open) return;
    setDeadline(isoToLocalInputValue(currentDeadline));
  }, [open, currentDeadline]);

  const terminal = status === 'scored' || status === 'closed';

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (terminal) return;
    try {
      const iso = deadline ? new Date(deadline).toISOString() : null;
      await update.mutateAsync({ id: instanceId, deadline: iso });
      push(iso ? 'Deadline updated' : 'Deadline cleared', 'success');
      handleClose();
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not update deadline', 'error');
    }
  };

  const onClear = async () => {
    if (terminal) return;
    try {
      await update.mutateAsync({ id: instanceId, deadline: null });
      push('Deadline cleared', 'success');
      handleClose();
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not clear deadline', 'error');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Edit deadline"
      description={
        assignmentTitle && candidateName
          ? `${assignmentTitle} · ${candidateName}`
          : assignmentTitle ?? undefined
      }
      width="sm"
      footer={
        <>
          {currentDeadline && !terminal && (
            <Button
              variant="ghost"
              type="button"
              onClick={onClear}
              disabled={update.isPending}
            >
              Clear deadline
            </Button>
          )}
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-deadline-form"
            loading={update.isPending}
            disabled={terminal}
          >
            Save
          </Button>
        </>
      }
    >
      {terminal ? (
        <p className="text-sm text-ink-muted">
          This instance is {status === 'scored' ? 'already scored' : 'closed'} and can no longer be edited.
        </p>
      ) : (
        <form id="edit-deadline-form" onSubmit={onSubmit} className="space-y-4">
          <label className="block w-full">
            <span className="block text-xs font-medium text-ink-muted mb-1.5">Deadline</span>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5 text-sm text-ink"
            />
            <span className="block text-xs text-ink-soft mt-1.5">
              {currentDeadline
                ? 'Pick a new date and time, or clear the deadline entirely.'
                : 'No deadline is set. Leave empty to keep it open-ended.'}
            </span>
          </label>
        </form>
      )}
    </Modal>
  );
};
