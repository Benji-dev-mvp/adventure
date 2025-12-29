/**
 * App Providers
 * Centralized provider wrapper for all context providers
 */
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '../lib/queryClient';
import { ThemeProvider } from '../contexts/ThemeContext';
import { TenantProvider } from '../contexts/TenantContext';
import { ToastProvider } from '../components/Toast';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Wraps the app with all necessary providers in the correct order.
 * Order matters for provider nesting!
 *
 * Provider order:
 * 1. QueryClient - Data fetching layer
 * 2. Theme - Visual theming
 * 3. Tenant - Segment-aware behavior (plan, admin, org settings)
 * 4. Toast - Notifications
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TenantProvider>
          <ToastProvider>{children}</ToastProvider>
        </TenantProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default AppProviders;
