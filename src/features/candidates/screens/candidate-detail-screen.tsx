import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Button, Card, CardHeader, EmptyState, PageLoader } from '@shared/ui';
import {
  ArrowLeft,
  RefreshCw,
  Lock,
  Activity,
  ChevronRight,
  Trash2,
} from '@shared/ui/icons';
import { useToast } from '@shared/hooks/use-toast';
import { formatDate, formatDuration } from '@shared/utils/format-date';
import { instanceStatusLabel, instanceStatusTone } from '@shared/utils/status-tone';
import type { CandidateHistoryItem } from '@shared/types';
import {
  useCandidate,
  useCandidateHistory,
  useDeactivateCandidate,
  useRegenerateCode,
} from '../api/use-candidates-api';
import { AccessCodeDisplay } from '../parts/access-code-display';
import { InviteLinkDisplay } from '../parts/invite-link-display';
import { RemoveInstanceModal } from '@features/assignments/parts/remove-instance-modal';

export const CandidateDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const { data: candidate, isLoading } = useCandidate(id);
  const { data: history } = useCandidateHistory(id);
  const regenerate = useRegenerateCode();
  const deactivate = useDeactivateCandidate();
  const { push } = useToast();
  const [removeTarget, setRemoveTarget] = useState<CandidateHistoryItem | null>(null);

  if (isLoading || !candidate) return <PageLoader />;

  const onRegenerate = async () => {
    if (!confirm('Regenerate the access code? The old code will stop working immediately.')) return;
    try {
      await regenerate.mutateAsync(candidate.id);
      push('Access code regenerated', 'success');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not regenerate', 'error');
    }
  };

  const onDeactivate = async () => {
    if (!confirm('Deactivate this candidate? They will not be able to start new sessions.')) return;
    try {
      await deactivate.mutateAsync(candidate.id);
      push('Candidate deactivated', 'success');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not deactivate', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/app/candidates" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft size={14} /> All candidates
      </Link>

      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display tracking-tight">{candidate.name}</h1>
          <p className="text-sm text-ink-muted mt-1">{candidate.email}</p>
          <p className="text-xs text-ink-soft mt-1">Added {formatDate(candidate.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          {!candidate.isActive ? (
            <Badge tone="rose">Deactivated</Badge>
          ) : (
            <Button variant="secondary" iconLeft={<Lock size={14} />} onClick={onDeactivate}>
              Deactivate
            </Button>
          )}
        </div>
      </header>

      <Card>
        <CardHeader
          title="Access code"
          subtitle="Share this with the candidate. They will use it to sign into the desktop app."
          right={
            <Button
              variant="soft"
              iconLeft={<RefreshCw size={14} />}
              onClick={onRegenerate}
              loading={regenerate.isPending}
            >
              Regenerate
            </Button>
          }
        />
        <AccessCodeDisplay code={candidate.accessCode} size="lg" />

        <div className="mt-6 pt-6 border-t border-line">
          <p className="text-xs uppercase tracking-wider text-ink-soft mb-2">Invite link</p>
          <p className="text-xs text-ink-muted mb-3 leading-relaxed">
            Send the candidate this URL — it's a personalized landing page with the
            install command and their access code, in one place. Regenerating the
            access code invalidates this link.
          </p>
          <InviteLinkDisplay accessCode={candidate.accessCode} />
        </div>
      </Card>

      <Card>
        <CardHeader
          title="History"
          subtitle="Every assignment, session, and score for this candidate."
        />
        {!history || history.length === 0 ? (
          <EmptyState
            icon={<Activity size={28} strokeWidth={1.5} />}
            title="No assignments yet"
            description="Assign one from the Assignments screen."
          />
        ) : (
          <div className="divide-y divide-line">
            {history.map((row) => (
              <div key={row.instance.id} className="py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink truncate">
                      {row.assignment?.title ?? 'Assignment'}
                    </span>
                    <Badge tone={instanceStatusTone(row.instance.status)}>
                      {instanceStatusLabel(row.instance.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-soft mt-0.5">
                    Assigned {formatDate(row.instance.createdAt)}
                    {row.session ? ` · ${formatDuration(row.session.durationSeconds)} session` : ''}
                  </p>
                </div>
                {row.score && (
                  <div className="text-right">
                    <div className="text-base font-semibold text-brand-800">
                      {row.score.numericScore}
                      <span className="text-ink-soft text-xs font-normal">/100</span>
                    </div>
                  </div>
                )}
                {row.instance.status !== 'in_progress' && (
                  <button
                    type="button"
                    onClick={() => setRemoveTarget(row)}
                    className="p-2 rounded-lg text-ink-soft hover:text-danger hover:bg-rose-50 transition"
                    aria-label="Remove assignment from candidate"
                    title="Remove assignment from candidate"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                {row.session ? (
                  <Link
                    to={`/app/sessions/${row.session.id}`}
                    className="text-ink-soft hover:text-brand-700 p-1 rounded hover:bg-surface-sunken"
                  >
                    <ChevronRight size={18} />
                  </Link>
                ) : (
                  <span className="w-7" />
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <RemoveInstanceModal
        open={removeTarget !== null}
        onClose={() => setRemoveTarget(null)}
        instanceId={removeTarget?.instance.id ?? ''}
        status={removeTarget?.instance.status ?? 'pending'}
        assignmentTitle={removeTarget?.assignment?.title}
        candidateName={candidate.name}
        score={
          removeTarget?.score
            ? {
                value: removeTarget.score.numericScore,
                scoredAt: removeTarget.score.createdAt,
              }
            : null
        }
      />
    </div>
  );
};
