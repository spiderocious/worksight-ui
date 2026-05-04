import { useState, type FormEvent } from 'react';
import clsx from 'clsx';
import { Button, Input, Textarea } from '@shared/ui';
import { ICON_BY_NAME, ICON_NAMES } from '@shared/ui/icon-catalog';

export interface RuleFormValues {
  icon: string;
  title: string;
  subtitle: string;
  active: boolean;
  order: number;
}

interface Props {
  initial?: Partial<RuleFormValues>;
  submitLabel: string;
  loading?: boolean;
  onSubmit: (values: RuleFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export const RuleForm = ({ initial, submitLabel, loading, onSubmit, onCancel }: Props) => {
  const [icon, setIcon] = useState(initial?.icon ?? 'ShieldAlert');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? '');
  const [active, setActive] = useState(initial?.active ?? true);
  const [order, setOrder] = useState(initial?.order ?? 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ icon, title, subtitle, active, order });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <span className="block text-xs font-medium text-ink-muted mb-2">Icon</span>
        <div className="grid grid-cols-8 gap-2">
          {ICON_NAMES.map((name) => {
            const Icon = ICON_BY_NAME[name];
            return (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => setIcon(name)}
                className={clsx(
                  'h-10 rounded-lg border flex items-center justify-center transition',
                  icon === name
                    ? 'border-brand-500 bg-brand-50 text-brand-800'
                    : 'border-line text-ink-muted hover:border-brand-300 hover:text-ink'
                )}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-ink-soft mt-2 font-mono">{icon}</p>
      </div>

      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea
        label="Subtitle / body"
        rows={4}
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        required
        placeholder="A short paragraph explaining what this rule means for the candidate."
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Order"
          type="number"
          min={0}
          max={1000}
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          hint="Lower numbers show first."
        />
        <label className="block">
          <span className="block text-xs font-medium text-ink-muted mb-1.5">Visibility</span>
          <label className="inline-flex items-center gap-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 accent-brand-700"
            />
            <span className="text-sm text-ink">
              {active ? 'Shown to candidates' : 'Hidden from candidates'}
            </span>
          </label>
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
