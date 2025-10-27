import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * AuthContext with simple localStorage-backed mock auth.
 * - Persists user and token across refreshes using localStorage.
 * - Provides signIn, signUp, signOut flows.
 * - Includes a ProtectedRoute component to guard authenticated routes.
 */

// Storage keys used for persistence
const LS_USER_KEY = 'auth:user';
const LS_TOKEN_KEY = 'auth:token';

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  /**
   * Currently authenticated user object or null.
   * Example: { id, email, name }
   */
  user: null,
  /**
   * Mock token string or null.
   */
  token: null,
  /**
   * Whether auth state is being resolved from storage.
   */
  loading: false,
  /**
   * Sign in with email and password.
   * For the mock, any non-empty credentials succeed.
   */
  signIn: async (_email, _password) => {},
  /**
   * Sign up with provided data. Immediately signs user in for the mock.
   */
  signUp: async (_data) => {},
  /**
   * Clears user and token.
   */
  signOut: async () => {},
});

// Helper to safely parse JSON
function parseJSONSafe(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

// INTERNAL: read persisted auth from localStorage
function readPersistedAuth() {
  const userRaw = localStorage.getItem(LS_USER_KEY);
  const token = localStorage.getItem(LS_TOKEN_KEY);
  const user = userRaw ? parseJSONSafe(userRaw, null) : null;
  return { user, token };
}

// INTERNAL: write persisted auth to localStorage
function writePersistedAuth({ user, token }) {
  if (user) localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
  if (token) localStorage.setItem(LS_TOKEN_KEY, token);
}

// INTERNAL: clear persisted auth
function clearPersistedAuth() {
  localStorage.removeItem(LS_USER_KEY);
  localStorage.removeItem(LS_TOKEN_KEY);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides mock auth backed by localStorage.
   * Replace with real API calls in the future.
   */
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage once
  useEffect(() => {
    try {
      const { user: u, token: t } = readPersistedAuth();
      if (u && t) {
        setUser(u);
        setToken(t);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist changes
  useEffect(() => {
    if (user && token) {
      writePersistedAuth({ user, token });
    } else {
      clearPersistedAuth();
    }
  }, [user, token]);

  const signIn = useCallback(async (email, password) => {
    // Mock validation: require non-empty
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    // Simulate a token and user payload
    const mockToken = 'mock-token-' + Math.random().toString(36).slice(2);
    const nextUser = {
      id: 'user_' + Math.random().toString(36).slice(2, 8),
      email,
      name: email.split('@')[0],
    };
    setUser(nextUser);
    setToken(mockToken);
    return nextUser;
  }, []);

  const signUp = useCallback(async (data) => {
    // Data may include name, email, password. In mock, we only require email/password minimally.
    const email = data?.email;
    const password = data?.password;
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    // Mock immediate sign-in after sign-up
    return signIn(email, password);
  }, [signIn]);

  const signOut = useCallback(async () => {
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [user, token, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access authentication context. */
  return useContext(AuthContext);
}

/**
 * ProtectedRoute component:
 * Wrap any element that requires authentication:
 * <ProtectedRoute redirectTo="/signin"><Dashboard /></ProtectedRoute>
 */
// PUBLIC_INTERFACE
export function ProtectedRoute({ children, redirectTo = '/signin' }) {
  /**
   * Guards its children, redirecting to `redirectTo` when unauthenticated.
   * Preserves current location in state to allow post-login redirect.
   */
  const { user, loading } = useAuth();
  const location = useLocation();

  // While loading auth state from storage, avoid flicker by rendering nothing
  if (loading) return null;

  if (!user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  return children;
}
