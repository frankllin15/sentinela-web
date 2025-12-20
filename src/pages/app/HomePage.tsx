import { useAuthStore } from '@/store/auth.store';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Search, UserPlus } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function HomePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bem-vindo ao Sentinela</h1>
        {user && (
          <p className="mt-2 text-muted-foreground">
            Olá, {user.email} ({user.role.replace('_', ' ').toUpperCase()})
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Novo Cadastro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Cadastrar novo indivíduo no sistema
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => navigate(ROUTES.REGISTER)}
            >
              Começar Cadastro
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Buscar indivíduos cadastrados
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => navigate(ROUTES.SEARCH)}
            >
              Buscar Pessoas
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Meus Registros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ver registros criados por você
            </p>
            <Button className="mt-4 w-full" disabled>
              Em breve
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
