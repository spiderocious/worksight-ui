import { useEffect, useState, type FormEvent } from 'react';
import { Button, Card, CardHeader, Input, PageLoader, Textarea } from '@shared/ui';
import { useToast } from '@shared/hooks/use-toast';
import { useAdminDownloads, useUpdateAdminDownloads } from '../api/use-admin-api';

export const AdminDownloadsScreen = () => {
  const { data, isLoading } = useAdminDownloads();
  const update = useUpdateAdminDownloads();
  const { push } = useToast();
  const [installCommand, setInstallCommand] = useState('');
  const [installScriptUrl, setInstallScriptUrl] = useState('');
  const [releasesUrl, setReleasesUrl] = useState('');
  const [latestVersion, setLatestVersion] = useState('');
  const [releasedAt, setReleasedAt] = useState('');

  useEffect(() => {
    if (!data) return;
    setInstallCommand(data.mac.installCommand);
    setInstallScriptUrl(data.mac.installScriptUrl);
    setReleasesUrl(data.mac.releasesUrl);
    setLatestVersion(data.mac.latestVersion);
    setReleasedAt(data.mac.releasedAt.slice(0, 16)); // datetime-local format
  }, [data]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await update.mutateAsync({
        installCommand,
        installScriptUrl,
        releasesUrl,
        latestVersion,
        releasedAt: releasedAt ? new Date(releasedAt).toISOString() : undefined,
      });
      push('Saved', 'success');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not save', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-display tracking-tight">Downloads</h1>
        <p className="text-sm text-ink-muted mt-1">
          Edit the install command + version surfaced on the marketing landing page and
          on candidate invite pages. Changes are live immediately.
        </p>
      </header>

      {isLoading || !data ? (
        <PageLoader />
      ) : (
        <Card>
          <CardHeader title="macOS install" />
          <form onSubmit={onSubmit} className="space-y-4">
            <Textarea
              label="Install command"
              rows={3}
              value={installCommand}
              onChange={(e) => setInstallCommand(e.target.value)}
              required
            />
            <Input
              label="Install script URL"
              type="url"
              value={installScriptUrl}
              onChange={(e) => setInstallScriptUrl(e.target.value)}
              required
            />
            <Input
              label="Releases page URL"
              type="url"
              value={releasesUrl}
              onChange={(e) => setReleasesUrl(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Latest version"
                value={latestVersion}
                onChange={(e) => setLatestVersion(e.target.value)}
                required
              />
              <label className="block w-full">
                <span className="block text-xs font-medium text-ink-muted mb-1.5">Released at</span>
                <input
                  type="datetime-local"
                  value={releasedAt}
                  onChange={(e) => setReleasedAt(e.target.value)}
                  className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5 text-sm text-ink"
                />
              </label>
            </div>
            <div className="flex justify-end pt-2">
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
