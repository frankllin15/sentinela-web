import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, LogIn } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function NotFoundPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-primary">404</CardTitle>
          <p className="mt-2 text-xl text-muted-foreground">
            Página não encontrada
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A página que você está procurando não existe ou foi removida.
          </p>
          {isAuthenticated ? (
            <Button onClick={() => navigate(ROUTES.HOME)} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Voltar para Home
            </Button>
          ) : (
            <Button onClick={() => navigate(ROUTES.LOGIN)} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Fazer Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
