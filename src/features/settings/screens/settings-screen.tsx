import { useState } from 'react';
import clsx from 'clsx';
import { Card, CardHeader, PageLoader } from '@shared/ui';
import { ShieldCheck, FileText, Camera } from '@shared/ui/icons';
import { RulesTab } from '../parts/rules-tab';
import { PostSubmissionTab } from '../parts/post-submission-tab';
import { ScreenshotsTab } from '../parts/screenshots-tab';
import { useReviewerSettings } from '../api/use-settings-api';

type Tab = 'rules' | 'post-submission' | 'screenshots';

const TABS: Array<{ id: Tab; label: string; icon: React.ReactNode; description: string }> = [
  {
    id: 'rules',
    label: 'Session rules',
    icon: <ShieldCheck size={16} />,
    description: 'What candidates see before they start a session.',
  },
  {
    id: 'post-submission',
    label: 'Post-submission',
    icon: <FileText size={16} />,
    description: 'The screen candidates see after submitting.',
  },
  {
    id: 'screenshots',
    label: 'Screenshots',
    icon: <Camera size={16} />,
    description: 'Capture interval and the in-app warning.',
  },
];

export const SettingsScreen = () => {
  const [tab, setTab] = useState<Tab>('rules');
  const { data: settings, isLoading } = useReviewerSettings();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-display tracking-tight">Settings</h1>
        <p className="text-sm text-ink-muted mt-1">
          Customize the candidate experience. Changes apply to every new session.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-4 lg:col-span-3">
          <Card className="p-2">
            <nav className="flex flex-col gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={clsx(
                    'flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                    tab === t.id
                      ? 'bg-brand-50 text-brand-900'
                      : 'text-ink-muted hover:text-ink hover:bg-surface-sunken'
                  )}
                >
                  <span className="mt-0.5 shrink-0">{t.icon}</span>
                  <span>
                    <span className="block text-sm font-medium">{t.label}</span>
                    <span className="block text-xs text-ink-soft mt-0.5">{t.description}</span>
                  </span>
                </button>
              ))}
            </nav>
          </Card>
        </aside>

        <section className="col-span-12 md:col-span-8 lg:col-span-9 space-y-6">
          {isLoading || !settings ? (
            <Card>
              <CardHeader title="Loading…" />
              <PageLoader />
            </Card>
          ) : tab === 'rules' ? (
            <RulesTab />
          ) : tab === 'post-submission' ? (
            <PostSubmissionTab settings={settings} />
          ) : (
            <ScreenshotsTab settings={settings} />
          )}
        </section>
      </div>
    </div>
  );
};
