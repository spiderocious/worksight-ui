import { useState } from 'react';
import { Badge, Button, Card, CardHeader, EmptyState, Modal, PageLoader } from '@shared/ui';
import { ListChecks, Pencil, Plus, Trash2 } from '@shared/ui/icons';
import { useToast } from '@shared/hooks/use-toast';
import { ICON_BY_NAME, renderIconByName } from '@shared/ui/icon-catalog';
import {
  type SessionRule,
  useCreateRule,
  useDeleteRule,
  useSessionRules,
  useUpdateRule,
} from '../api/use-settings-api';
import { RuleForm, type RuleFormValues } from './rule-form';

export const RulesTab = () => {
  const { data: rules, isLoading } = useSessionRules();
  const update = useUpdateRule();
  const remove = useDeleteRule();
  const create = useCreateRule();
  const { push } = useToast();
  const [editing, setEditing] = useState<SessionRule | null>(null);
  const [creating, setCreating] = useState(false);

  const onToggleActive = async (rule: SessionRule) => {
    try {
      await update.mutateAsync({ id: rule.id, body: { active: !rule.active } });
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not update', 'error');
    }
  };

  const onDelete = async (rule: SessionRule) => {
    if (!confirm(`Delete rule "${rule.title}"? This cannot be undone.`)) return;
    try {
      await remove.mutateAsync(rule.id);
      push('Rule deleted', 'success');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not delete', 'error');
    }
  };

  const onCreate = async (body: RuleFormValues) => {
    try {
      await create.mutateAsync(body);
      setCreating(false);
      push('Rule created', 'success');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not create', 'error');
    }
  };

  const onUpdate = async (body: RuleFormValues) => {
    if (!editing) return;
    try {
      await update.mutateAsync({ id: editing.id, body });
      setEditing(null);
      push('Rule updated', 'success');
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not update', 'error');
    }
  };

  return (
    <Card>
      <CardHeader
        title="Session rules"
        subtitle="Candidates must read and acknowledge these before starting a session."
        right={
          <Button iconLeft={<Plus size={14} />} size="sm" onClick={() => setCreating(true)}>
            New rule
          </Button>
        }
      />

      {isLoading ? (
        <PageLoader />
      ) : !rules || rules.length === 0 ? (
        <EmptyState
          icon={<ListChecks size={32} strokeWidth={1.5} />}
          title="No rules yet"
          description="Create at least one rule. Candidates can't start a session without acknowledging your rules."
          action={
            <Button iconLeft={<Plus size={14} />} onClick={() => setCreating(true)}>
              New rule
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-line">
          {rules.map((rule) => {
            const Icon = ICON_BY_NAME[rule.icon];
            return (
              <li key={rule.id} className="py-4 flex items-start gap-4">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                  {Icon ? <Icon size={18} /> : renderIconByName('CircleDot', { size: 18 })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink truncate">{rule.title}</p>
                    {!rule.active && <Badge tone="neutral">Hidden</Badge>}
                  </div>
                  <p className="text-sm text-ink-muted mt-1 leading-relaxed">{rule.subtitle}</p>
                  <p className="text-xs text-ink-soft mt-2">
                    Order #{rule.order} · Icon <span className="font-mono">{rule.icon}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleActive(rule)}
                    loading={update.isPending && update.variables?.id === rule.id}
                  >
                    {rule.active ? 'Hide' : 'Show'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconLeft={<Pencil size={13} />}
                    onClick={() => setEditing(rule)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconLeft={<Trash2 size={13} />}
                    onClick={() => onDelete(rule)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="New session rule" width="lg">
        <RuleForm
          submitLabel="Create rule"
          onSubmit={onCreate}
          onCancel={() => setCreating(false)}
          loading={create.isPending}
        />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit rule" width="lg">
        {editing && (
          <RuleForm
            initial={editing}
            submitLabel="Save changes"
            onSubmit={onUpdate}
            onCancel={() => setEditing(null)}
            loading={update.isPending}
          />
        )}
      </Modal>
    </Card>
  );
};
