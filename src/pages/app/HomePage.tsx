import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HomeIcon, Search, UserPlus, Users } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { PageHeader } from "@/components/layout/PageHeader";
import { UserRole } from "@/types/auth.types";

export function HomePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const canManageUsers =
    user?.role === UserRole.ADMIN_GERAL || user?.role === UserRole.PONTO_FOCAL;

  return (
    <div className="max-w-6xl mx-auto pb-8 space-y-6">
      <PageHeader
        title="Bem-vindo ao Sentinela"
        subtitle={
          "Sistema de Gestão de Indivíduos para Forças Policiais"
        }
        breadcrumbs={[{ label: "Início", icon: HomeIcon }]}
      />
       {/* MARCA D'ÁGUA (Watermark) 
        - Fixa no fundo
        - Opacidade muito baixa (5%) para não atrapalhar a leitura
        - Pointer-events-none para permitir clicar através dela
      */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none select-none">
        <div className="relative  opacity-[0.05]">
           <img src="/logo.png" className="w-125 h-[500px] object-contain" />
           <div className="absolute inset-0 flex items-center justify-center">
           </div>
        </div>
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
              Buscar Indivíduos
            </Button>
          </CardContent>
        </Card>

        {canManageUsers && (
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestão de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gerenciar usuários e permissões do sistema
              </p>
              <Button
                className="mt-4 w-full"
                onClick={() => navigate("/admin/users")}
              >
                Gerenciar Usuários
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
