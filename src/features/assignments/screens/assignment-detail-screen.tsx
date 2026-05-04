import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Card, CardHeader, EmptyState, Modal, PageLoader } from '@shared/ui';
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Pencil,
  Send,
  Trash2,
  Users,
} from '@shared/ui/icons';
import { useToast } from '@shared/hooks/use-toast';
import { formatDate } from '@shared/utils/format-date';
import { instanceStatusLabel, instanceStatusTone } from '@shared/utils/status-tone';
import {
  useAssignment,
  useDeleteAssignment,
  useInstances,
  useUpdateAssignment,
} from '../api/use-assignments-api';
import { AssignmentForm } from '../parts/assignment-form';
import { AssignToCandidateModal } from '../parts/assign-to-candidate-modal';

export const AssignmentDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useAssignment(id);
  const { data: instances } = useInstances();
  const update = useUpdateAssignment(id ?? '');
  const remove = useDeleteAssignment();
  const navigate = useNavigate();
  const { push } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  if (isLoading || !data || !id) return <PageLoader />;

  const myInstances = (instances ?? []).filter((i) => i.assignmentId === id);

  const onDelete = async () => {
    if (!confirm('Delete this assignment? This only works if no candidate has started it.')) return;
    try {
      await remove.mutateAsync(id);
      push('Assignment deleted', 'success');
      navigate('/assignments');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not delete', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/assignments" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft size={14} /> All assignments
      </Link>

      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-display tracking-tight">{data.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge tone="brand">
              <Clock size={11} /> {data.durationMinutes} min
            </Badge>
            <Badge tone="neutral">{data.submissionType}</Badge>
            <span className="text-xs text-ink-soft">Created {formatDate(data.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" iconLeft={<Pencil size={14} />} onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button variant="ghost" iconLeft={<Trash2 size={14} />} onClick={onDelete}>
            Delete
          </Button>
          <Button iconLeft={<Send size={14} />} onClick={() => setAssignOpen(true)}>
            Assign
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader title="Brief" />
        <div className="text-sm whitespace-pre-wrap text-ink leading-relaxed">{data.brief}</div>
      </Card>

      <Card>
        <CardHeader title="Assigned to" subtitle="Every candidate this has been sent to." />
        {myInstances.length === 0 ? (
          <EmptyState
            icon={<Users size={28} strokeWidth={1.5} />}
            title="Not assigned yet"
            description="Click Assign to send this to a candidate."
          />
        ) : (
          <div className="divide-y divide-line">
            {myInstances.map((i) => (
              <div key={i.id} className="py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink truncate">
                      {i.candidate?.name ?? 'Candidate'}
                    </span>
                    <Badge tone={instanceStatusTone(i.status)}>{instanceStatusLabel(i.status)}</Badge>
                  </div>
                  <p className="text-xs text-ink-soft mt-0.5">{i.candidate?.email}</p>
                </div>
                <span className="text-xs text-ink-soft">{formatDate(i.createdAt)}</span>
                {i.candidate && (
                  <Link
                    to={`/candidates/${i.candidate.id}`}
                    className="text-ink-soft hover:text-brand-700 p-1 rounded hover:bg-surface-sunken"
                  >
                    <ChevronRight size={18} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit assignment" width="lg">
        <AssignmentForm
          initial={data}
          submitLabel="Save changes"
          loading={update.isPending}
          onCancel={() => setEditOpen(false)}
          onSubmit={async (body) => {
            try {
              await update.mutateAsync(body);
              setEditOpen(false);
              push('Assignment updated', 'success');
            } catch (err) {
              push(err instanceof Error ? err.message : 'Could not update', 'error');
            }
          }}
        />
      </Modal>

      <AssignToCandidateModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        assignmentId={id}
        assignmentTitle={data.title}
      />
    </div>
  );
};
