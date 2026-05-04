import { Link } from 'react-router-dom';
import { Card, CardHeader, PageLoader } from '@shared/ui';
import { Users, KeyRound, Activity, ShieldCheck } from '@shared/ui/icons';
import { useAdminStats } from '../api/use-admin-api';

export const AdminDashboardScreen = () => {
  const { data, isLoading } = useAdminStats();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-display tracking-tight">Admin overview</h1>
        <p className="text-sm text-ink-muted mt-1">
          A quick read on system state. Add features as needed.
        </p>
      </header>

      {isLoading || !data ? (
        <PageLoader />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Stat
            label="Reviewers"
            value={data.reviewerCount}
            icon={<Users size={16} />}
            href="/admin/reviewers"
          />
          <Stat
            label="Candidates"
            value={data.candidateCount}
            sub={`${data.activeCandidateCount} active`}
            icon={<KeyRound size={16} />}
            href="/admin/candidates"
          />
          <Stat
            label="Assignments assigned"
            value={data.assignmentInstanceCount}
            icon={<Activity size={16} />}
          />
          <Stat
            label="Sessions"
            value={data.sessionCount}
            sub={`${data.scoredSessionCount} scored`}
            icon={<Activity size={16} />}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/downloads" className="block ws-card p-5 hover:shadow-lift transition">
          <CardHeader
            title="Downloads"
            subtitle="Edit the install command + version surfaced on the public landing page and invite pages."
          />
          <span className="inline-flex items-center gap-1.5 text-sm text-brand-700 font-medium">
            <ShieldCheck size={14} /> Manage
          </span>
        </Link>
        <Link to="/admin/blocklist" className="block ws-card p-5 hover:shadow-lift transition">
          <CardHeader
            title="Blocklist"
            subtitle="Edit the list of domains the Electron app blocks during a session."
          />
          <span className="inline-flex items-center gap-1.5 text-sm text-brand-700 font-medium">
            <ShieldCheck size={14} /> Manage
          </span>
        </Link>
      </div>
    </div>
  );
};

const Stat = ({
  label,
  value,
  sub,
  icon,
  href,
}: {
  label: string;
  value: number;
  sub?: string;
  icon: React.ReactNode;
  href?: string;
}) => {
  const inner = (
    <div className="ws-card p-4 hover:shadow-lift transition h-full">
      <div className="flex items-center gap-2 text-xs text-ink-soft uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-ink tabular-nums">{value.toLocaleString()}</div>
      {sub && <div className="text-xs text-ink-soft mt-0.5">{sub}</div>}
    </div>
  );
  return href ? (
    <Link to={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
};

// Card helper used above is the ws-card div; CardHeader is ours.
void Card;
