import { Link, useParams } from 'react-router-dom';
import { Badge, Card, CardHeader, PageLoader } from '@shared/ui';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ExternalLink,
  Camera,
  Hourglass,
} from '@shared/ui/icons';
import { formatDate, formatDuration } from '@shared/utils/format-date';
import { useSession } from '../api/use-sessions-api';
import { ScreenshotScrubber } from '../parts/screenshot-scrubber';
import { ScorePanel } from '../parts/score-panel';
import { BlockedAttemptsList } from '../parts/blocked-attempts-list';

export const SessionDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useSession(id);

  if (isLoading || !data) return <PageLoader />;

  const cleanBadge = data.autoClosed ? (
    <Badge tone="rose" icon={<Hourglass size={11} />}>Auto-closed</Badge>
  ) : data.terminationClean ? (
    <Badge tone="success" icon={<ShieldCheck size={11} />}>Clean</Badge>
  ) : (
    <Badge tone="amber" icon={<ShieldAlert size={11} />}>Abnormal</Badge>
  );

  return (
    <div className="space-y-6">
      <Link to="/app/instances" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft size={14} /> All sessions
      </Link>

      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-display tracking-tight">
            {data.assignment?.title ?? 'Session'}
          </h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {cleanBadge}
            <span className="text-sm text-ink-muted">
              {data.candidate?.name} · {data.candidate?.email}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <MetaCard label="Started" value={formatDate(data.startedAt)} icon={<Clock size={14} />} />
        <MetaCard label="Ended" value={formatDate(data.endedAt)} icon={<Clock size={14} />} />
        <MetaCard
          label="Duration"
          value={formatDuration(data.durationSeconds)}
          icon={<Hourglass size={14} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Screenshots"
              subtitle={`${data.screenshots.length} captured during this session.`}
              right={<Badge tone="neutral" icon={<Camera size={11} />}>{data.screenshots.length}</Badge>}
            />
            <ScreenshotScrubber screenshots={data.screenshots} />
          </Card>

          <Card>
            <CardHeader
              title="Blocked-domain attempts"
              subtitle={
                data.blockedAttempts.length === 0
                  ? "No connections to blocked sites were attempted."
                  : `${data.blockedAttempts.length} attempt${data.blockedAttempts.length === 1 ? '' : 's'} during this session.`
              }
              right={
                data.blockedAttempts.length > 0 ? (
                  <Badge tone="rose" icon={<ShieldAlert size={11} />}>
                    {data.blockedAttempts.length}
                  </Badge>
                ) : undefined
              }
            />
            <BlockedAttemptsList attempts={data.blockedAttempts} />
          </Card>

          <Card>
            <CardHeader title="Submission" />
            {data.submissionLink && (
              <div className="mb-4">
                <p className="text-xs text-ink-muted mb-1">Link</p>
                <a
                  href={data.submissionLink}
                  target="_blank"
                  rel="noreferrer"
                  className="ws-link inline-flex items-center gap-1 break-all"
                >
                  {data.submissionLink} <ExternalLink size={12} />
                </a>
              </div>
            )}
            {data.submissionContent ? (
              <div>
                <p className="text-xs text-ink-muted mb-1">Free text</p>
                <pre className="text-sm whitespace-pre-wrap font-sans bg-surface-subtle border border-line rounded-lg p-4 leading-relaxed">
                  {data.submissionContent}
                </pre>
              </div>
            ) : !data.submissionLink ? (
              <p className="text-sm text-ink-soft italic">No submission was captured.</p>
            ) : null}
          </Card>
        </div>

        <div className="space-y-6">
          <ScorePanel sessionId={data.id} />
          <Card>
            <CardHeader title="Assignment brief" />
            <div className="text-sm whitespace-pre-wrap text-ink-muted leading-relaxed max-h-80 overflow-y-auto">
              {data.assignment?.brief ?? '—'}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const MetaCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className="ws-card p-4">
    <div className="flex items-center gap-1.5 text-xs text-ink-soft uppercase tracking-wider">
      {icon}
      {label}
    </div>
    <div className="mt-1.5 text-sm font-medium text-ink">{value}</div>
  </div>
);
