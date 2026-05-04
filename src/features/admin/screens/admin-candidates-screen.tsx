import { useState } from 'react';
import { Badge, Button, Card, EmptyState, PageLoader } from '@shared/ui';
import { KeyRound, ChevronLeft, ChevronRight } from '@shared/ui/icons';
import { formatDate } from '@shared/utils/format-date';
import { useAdminCandidates } from '../api/use-admin-api';

export const AdminCandidatesScreen = () => {
  const [page, setPage] = useState(1);
  const limit = 25;
  const { data, isLoading } = useAdminCandidates(page, limit);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-display tracking-tight">Candidates</h1>
        <p className="text-sm text-ink-muted mt-1">
          Every candidate across all reviewers. Read-only for now.
        </p>
      </header>

      <Card className="p-0">
        {isLoading || !data ? (
          <PageLoader />
        ) : data.items.length === 0 ? (
          <EmptyState icon={<KeyRound size={28} strokeWidth={1.5} />} title="No candidates yet" />
        ) : (
          <>
            <div className="divide-y divide-line">
              {data.items.map((c) => (
                <div key={c.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-ink truncate">{c.name}</p>
                      {!c.isActive && <Badge tone="rose">Deactivated</Badge>}
                    </div>
                    <p className="text-xs text-ink-soft truncate mt-0.5">{c.email}</p>
                  </div>
                  <code className="text-xs font-mono text-ink-muted">{c.accessCode}</code>
                  <span className="text-xs text-ink-soft">{formatDate(c.createdAt)}</span>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-line flex items-center justify-between text-xs text-ink-muted">
              <span>
                Page {page} of {Math.max(1, Math.ceil(data.total / limit))} · {data.total.toLocaleString()} total
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconLeft={<ChevronLeft size={14} />}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Prev
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconRight={<ChevronRight size={14} />}
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.max(1, Math.ceil(data.total / limit))}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
