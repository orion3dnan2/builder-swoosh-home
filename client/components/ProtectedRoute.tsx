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
  const location = useLocation();
  
  // Use try-catch to handle any potential errors
  try {
    const { isAuthenticated, hasRole, hasPermission } = useAuth();

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
  } catch (error) {
    console.error('ProtectedRoute error:', error);
    // If there's an error, redirect to login
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }
}

// Helper components for specific roles with error handling
export function SuperAdminRoute({ children }: { children: ReactNode }) {
  try {
    return (
      <ProtectedRoute requiredRole="super_admin">
        {children}
      </ProtectedRoute>
    );
  } catch (error) {
    console.error('SuperAdminRoute error:', error);
    return <Navigate to="/login" replace />;
  }
}

export function MerchantRoute({ children }: { children: ReactNode }) {
  try {
    return (
      <ProtectedRoute requiredRole="merchant">
        {children}
      </ProtectedRoute>
    );
  } catch (error) {
    console.error('MerchantRoute error:', error);
    return <Navigate to="/login" replace />;
  }
}

export function AdminOrMerchantRoute({ children }: { children: ReactNode }) {
  try {
    const { isSuperAdmin, isMerchant } = useAuth();
    
    if (!isSuperAdmin && !isMerchant) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    return <>{children}</>;
  } catch (error) {
    console.error('AdminOrMerchantRoute error:', error);
    return <Navigate to="/login" replace />;
  }
}
