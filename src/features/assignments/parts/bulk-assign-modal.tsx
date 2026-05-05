import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Badge, Button, Modal, PageLoader } from '@shared/ui';
import { Clock, Users, ClipboardCheck } from '@shared/ui/icons';
import { useToast } from '@shared/hooks/use-toast';
import { useCandidates } from '@features/candidates/api/use-candidates-api';
import {
  useAssignments,
  useBulkAssign,
  type BulkAssignBody,
} from '../api/use-assignments-api';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Matrix-style bulk assignment.
 *
 * The reviewer picks N candidates and M assignments. Each chosen assignment
 * carries its OWN deadline (per-cell deadlines aren't supported — see
 * docs/updates-v4.md). The result is N × M instances, where every candidate
 * getting assignment X shares X's deadline.
 *
 * The UI is two stacked sections — candidates on top, assignments below —
 * because that fits a modal better than a literal matrix grid and still
 * makes the cardinality obvious via the "X candidates × Y assignments = Z
 * sends" preview.
 */
export const BulkAssignModal = ({ open, onClose }: Props) => {
  const { data: candidates, isLoading: candidatesLoading } = useCandidates();
  const { data: assignments, isLoading: assignmentsLoading } = useAssignments();
  const bulkAssign = useBulkAssign();
  const { push } = useToast();

  // candidateId → checked
  const [pickedCandidates, setPickedCandidates] = useState<Set<string>>(new Set());
  // assignmentId → { picked, deadline (ISO local string for the input) }
  const [pickedAssignments, setPickedAssignments] = useState<
    Map<string, { picked: boolean; deadline: string }>
  >(new Map());

  // Reset internal state every time the modal reopens. Without this the
  // reviewer's picks from a previous session leak into the next one.
  useEffect(() => {
    if (!open) return;
    setPickedCandidates(new Set());
    setPickedAssignments(new Map());
  }, [open]);

  const activeCandidates = useMemo(
    () => (candidates ?? []).filter((c) => c.isActive),
    [candidates]
  );

  const allCandidateIds = useMemo(
    () => activeCandidates.map((c) => c.id),
    [activeCandidates]
  );

  const candidatesAllChecked =
    allCandidateIds.length > 0 &&
    allCandidateIds.every((id) => pickedCandidates.has(id));

  const toggleCandidate = (id: string) => {
    setPickedCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllCandidates = () => {
    setPickedCandidates(candidatesAllChecked ? new Set() : new Set(allCandidateIds));
  };

  const toggleAssignment = (id: string) => {
    setPickedAssignments((prev) => {
      const next = new Map(prev);
      const cur = next.get(id);
      if (cur?.picked) {
        next.set(id, { picked: false, deadline: cur.deadline });
      } else {
        next.set(id, { picked: true, deadline: cur?.deadline ?? '' });
      }
      return next;
    });
  };

  const setAssignmentDeadline = (id: string, deadline: string) => {
    setPickedAssignments((prev) => {
      const next = new Map(prev);
      const cur = next.get(id);
      next.set(id, { picked: cur?.picked ?? true, deadline });
      return next;
    });
  };

  const pickedAssignmentList = useMemo(
    () =>
      Array.from(pickedAssignments.entries())
        .filter(([, v]) => v.picked)
        .map(([id, v]) => ({ id, deadline: v.deadline })),
    [pickedAssignments]
  );

  const assignmentsAllChecked =
    !!assignments &&
    assignments.length > 0 &&
    assignments.every((a) => pickedAssignments.get(a.id)?.picked);

  const toggleAllAssignments = () => {
    setPickedAssignments((prev) => {
      const next = new Map(prev);
      if (assignmentsAllChecked) {
        // Clear all — but keep deadlines so re-checking restores them.
        for (const [id, v] of next) next.set(id, { picked: false, deadline: v.deadline });
      } else {
        for (const a of assignments ?? []) {
          const cur = next.get(a.id);
          next.set(a.id, { picked: true, deadline: cur?.deadline ?? '' });
        }
      }
      return next;
    });
  };

  const candidateCount = pickedCandidates.size;
  const assignmentCount = pickedAssignmentList.length;
  const totalSends = candidateCount * assignmentCount;
  const canSubmit = totalSends > 0 && !bulkAssign.isPending;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const body: BulkAssignBody = {
      candidateIds: Array.from(pickedCandidates),
      assignments: pickedAssignmentList.map((a) => ({
        assignmentId: a.id,
        // datetime-local inputs are timezone-naive — interpret as local time
        // and emit a real ISO string. Empty → null (no deadline).
        deadline: a.deadline ? new Date(a.deadline).toISOString() : null,
      })),
    };

    try {
      const result = await bulkAssign.mutateAsync(body);
      const skippedHint = result.skipped > 0 ? ` (${result.skipped} skipped)` : '';
      push(`${result.created} sent${skippedHint}`, 'success');
      onClose();
    } catch (err) {
      push(err instanceof Error ? err.message : 'Bulk assign failed', 'error');
    }
  };

  const loading = candidatesLoading || assignmentsLoading;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Bulk assign"
      description="Pick candidates, pick assignments, set per-assignment deadlines. Every checked candidate gets every checked assignment."
      width="lg"
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="bulk-assign-form"
            loading={bulkAssign.isPending}
            disabled={!canSubmit}
          >
            {totalSends > 0 ? `Send ${totalSends} invite${totalSends === 1 ? '' : 's'}` : 'Send invites'}
          </Button>
        </>
      }
    >
      {loading ? (
        <PageLoader />
      ) : (
        <form id="bulk-assign-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Candidates */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-ink-soft font-medium">
                <Users size={13} /> Candidates
              </span>
              {activeCandidates.length > 0 && (
                <button
                  type="button"
                  onClick={toggleAllCandidates}
                  className="text-xs ws-link"
                >
                  {candidatesAllChecked ? 'Clear all' : 'Select all'}
                </button>
              )}
            </div>
            {activeCandidates.length === 0 ? (
              <p className="text-sm text-ink-soft italic">
                No active candidates. Create one first.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeCandidates.map((c) => {
                  const checked = pickedCandidates.has(c.id);
                  return (
                    <label
                      key={c.id}
                      className={`ws-card p-3 flex items-center gap-3 cursor-pointer transition ${
                        checked ? 'border-brand-500 bg-brand-50/40' : 'hover:bg-surface-subtle'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCandidate(c.id)}
                        className="h-4 w-4 accent-brand-700"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink truncate">{c.name}</p>
                        <p className="text-xs text-ink-soft truncate">{c.email}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </section>

          {/* Assignments + per-assignment deadlines */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-ink-soft font-medium">
                <ClipboardCheck size={13} /> Assignments
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-soft">Per-assignment deadlines</span>
                {assignments && assignments.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleAllAssignments}
                    className="text-xs ws-link"
                  >
                    {assignmentsAllChecked ? 'Clear all' : 'Select all'}
                  </button>
                )}
              </div>
            </div>
            {!assignments || assignments.length === 0 ? (
              <p className="text-sm text-ink-soft italic">
                No assignments yet. Create one first.
              </p>
            ) : (
              <div className="space-y-2 h-[400px]">
                {assignments.map((a) => {
                  const state = pickedAssignments.get(a.id);
                  const checked = state?.picked ?? false;
                  return (
                    <div
                      key={a.id}
                      className={`ws-card p-3 transition ${
                        checked ? 'border-brand-500 bg-brand-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAssignment(a.id)}
                          className="h-4 w-4 accent-brand-700"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-ink truncate">{a.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge tone="brand">
                              <Clock size={10} /> {a.durationMinutes} min
                            </Badge>
                            <Badge tone="neutral">{a.submissionType}</Badge>
                          </div>
                        </div>
                        <input
                          type="datetime-local"
                          aria-label={`Deadline for ${a.title}`}
                          disabled={!checked}
                          value={state?.deadline ?? ''}
                          onChange={(e) => setAssignmentDeadline(a.id, e.target.value)}
                          className="bg-surface border border-line rounded-lg px-2.5 py-1.5 text-xs text-ink disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Preview */}
          <div className="ws-card p-4 bg-surface-subtle text-sm text-ink-muted">
            {totalSends === 0 ? (
              <span>Pick at least one candidate and one assignment.</span>
            ) : (
              <span>
                <strong className="text-ink">{candidateCount}</strong>{' '}
                candidate{candidateCount === 1 ? '' : 's'} ×{' '}
                <strong className="text-ink">{assignmentCount}</strong>{' '}
                assignment{assignmentCount === 1 ? '' : 's'} ={' '}
                <strong className="text-ink">{totalSends}</strong>{' '}
                invite{totalSends === 1 ? '' : 's'}.
                {' '}Existing assignments to the same candidate will be skipped.
              </span>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
};
