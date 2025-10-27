import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Ocean Professional Theme
 * - Primary: #2563EB
 * - Secondary: #F59E0B
 * - Error: #EF4444
 * - Background: #f9fafb
 * - Surface: #ffffff
 * - Text: #111827
 */

// PUBLIC_INTERFACE
export const ThemeContext = createContext({
  /** Current theme name: 'light' | 'dark' */
  theme: 'light',
  /** Toggle between light/dark */
  toggleTheme: () => {},
  /** Tokens for the active theme */
  tokens: {},
});

// Internal tokens map for both themes
const THEME_TOKENS = {
  light: {
    '--color-primary': '#2563EB',
    '--color-secondary': '#F59E0B',
    '--color-success': '#22C55E',
    '--color-error': '#EF4444',
    '--color-warning': '#F59E0B',

    '--bg': '#f9fafb',
    '--surface': '#ffffff',
    '--text': '#111827',
    '--text-muted': 'rgba(17, 24, 39, 0.7)',
    '--border': 'rgba(17, 24, 39, 0.12)',

    // Spacing scale
    '--space-1': '4px',
    '--space-2': '8px',
    '--space-3': '12px',
    '--space-4': '16px',
    '--space-5': '20px',
    '--space-6': '24px',
    '--space-8': '32px',
    '--space-10': '40px',
    '--space-12': '48px',

    // Radii
    '--radius-xs': '6px',
    '--radius-sm': '8px',
    '--radius-md': '12px',
    '--radius-lg': '16px',
    '--radius-xl': '20px',
    '--radius-full': '9999px',

    // Shadows
    '--shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
    '--shadow-md': '0 4px 12px rgba(0, 0, 0, 0.08)',
    '--shadow-lg': '0 10px 24px rgba(0, 0, 0, 0.10)',

    // Typography
    '--font-sans': "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    '--font-mono': "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",

    '--line-height': '1.5',
  },
  dark: {
    '--color-primary': '#2563EB',
    '--color-secondary': '#F59E0B',
    '--color-success': '#22C55E',
    '--color-error': '#EF4444',
    '--color-warning': '#F59E0B',

    '--bg': '#0f172a',          // slate-900
    '--surface': '#111827',     // gray-900
    '--text': '#f9fafb',        // near-white
    '--text-muted': 'rgba(249, 250, 251, 0.7)',
    '--border': 'rgba(249, 250, 251, 0.12)',

    // Spacing scale (same)
    '--space-1': '4px',
    '--space-2': '8px',
    '--space-3': '12px',
    '--space-4': '16px',
    '--space-5': '20px',
    '--space-6': '24px',
    '--space-8': '32px',
    '--space-10': '40px',
    '--space-12': '48px',

    // Radii (same)
    '--radius-xs': '6px',
    '--radius-sm': '8px',
    '--radius-md': '12px',
    '--radius-lg': '16px',
    '--radius-xl': '20px',
    '--radius-full': '9999px',

    // Shadows tuned for dark mode (lighter opacity)
    '--shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.3)',
    '--shadow-md': '0 4px 12px rgba(0, 0, 0, 0.35)',
    '--shadow-lg': '0 10px 24px rgba(0, 0, 0, 0.4)',

    // Typography
    '--font-sans': "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    '--font-mono': "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",

    '--line-height': '1.5',
  },
};

/**
 * Apply current theme tokens to :root via [data-theme] attribute.
 * This keeps CSS simple and enables live theme switching.
 */
function applyThemeToRoot(themeName) {
  const root = document.documentElement;
  root.dataset.theme = themeName;
  const tokens = THEME_TOKENS[themeName];
  Object.entries(tokens).forEach(([k, v]) => {
    root.style.setProperty(k, v);
  });
}

// PUBLIC_INTERFACE
export function ThemeProvider({ children }) {
  /**
   * Provides theme state, tokens, and toggle function.
   * Syncs document.documentElement.dataset.theme and injects CSS variables.
   */
  const [theme, setTheme] = useState('light');

  // On mount: respect user system preference if any
  useEffect(() => {
    try {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = prefersDark ? 'dark' : 'light';
      setTheme((prev) => prev || initial);
      applyThemeToRoot(initial);
    } catch {
      applyThemeToRoot('light');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update root dataset and CSS variables on theme change
  useEffect(() => {
    applyThemeToRoot(theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      tokens: THEME_TOKENS[theme],
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// PUBLIC_INTERFACE
export function useTheme() {
  /** Hook to access theme context. */
  return useContext(ThemeContext);
}
