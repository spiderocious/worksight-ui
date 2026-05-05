import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Button, Card, EmptyState, MarkdownBody, Modal, PageLoader } from '@shared/ui';
import { Plus, ClipboardCheck, Clock, ChevronRight, Send } from '@shared/ui/icons';
import { useToast } from '@shared/hooks/use-toast';
import { useAssignments, useCreateAssignment } from '../api/use-assignments-api';
import { AssignmentForm } from '../parts/assignment-form';
import { BulkAssignModal } from '../parts/bulk-assign-modal';

export const AssignmentsScreen = () => {
  const { data, isLoading } = useAssignments();
  const [open, setOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const create = useCreateAssignment();
  const navigate = useNavigate();
  const { push } = useToast();

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display tracking-tight">Assignments</h1>
          <p className="text-sm text-ink-muted mt-1">
            Define an assignment once. Assign it to candidates as needed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {data && data.length > 0 && (
            <Button
              variant="secondary"
              iconLeft={<Send size={14} />}
              onClick={() => setBulkOpen(true)}
            >
              Bulk assign
            </Button>
          )}
          <Button iconLeft={<Plus size={16} />} onClick={() => setOpen(true)}>
            New assignment
          </Button>
        </div>
      </header>

      {isLoading ? (
        <PageLoader />
      ) : !data || data.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ClipboardCheck size={36} strokeWidth={1.5} />}
            title="No assignments yet"
            description="Create your first assignment template — title, brief, duration, and how the candidate should submit."
            action={<Button iconLeft={<Plus size={16} />} onClick={() => setOpen(true)}>New assignment</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {data.map((a) => (
            <Link
              to={`/app/assignments/${a.id}`}
              key={a.id}
              className="block ws-card p-5 hover:shadow-lift transition-shadow"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-ink truncate">{a.title}</h3>
                
                  <p className="text-sm text-ink-muted line-clamp-1 mt-1">
                      <MarkdownBody>{a.brief}</MarkdownBody>
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <Badge tone="brand">
                      <Clock size={11} /> {a.durationMinutes} minutes
                    </Badge>
                    <Badge tone="neutral">{a.submissionType}</Badge>
                  </div>
                </div>
                <ChevronRight size={20} className="text-ink-soft shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New assignment" width="lg">
        <AssignmentForm
          submitLabel="Create assignment"
          loading={create.isPending}
          onCancel={() => setOpen(false)}
          onSubmit={async (body) => {
            try {
              const created = await create.mutateAsync(body);
              setOpen(false);
              push('Assignment created', 'success');
              navigate(`/app/assignments/${created.id}`);
            } catch (err) {
              push(err instanceof Error ? err.message : 'Could not create', 'error');
            }
          }}
        />
      </Modal>

      <BulkAssignModal open={bulkOpen} onClose={() => setBulkOpen(false)} />
    </div>
  );
};
