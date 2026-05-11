import { useMemo } from 'react';
import { AlertTriangle } from '@shared/ui/icons';
import type { InstanceWithRelations } from '@shared/types';
import { useInstances } from '../api/use-assignments-api';

interface Props {
  assignmentId: string;
}

interface Buckets {
  pending: number;
  inProgress: number;
  submitted: number;
  scored: number;
}

const summarize = (rows: InstanceWithRelations[], assignmentId: string): Buckets => {
  const b: Buckets = { pending: 0, inProgress: 0, submitted: 0, scored: 0 };
  for (const i of rows) {
    if (i.assignmentId !== assignmentId) continue;
    if (i.status === 'pending') b.pending += 1;
    else if (i.status === 'in_progress') b.inProgress += 1;
    else if (i.status === 'submitted') b.submitted += 1;
    else if (i.status === 'scored') b.scored += 1;
  }
  return b;
};

/**
 * Shown above the AssignmentForm in edit mode. Surfaces who's downstream of
 * the edit so the reviewer knows what their save will affect. The data model
 * joins live (no per-instance content snapshot), so edits to brief/title
 * propagate to anyone whose work isn't yet scored.
 *
 * Returns null when there's nothing to warn about (no instances yet, or all
 * pending — those candidates haven't seen anything yet).
 */
export const EditBlastRadiusBanner = ({ assignmentId }: Props) => {
  const { data } = useInstances();

  const buckets = useMemo(() => summarize(data ?? [], assignmentId), [data, assignmentId]);
  const live = buckets.inProgress + buckets.submitted; // people who've actually seen / interacted with the brief
  const total = buckets.pending + buckets.inProgress + buckets.submitted + buckets.scored;

  if (total === 0 || live === 0) return null;

  // Build a short, specific sentence about the breakdown. Keeps it scannable.
  const parts: string[] = [];
  if (buckets.inProgress > 0) parts.push(`${buckets.inProgress} in progress`);
  if (buckets.submitted > 0) parts.push(`${buckets.submitted} submitted`);
  if (buckets.scored > 0) parts.push(`${buckets.scored} scored`);
  if (buckets.pending > 0) parts.push(`${buckets.pending} not started`);

  return (
    <div className="ws-card p-4 border-amber-200 bg-amber-50/60 flex gap-3">
      <AlertTriangle size={18} className="text-amber-800 shrink-0 mt-0.5" />
      <div className="text-sm text-ink leading-relaxed">
        <p className="font-medium text-amber-900">
          {total} candidate{total === 1 ? '' : 's'} {total === 1 ? 'has' : 'have'} this assignment — {parts.join(', ')}.
        </p>
        <p className="text-ink-muted mt-1">
          Edits to the brief or title are visible to candidates whose work isn't scored yet.
          Scored work is unaffected. Changes to <span className="font-medium text-ink">duration</span> only
          apply to candidates who haven't started yet — anyone mid-session keeps their original timer.
        </p>
      </div>
    </div>
  );
};
