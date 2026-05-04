import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, EmptyState, PageLoader, Select } from '@shared/ui';
import { ListChecks, ChevronRight } from '@shared/ui/icons';
import { formatDate } from '@shared/utils/format-date';
import { instanceStatusLabel, instanceStatusTone } from '@shared/utils/status-tone';
import { useInstances } from '../api/use-assignments-api';

const statuses = ['pending', 'in_progress', 'submitted', 'scored'] as const;

export const InstancesScreen = () => {
  const [status, setStatus] = useState<string>('');
  const { data, isLoading } = useInstances({ status: status || undefined });

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
      ) : !data || data.length === 0 ? (
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
            {data.map((i) => (
              <Link
                key={i.id}
                to={`/app/candidates/${i.candidate?.id ?? ''}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-surface-subtle transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink truncate">
                      {i.assignment?.title ?? 'Assignment'}
                    </span>
                    <Badge tone={instanceStatusTone(i.status)}>{instanceStatusLabel(i.status)}</Badge>
                  </div>
                  <p className="text-xs text-ink-soft mt-0.5">
                    {i.candidate?.name ?? '—'} · {i.candidate?.email ?? ''}
                  </p>
                </div>
                <span className="text-xs text-ink-soft">{formatDate(i.createdAt)}</span>
                <ChevronRight size={18} className="text-ink-soft shrink-0" />
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
