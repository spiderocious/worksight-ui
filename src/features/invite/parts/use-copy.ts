import { useState } from 'react';
import { copyToClipboard } from '@shared/utils/copy-to-clipboard';

/**
 * Track which copy button was last clicked so the UI can swap the icon to a
 * checkmark for ~1.5s. Multiple buttons share one `copy()` — pass a unique
 * `key` per button.
 */
export const useCopy = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    if (await copyToClipboard(text)) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };
  return { copiedKey, copy };
};
