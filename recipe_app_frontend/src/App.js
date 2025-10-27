import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';
import AppRouter from './routes/AppRouter';

/**
 * Lightweight stub contexts (Theme, Auth, Recipes)
 * These are intentionally minimal so the app renders now and can be expanded later.
 */

// Theme Context
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// Auth Context
export const AuthContext = createContext({
  user: null,
  signin: async () => {},
  signup: async () => {},
  signout: async () => {},
});

// Recipes Context
export const RecipesContext = createContext({
  recipes: [],
  favorites: [],
  collections: [],
  refresh: async () => {},
});

// Helpers to use contexts (optional convenience)
export const useTheme = () => useContext(ThemeContext);
export const useAuth = () => useContext(AuthContext);
export const useRecipes = () => useContext(RecipesContext);

// PUBLIC_INTERFACE
export function ThemeProvider({ children }) {
  /** Provides theme state and toggler. Applies data-theme to documentElement. */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Minimal auth provider stub. Replace with real auth in future. */
  const [user, setUser] = useState(null);

  const signin = async (/* credentials */) => {
    // no-op stub: pretend success
    setUser({ id: 'demo', name: 'Demo User' });
  };
  const signup = async (/* details */) => {
    // no-op stub
    setUser({ id: 'demo', name: 'Demo User' });
  };
  const signout = async () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

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
