import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants/routes';
import type { UserRole } from '@/types/auth.types';

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    toast.error('Acesso negado');
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}
