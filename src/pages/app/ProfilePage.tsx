import { useAuthStore } from "@/store/auth.store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormData } from "@/schemas/profile.schema";
import { useUpdateProfile } from "@/hooks/mutations/useProfileMutations";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Save, Loader2 } from "lucide-react";

const formatRole = (role: string) => {
  const roleMap: Record<string, string> = {
    admin_geral: "Administrador Geral",
    ponto_focal: "Ponto Focal",
    gestor: "Gestor",
    usuario: "Usuário",
  };
  return roleMap[role] || role;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function ProfilePage() {
  const { user } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      // Reset campos de senha após sucesso
      form.setValue('password', '');
      form.setValue('confirmPassword', '');
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto pb-8 space-y-6">
      <PageHeader
        title="Perfil"
        subtitle="Visualize e edite suas informações pessoais"
        breadcrumbs={[
          { label: "Início", icon: Home, href: "/app/home" },
          { label: "Perfil" },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card 1: Informações Somente Leitura */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Perfil</p>
              <p className="text-base">{formatRole(user.role)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Força Policial</p>
              <p className="text-base">{user.forceName || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={user.isActive ? "default" : "destructive"}>
                {user.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Cadastrado em</p>
              <p className="text-base">{formatDate(user.createdAt)}</p>
            </div>

          </CardContent>
        </Card>

        {/* Card 2: Formulário de Edição */}
        <Card>
          <CardHeader>
            <CardTitle>Editar Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Digite seu email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          inputMode="numeric"
                          placeholder="Deixe em branco para manter a senha atual"
                          maxLength={12}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        6-12 dígitos numéricos. Deixe em branco para não alterar.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          inputMode="numeric"
                          placeholder="Digite a senha novamente"
                          maxLength={12}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
