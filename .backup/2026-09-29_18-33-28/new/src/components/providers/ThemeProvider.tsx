import * as React from 'react';
import { useAppStore } from '@/store/useAppStore';

export type Theme = 'dark' | 'light' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolved: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * ThemeProvider — keeps the document's `dark` class in sync with the
 * user's theme preference and the OS system preference when theme is
 * `system`. The ORCA UI is dark-first, but the light editorial sections
 * live on pearl/white surfaces regardless of the outer theme.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const userTheme = useAppStore((s) => s.user?.preferences.theme) ?? 'dark';
  const [resolved, setResolved] = React.useState<'dark' | 'light'>(
    userTheme === 'system' ? getSystemTheme() : userTheme
  );

  // Sync resolved theme with the DOM.
  React.useEffect(() => {
    const effective = userTheme === 'system' ? getSystemTheme() : userTheme;
    setResolved(effective);

    const root = document.documentElement;
    if (effective === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [userTheme]);

  // Listen to system preference changes when theme is `system`.
  React.useEffect(() => {
    if (userTheme !== 'system' || typeof window === 'undefined') return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const effective = query.matches ? 'dark' : 'light';
      setResolved(effective);
      const root = document.documentElement;
      if (effective === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    };
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, [userTheme]);

  const setTheme = React.useCallback((theme: Theme) => {
    useAppStore.getState().updatePreferences({ theme });
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme: userTheme, resolved, setTheme }),
    [userTheme, resolved, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'dark',
      resolved: 'dark',
      setTheme: () => {
        /* no-op when provider not mounted */
      },
    };
  }
  return context;
}