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
import { SearchPage } from '@/pages/app/SearchPage';
import { PeoplePage } from '@/pages/app/PeoplePage';
import { EditPersonPage } from '@/pages/app/EditPersonPage';
import { ProfilePage } from '@/pages/app/ProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { UsersPage } from '@/pages/admin/UsersPage';
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
        <Route path="search" element={<SearchPage />} />
        <Route path="people/:id" element={<PeoplePage />} />
        <Route path="people/:id/edit" element={<EditPersonPage />} />
        <Route path="profile" element={<ProfilePage />} />
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
        <Route path="users" element={<UsersPage />} />
      </Route>

      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
