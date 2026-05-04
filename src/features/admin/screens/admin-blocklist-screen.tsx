import { useEffect, useState, type FormEvent } from 'react';
import { Button, Card, CardHeader, PageLoader, Textarea } from '@shared/ui';
import { useToast } from '@shared/hooks/use-toast';
import { formatDate } from '@shared/utils/format-date';
import { useAdminBlocklist, useUpdateAdminBlocklist } from '../api/use-admin-api';

/**
 * One domain per line. Server lowercases + dedupes on save.
 */
export const AdminBlocklistScreen = () => {
  const { data, isLoading } = useAdminBlocklist();
  const update = useUpdateAdminBlocklist();
  const { push } = useToast();
  const [text, setText] = useState('');

  useEffect(() => {
    if (!data) return;
    setText(data.domains.join('\n'));
  }, [data]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const domains = text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await update.mutateAsync({ domains });
      push(`Saved (${domains.length} domains)`, 'success');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not save', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-display tracking-tight">Blocklist</h1>
        <p className="text-sm text-ink-muted mt-1">
          The domains the Electron app blocks during a candidate session. Changes are
          picked up on the next session start — running sessions are not affected.
        </p>
      </header>

      {isLoading || !data ? (
        <PageLoader />
      ) : (
        <Card>
          <CardHeader
            title={`${data.domains.length} domain${data.domains.length === 1 ? '' : 's'}`}
            subtitle={`Last updated ${formatDate(data.updatedAt)}. One domain per line — no scheme, no path.`}
          />
          <form onSubmit={onSubmit} className="space-y-4">
            <Textarea
              label="Domains"
              rows={16}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="font-mono text-sm"
              placeholder="chat.openai.com&#10;claude.ai&#10;gemini.google.com"
            />
            <p className="text-xs text-ink-soft -mt-2">
              Anything pointing at a non-domain (with <span className="font-mono">/</span>,{' '}
              <span className="font-mono">https://</span>, etc.) will be rejected by validation.
            </p>
            <div className="flex justify-end">
              <Button type="submit" loading={update.isPending}>
                Save changes
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
