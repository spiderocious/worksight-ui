import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, tokenStore } from '@shared/services/api-client';
import type { Reviewer } from '@shared/types';

interface AuthShape {
  reviewer: Reviewer | null;
  loading: boolean;
  signIn: (token: string, reviewer: Reviewer) => void;
  signOut: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthShape | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [reviewer, setReviewer] = useState<Reviewer | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!tokenStore.get()) {
      setReviewer(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api<Reviewer>('/reviewers/me');
      setReviewer(me);
    } catch {
      tokenStore.clear();
      setReviewer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signIn = (token: string, r: Reviewer) => {
    tokenStore.set(token);
    setReviewer(r);
  };

  const signOut = () => {
    tokenStore.clear();
    setReviewer(null);
  };

  return (
    <AuthContext.Provider value={{ reviewer, loading, signIn, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
