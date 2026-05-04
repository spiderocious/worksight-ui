import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Card, EmptyState, PageLoader } from '@shared/ui';
import { Plus, Users, ChevronRight } from '@shared/ui/icons';
import { useCandidates } from '../api/use-candidates-api';
import { CreateCandidateModal } from '../parts/create-candidate-modal';
import { AccessCodeDisplay } from '../parts/access-code-display';

export const CandidatesScreen = () => {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useCandidates();

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display tracking-tight">Candidates</h1>
          <p className="text-sm text-ink-muted mt-1">
            Onboard candidates and share their access codes manually.
          </p>
        </div>
        <Button iconLeft={<Plus size={16} />} onClick={() => setOpen(true)}>
          New candidate
        </Button>
      </header>

      {isLoading ? (
        <PageLoader />
      ) : !data || data.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users size={36} strokeWidth={1.5} />}
            title="No candidates yet"
            description="Create a candidate profile to generate an access code. Then share the code with them so they can sign into the WorkSight desktop app."
            action={<Button iconLeft={<Plus size={16} />} onClick={() => setOpen(true)}>New candidate</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((c) => (
            <Card key={c.id} className="hover:shadow-lift transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    to={`/app/candidates/${c.id}`}
                    className="text-base font-semibold text-ink hover:text-brand-800 inline-flex items-center gap-1.5"
                  >
                    {c.name}
                    <ChevronRight size={16} className="text-ink-soft" />
                  </Link>
                  <p className="text-sm text-ink-muted truncate">{c.email}</p>
                </div>
                {!c.isActive && <Badge tone="rose">Deactivated</Badge>}
              </div>
              <div className="mt-4">
                <AccessCodeDisplay code={c.accessCode} />
              </div>
              <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                <Stat label="Total" n={c.counts.total} />
                <Stat label="Pending" n={c.counts.pending} tone="amber" />
                <Stat label="Submitted" n={c.counts.submitted} tone="sky" />
                <Stat label="Scored" n={c.counts.scored} tone="success" />
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateCandidateModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

const Stat = ({ label, n, tone }: { label: string; n: number; tone?: 'amber' | 'sky' | 'success' }) => {
  const toneClass =
    tone === 'amber'
      ? 'text-amber-700'
      : tone === 'sky'
        ? 'text-sky-700'
        : tone === 'success'
          ? 'text-brand-800'
          : 'text-ink';
  return (
    <div className="rounded-lg bg-surface-subtle border border-line py-2">
      <div className={`text-lg font-semibold ${toneClass}`}>{n}</div>
      <div className="text-[10px] uppercase tracking-wider text-ink-soft">{label}</div>
    </div>
  );
};
