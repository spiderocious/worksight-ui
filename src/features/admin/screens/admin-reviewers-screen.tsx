import { useState } from 'react';
import { Button, Card, CardHeader, EmptyState, PageLoader } from '@shared/ui';
import { Users, ChevronLeft, ChevronRight } from '@shared/ui/icons';
import { formatDate } from '@shared/utils/format-date';
import { useAdminReviewers } from '../api/use-admin-api';

export const AdminReviewersScreen = () => {
  const [page, setPage] = useState(1);
  const limit = 25;
  const { data, isLoading } = useAdminReviewers(page, limit);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-display tracking-tight">Reviewers</h1>
        <p className="text-sm text-ink-muted mt-1">
          Every reviewer who has signed up. Read-only for now.
        </p>
      </header>

      <Card className="p-0">
        {isLoading || !data ? (
          <PageLoader />
        ) : data.items.length === 0 ? (
          <EmptyState icon={<Users size={28} strokeWidth={1.5} />} title="No reviewers yet" />
        ) : (
          <>
            <div className="divide-y divide-line">
              {data.items.map((r) => (
                <div key={r.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink truncate">{r.name}</p>
                    <p className="text-xs text-ink-soft truncate mt-0.5">{r.email}</p>
                  </div>
                  <span className="text-xs text-ink-soft">{formatDate(r.createdAt)}</span>
                </div>
              ))}
            </div>
            <Pagination
              page={page}
              limit={limit}
              total={data.total}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => p + 1)}
            />
          </>
        )}
      </Card>

      <CardHeader title="" />
    </div>
  );
};

const Pagination = ({
  page,
  limit,
  total,
  onPrev,
  onNext,
}: {
  page: number;
  limit: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="px-5 py-4 border-t border-line flex items-center justify-between text-xs text-ink-muted">
      <span>
        Page {page} of {totalPages} · {total.toLocaleString()} total
      </span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" iconLeft={<ChevronLeft size={14} />} onClick={onPrev} disabled={page <= 1}>
          Prev
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconRight={<ChevronRight size={14} />}
          onClick={onNext}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
