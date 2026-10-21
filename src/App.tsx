/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { VocabularyProvider } from './context/VocabularyContext.tsx';
import { AuthPage } from './components/auth/AuthPage.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { Header } from './components/layout/Header.tsx';
import { DashboardPage } from './components/dashboard/DashboardPage.tsx';
import { VocabularyPage } from './components/vocabulary/VocabularyPage.tsx';
import { AddWordPage } from './components/vocabulary/AddWordPage.tsx';
import { SettingsPage } from './components/settings/SettingsPage.tsx';
import { ToastContainer } from './components/common/Toast.tsx';
import { LoadingSpinner } from './components/common/LoadingSpinner.tsx';
import { testConnection } from './firebase/config.ts';

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Validate Firestore connection on boot
    testConnection();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Opening your vocabulary vault..." />;
  }

  // If not signed in, show Auth Page
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <VocabularyProvider>
      <div className="min-h-screen bg-[#F8FAFC] flex text-[#172033]">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
        />

        {/* Main Content Viewport */}
        <div
          className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          {/* Header */}
          <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

          {/* Page Routing */}
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/vocabulary" element={<VocabularyPage />} />
              <Route path="/add" element={<AddWordPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {/* Global Toast Alerts */}
        <ToastContainer />
      </div>
    </VocabularyProvider>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
