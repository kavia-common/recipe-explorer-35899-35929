import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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
      <Route path="/recipes" element={<Placeholder title="Recipes" />} />
      <Route path="/recipes/:id" element={<Placeholder title="Recipe Details" />} />
      <Route path="/favorites" element={<Placeholder title="Favorites" />} />
      <Route path="/collections" element={<Placeholder title="Collections" />} />
      <Route path="/profile" element={<Placeholder title="Profile" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
