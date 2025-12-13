import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso');
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 md:gap-4">
            <h1 className="text-lg md:text-xl font-bold text-primary">SENTINELA</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {user && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <div className="hidden sm:flex flex-col">
                  <span className="font-medium">{user.email}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.role.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
