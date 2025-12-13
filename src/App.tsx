import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { HomePage } from '@/pages/app/HomePage';
import { RegisterPage } from '@/pages/app/RegisterPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { UserRole } from '@/types/auth.types';

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />

      {/* Protected routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<HomePage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Role-protected routes (Admin/Ponto Focal only) */}
      <Route
        path="/admin"
        element={
          <RoleProtectedRoute
            allowedRoles={[UserRole.ADMIN_GERAL, UserRole.PONTO_FOCAL]}
          >
            <AppLayout />
          </RoleProtectedRoute>
        }
      >
        <Route
          path="users"
          element={
            <div className="text-center">
              <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
              <p className="mt-2 text-muted-foreground">
                Funcionalidade em desenvolvimento
              </p>
            </div>
          }
        />
      </Route>

      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
