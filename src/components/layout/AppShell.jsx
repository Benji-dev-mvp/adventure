import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * AppShell - Unified layout shell for the entire application
 * Provides consistent sidebar navigation and header across all routes
 */
export function AppShell({ children }) {
  const location = useLocation();
  
  // Pages that should not have the AppShell (landing page, marketing, etc.)
  const isPublicPage = ['/', '/marketing', '/onboarding'].includes(location.pathname);
  
  // If it's a public page, render children without shell
  if (isPublicPage) {
    return <>{children}</>;
  }
  
  // For all other pages, wrap with the full app shell
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
