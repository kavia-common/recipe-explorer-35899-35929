import React from 'react';
import './App.css';
import AppRouter from './routes/AppRouter';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { RecipesProvider } from './context/RecipesContext';

/**
 * App composes Theme, Auth, and Recipes providers and renders router content.
 */

// PUBLIC_INTERFACE
function AppShell() {
  /** App chrome: theme toggle + routed content. */
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        {/* Routed content goes here */}
        <AppRouter />
      </header>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /** Root App component that composes all providers. */
  return (
    <ThemeProvider>
      <AuthProvider>
        <RecipesProvider>
          <AppShell />
        </RecipesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
