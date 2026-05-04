import { useState, type FormEvent } from 'react';
import { Button, Modal, Select } from '@shared/ui';
import { useToast } from '@shared/hooks/use-toast';
import { useCandidates } from '@features/candidates/api/use-candidates-api';
import { useAssignToCandidate } from '../api/use-assignments-api';

interface Props {
  open: boolean;
  onClose: () => void;
  assignmentId: string;
  assignmentTitle: string;
}

export const AssignToCandidateModal = ({ open, onClose, assignmentId, assignmentTitle }: Props) => {
  const { data: candidates } = useCandidates();
  const assign = useAssignToCandidate(assignmentId);
  const { push } = useToast();
  const [candidateId, setCandidateId] = useState('');
  const [deadline, setDeadline] = useState('');

  const reset = () => {
    setCandidateId('');
    setDeadline('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await assign.mutateAsync({
        candidateId,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
      });
      push('Assignment sent', 'success');
      handleClose();
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not assign', 'error');
    }
  };

  const activeCandidates = (candidates ?? []).filter((c) => c.isActive);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Assign to candidate"
      description={assignmentTitle}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="assign-form" loading={assign.isPending} disabled={!candidateId}>
            Send assignment
          </Button>
        </>
      }
    >
      <form id="assign-form" onSubmit={onSubmit} className="space-y-4">
        <Select
          label="Candidate"
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
          required
        >
          <option value="">Select a candidate…</option>
          {activeCandidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} · {c.email}
            </option>
          ))}
        </Select>
        <label className="block w-full">
          <span className="block text-xs font-medium text-ink-muted mb-1.5">Deadline (optional)</span>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5 text-sm text-ink"
          />
        </label>
      </form>
    </Modal>
  );
};
