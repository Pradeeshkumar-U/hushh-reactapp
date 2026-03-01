import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Admins from './pages/Admins';
import Events from './pages/Events';
import Analytics from './pages/Analytics';
import SettingsPage from './pages/Settings';
import LoginPage from './pages/Login';
import CommunitySelector from './pages/CommunitySelector';
import { AuthProvider, useAuth } from './AuthContext';
import api from './api';

const AppContent = () => {
  const { user, communityId, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <LoginPage />;
  if (!communityId) return <CommunitySelector />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
