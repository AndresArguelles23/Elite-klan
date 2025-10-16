import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  initializing: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<Session>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const syncSession = async () => {
      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (sessionError) {
        setError(sessionError.message);
      }

      setSession(currentSession);
      setInitializing(false);
    };

    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, authSession) => {
      if (!mounted) {
        return;
      }
      setSession(authSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { session: signedSession },
        error: signInError,
      } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError || !signedSession) {
        throw new Error(signInError?.message ?? 'No fue posible iniciar sesión.');
      }

      setSession(signedSession);
      return signedSession;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido al iniciar sesión.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw new Error(signOutError.message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido al cerrar sesión.';
      setError(message);
      throw err;
    } finally {
      setSession(null);
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      initializing,
      loading,
      error,
      login,
      logout,
      clearError,
    }),
    [session, initializing, loading, error, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
