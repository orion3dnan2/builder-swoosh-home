import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { UserRole } from '../../shared/types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: {
    resource: string;
    action: string;
  };
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission,
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission.resource, requiredPermission.action)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// Helper components for specific roles
export function SuperAdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="super_admin">
      {children}
    </ProtectedRoute>
  );
}

export function MerchantRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="merchant">
      {children}
    </ProtectedRoute>
  );
}

export function AdminOrMerchantRoute({ children }: { children: ReactNode }) {
  const { isSuperAdmin, isMerchant } = useAuth();
  
  if (!isSuperAdmin && !isMerchant) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}
