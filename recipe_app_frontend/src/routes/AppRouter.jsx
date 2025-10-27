import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../context/AuthContext';

/**
 * Simple placeholder pages for initial routing.
 * These will be replaced with real pages in later steps.
 */
const Placeholder = ({ title }) => (
  <div style={{ padding: 24 }}>
    <h1 style={{ marginBottom: 8 }}>{title}</h1>
    <p>This is a temporary placeholder page for {title}. Replace with actual implementation.</p>
  </div>
);

// PUBLIC_INTERFACE
export default function AppRouter() {
  /** Router responsible for mapping application paths to pages. */
  return (
    <Routes>
      <Route path="/" element={<Placeholder title="Home" />} />
      <Route path="/signin" element={<Placeholder title="Sign In" />} />
      <Route path="/signup" element={<Placeholder title="Sign Up" />} />

      {/* Protected application areas */}
      <Route
        path="/recipes"
        element={
          <ProtectedRoute>
            <Placeholder title="Recipes" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipes/:id"
        element={
          <ProtectedRoute>
            <Placeholder title="Recipe Details" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Placeholder title="Favorites" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/collections"
        element={
          <ProtectedRoute>
            <Placeholder title="Collections" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Placeholder title="Profile" />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
