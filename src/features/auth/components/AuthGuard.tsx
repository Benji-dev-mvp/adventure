/**
 * AuthGuard Component
 * Protects routes that require authentication
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore, selectIsAuthenticated, selectUser } from '../../../stores';
import { PageLoader } from '../../../components/Loading';

interface AuthGuardProps {
  children: React.ReactNode;
  /** Required role(s) to access the route */
  requiredRole?: 'user' | 'admin' | 'super_admin' | ('user' | 'admin' | 'super_admin')[];
  /** Redirect path if not authenticated */
  redirectTo?: string;
  /** Show loader while checking auth */
  fallback?: React.ReactNode;
}

/**
 * Protects routes requiring authentication
 */
export function AuthGuard({
  children,
  requiredRole,
  redirectTo = '/login',
  fallback,
}: AuthGuardProps) {
  const location = useLocation();
  const isAuthenticated = useUserStore(selectIsAuthenticated);
  const user = useUserStore(selectUser);
  const isLoading = useUserStore(state => state.isLoading);

  // Show loading state while checking authentication
  if (isLoading) {
    return fallback ? <>{fallback}</> : <PageLoader message="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && user) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!roles.includes(user.role)) {
      // User doesn't have required role - redirect to dashboard or show forbidden
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}

/**
 * AdminGuard - Convenience wrapper for admin-only routes
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole={['admin', 'super_admin']}>{children}</AuthGuard>;
}

/**
 * SuperAdminGuard - Convenience wrapper for super-admin-only routes
 */
export function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="super_admin">{children}</AuthGuard>;
}

/**
 * GuestGuard - Redirects authenticated users away from guest-only pages (login, register)
 */
interface GuestGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function GuestGuard({ children, redirectTo = '/dashboard' }: GuestGuardProps) {
  const isAuthenticated = useUserStore(selectIsAuthenticated);
  const isLoading = useUserStore((state: { isLoading: boolean }) => state.isLoading);

  if (isLoading) {
    return <PageLoader message="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export default AuthGuard;
