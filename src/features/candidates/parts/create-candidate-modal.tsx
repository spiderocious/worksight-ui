import { useState, type FormEvent } from 'react';
import { Button, Input, Modal } from '@shared/ui';
import { useToast } from '@shared/hooks/use-toast';
import { useCreateCandidate } from '../api/use-candidates-api';
import { AccessCodeDisplay } from './access-code-display';
import type { Candidate } from '@shared/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateCandidateModal = ({ open, onClose }: Props) => {
  const create = useCreateCandidate();
  const { push } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [createdCandidate, setCreatedCandidate] = useState<Candidate | null>(null);

  const reset = () => {
    setName('');
    setEmail('');
    setCreatedCandidate(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const candidate = await create.mutateAsync({ name, email });
      setCreatedCandidate(candidate);
      push('Candidate created', 'success');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not create candidate', 'error');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={createdCandidate ? 'Share the access code' : 'New candidate'}
      description={
        createdCandidate
          ? 'Send this code to the candidate manually. They will need it to sign into the desktop app.'
          : 'Enter their name and email. WorkSight will generate an access code for them.'
      }
      footer={
        createdCandidate ? (
          <Button onClick={handleClose}>Done</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button type="submit" form="create-candidate-form" loading={create.isPending}>
              Create candidate
            </Button>
          </>
        )
      }
    >
      {createdCandidate ? (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-ink-muted">Candidate</p>
            <p className="text-base font-medium text-ink">{createdCandidate.name}</p>
            <p className="text-sm text-ink-soft">{createdCandidate.email}</p>
          </div>
          <div>
            <p className="text-sm text-ink-muted mb-2">Access code</p>
            <AccessCodeDisplay code={createdCandidate.accessCode} size="lg" />
          </div>
          <p className="text-xs text-ink-soft">
            You can copy or regenerate this code from the candidate's profile at any time.
          </p>
        </div>
      ) : (
        <form id="create-candidate-form" onSubmit={onSubmit} className="space-y-4">
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </form>
      )}
    </Modal>
  );
};
