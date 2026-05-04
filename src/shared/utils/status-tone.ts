import type { InstanceStatus } from '@shared/types';

export const instanceStatusTone = (s: InstanceStatus) => {
  switch (s) {
    case 'pending':
      return 'neutral' as const;
    case 'in_progress':
      return 'amber' as const;
    case 'submitted':
      return 'sky' as const;
    case 'scored':
      return 'success' as const;
    case 'closed':
      return 'rose' as const;
  }
};

export const instanceStatusLabel = (s: InstanceStatus) => {
  return s.replace('_', ' ');
};
