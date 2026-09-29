import * as React from 'react';
import { useAppStore, type ThemePreference } from '@/store/useAppStore';

export type Theme = ThemePreference;

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
 * user's theme preference.
 *
 * The preference is stored in the app store (UI state) so that GUESTS
 * (no authenticated user) can also switch themes, and the choice
 * persists across refreshes. `user.preferences.theme` remains a
 * secondary preference that is synced when a user signs in.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);
  const setThemeInStore = useAppStore((s) => s.setTheme);

  const [resolved, setResolved] = React.useState<'dark' | 'light'>(
    theme === 'system' ? getSystemTheme() : theme
  );

  // Apply the resolved theme to the DOM whenever the preference changes.
  React.useEffect(() => {
    const effective = theme === 'system' ? getSystemTheme() : theme;
    setResolved(effective);

    const root = document.documentElement;
    if (effective === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');

    // Keep the browser chrome in sync (mobile address bar, etc).
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', effective === 'dark' ? '#020617' : '#F7FBFC');
    }
  }, [theme]);

  // Listen to OS theme changes when preference is `system`.
  React.useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined') return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const effective = query.matches ? 'dark' : 'light';
      setResolved(effective);
      const root = document.documentElement;
      if (effective === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');

      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', effective === 'dark' ? '#020617' : '#F7FBFC');
      }
    };
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = React.useCallback(
    (next: Theme) => {
      setThemeInStore(next);
      // If authenticated, mirror the choice into the user preferences so
      // the backend (when wired) can persist it.
      const state = useAppStore.getState();
      if (state.user) {
        useAppStore.setState({
          user: {
            ...state.user,
            preferences: { ...state.user.preferences, theme: next },
          },
        });
      }
    },
    [setThemeInStore]
  );

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolved, setTheme }),
    [theme, resolved, setTheme]
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