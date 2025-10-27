import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';
import AppRouter from './routes/AppRouter';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

/**
 * Lightweight Recipes context (stub for now).
 * Theme and Auth are provided by dedicated context providers.
 */

// Recipes Context
export const RecipesContext = createContext({
  recipes: [],
  favorites: [],
  collections: [],
  refresh: async () => {},
});

// Helpers to use contexts (optional convenience)
export const useRecipes = () => useContext(RecipesContext);

// PUBLIC_INTERFACE
export function RecipesProvider({ children }) {
  /** Minimal recipes provider stub. Replace with real data fetching later. */
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [collections, setCollections] = useState([]);

  const refresh = async () => {
    // no-op stub: keep empty arrays for now
    setRecipes([]);
    setFavorites([]);
    setCollections([]);
  };

  useEffect(() => {
    // On mount, we can prime with empty sets to avoid undefined
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RecipesContext.Provider value={{ recipes, favorites, collections, refresh, setRecipes, setFavorites, setCollections }}>
      {children}
    </RecipesContext.Provider>
  );
}

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
