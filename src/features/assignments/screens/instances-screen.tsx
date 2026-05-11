import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, EmptyState, PageLoader, Select } from '@shared/ui';
import { CalendarClock, ChevronRight, ListChecks, Trash2 } from '@shared/ui/icons';
import { formatDate } from '@shared/utils/format-date';
import { instanceStatusLabel, instanceStatusTone } from '@shared/utils/status-tone';
import type { InstanceWithRelations } from '@shared/types';
import { useInstances } from '../api/use-assignments-api';
import { EditDeadlineModal } from '../parts/edit-deadline-modal';
import { RemoveInstanceModal } from '../parts/remove-instance-modal';

const statuses = ['pending', 'in_progress', 'submitted', 'scored'] as const;

interface EditTarget {
  id: string;
  deadline: string | null;
  status: InstanceWithRelations['status'];
  assignmentTitle?: string;
  candidateName?: string;
}

const isFiniteFuture = (iso: string | null): boolean => {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) && t > Date.now();
};

const isOverdue = (i: InstanceWithRelations): boolean => {
  if (!i.deadline) return false;
  if (i.status === 'scored' || i.status === 'submitted' || i.status === 'closed') return false;
  return new Date(i.deadline).getTime() <= Date.now();
};

export const InstancesScreen = () => {
  const [status, setStatus] = useState<string>('');
  const { data, isLoading } = useInstances({ status: status || undefined });
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [removeTarget, setRemoveTarget] = useState<InstanceWithRelations | null>(null);

  // Stable handle for the modal's open state — modal stays mounted across
  // close transitions so its reset useEffect can run, but we drop the target
  // reference once closed.
  const editOpen = editTarget !== null;
  const removeOpen = removeTarget !== null;

  const items = useMemo(() => data ?? [], [data]);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display tracking-tight">Sessions</h1>
          <p className="text-sm text-ink-muted mt-1">
            Every assignment instance — pending, active, submitted, or scored.
          </p>
        </div>
        <div className="w-56">
          <Select label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </Select>
        </div>
      </header>

      {isLoading ? (
        <PageLoader />
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ListChecks size={36} strokeWidth={1.5} />}
            title="Nothing here yet"
            description="Once you assign an assignment to a candidate, it will show up here."
          />
        </Card>
      ) : (
        <Card className="p-0">
          <div className="divide-y divide-line">
            {items.map((i) => {
              const editable = i.status !== 'scored' && i.status !== 'closed';
              const overdue = isOverdue(i);
              return (
                <div key={i.id} className="flex items-center gap-3 px-5 py-4 hover:bg-surface-subtle transition">
                  <Link
                    to={`/app/candidates/${i.candidate?.id ?? ''}`}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-ink truncate">
                          {i.assignment?.title ?? 'Assignment'}
                        </span>
                        <Badge tone={instanceStatusTone(i.status)}>{instanceStatusLabel(i.status)}</Badge>
                        {overdue && <Badge tone="rose">Overdue</Badge>}
                      </div>
                      <p className="text-xs text-ink-soft mt-0.5">
                        {i.candidate?.name ?? '—'} · {i.candidate?.email ?? ''}
                      </p>
                    </div>
                  </Link>

                  <div className="hidden sm:flex flex-col items-end shrink-0 min-w-[10rem]">
                    <span className="text-[10px] uppercase tracking-wider text-ink-soft">
                      {i.deadline ? 'Deadline' : 'No deadline'}
                    </span>
                    <span
                      className={`text-xs ${
                        overdue
                          ? 'text-danger font-medium'
                          : isFiniteFuture(i.deadline)
                            ? 'text-ink'
                            : 'text-ink-soft'
                      }`}
                    >
                      {i.deadline ? formatDate(i.deadline) : '—'}
                    </span>
                  </div>

                  {editable && (
                    <button
                      type="button"
                      onClick={() =>
                        setEditTarget({
                          id: i.id,
                          deadline: i.deadline,
                          status: i.status,
                          assignmentTitle: i.assignment?.title,
                          candidateName: i.candidate?.name,
                        })
                      }
                      className="p-2 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-sunken transition"
                      aria-label="Edit deadline"
                      title="Edit deadline"
                    >
                      <CalendarClock size={16} />
                    </button>
                  )}

                  {i.status !== 'in_progress' && (
                    <button
                      type="button"
                      onClick={() => setRemoveTarget(i)}
                      className="p-2 rounded-lg text-ink-soft hover:text-danger hover:bg-rose-50 transition"
                      aria-label="Remove assignment from candidate"
                      title="Remove assignment from candidate"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <Link
                    to={`/app/candidates/${i.candidate?.id ?? ''}`}
                    className="text-ink-soft hover:text-ink shrink-0 p-1"
                    aria-label="Open candidate"
                  >
                    <ChevronRight size={18} />
                  </Link>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <EditDeadlineModal
        open={editOpen}
        onClose={() => setEditTarget(null)}
        instanceId={editTarget?.id ?? ''}
        currentDeadline={editTarget?.deadline ?? null}
        status={editTarget?.status ?? 'pending'}
        assignmentTitle={editTarget?.assignmentTitle}
        candidateName={editTarget?.candidateName}
      />

      <RemoveInstanceModal
        open={removeOpen}
        onClose={() => setRemoveTarget(null)}
        instanceId={removeTarget?.id ?? ''}
        status={removeTarget?.status ?? 'pending'}
        assignmentTitle={removeTarget?.assignment?.title}
        candidateName={removeTarget?.candidate?.name}
      />
    </div>
  );
};
