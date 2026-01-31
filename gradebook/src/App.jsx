import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ClassPage from './pages/ClassPage';
import ClassSettings from './pages/ClassSettings';
import RosterPage from './pages/RosterPage';

export default function App() {
  return (
    <Routes>
      {/* We removed the /auth route and the SignedIn/SignedOut wrappers.
          Everything is now direct and unprotected.
      */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="roster" element={<RosterPage />} />
        <Route path="class/:classId" element={<ClassPage />} />
        <Route path="class/:classId/settings" element={<ClassSettings />} />
      </Route>
    </Routes>
  );
}