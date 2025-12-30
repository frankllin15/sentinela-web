import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { ErrorAlert } from "@/components/ui/error-alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useCreateUser,
  useUpdateUser,
} from "@/hooks/mutations/useUserMutations";
import { useUserById } from "@/hooks/queries/useUserQueries";
import { useForceList } from "@/hooks/queries/useForceQueries";
import { useAuthStore } from "@/store/auth.store";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "@/schemas/user.schema";
import { UserRole } from "@/types/auth.types";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: number;
}

const roleLabels = {
  [UserRole.ADMIN_GERAL]: "Administrador Geral",
  [UserRole.PONTO_FOCAL]: "Ponto Focal",
  [UserRole.GESTOR]: "Gestor",
  [UserRole.USUARIO]: "Usuário",
};

export function UserFormDialog({
  open,
  onOpenChange,
  userId,
}: UserFormDialogProps) {
  const currentUser = useAuthStore((state) => state.user);
  const isEditMode = !!userId;

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser(userId || 0);
  const {
    data: userData,
    isLoading: loadingUser,
    error: userError,
  } = useUserById(userId, { enabled: !!userId });
  const { data: forces, isLoading: loadingForces } = useForceList();

  // Recria o form quando userData muda para garantir que defaultValues sejam aplicados corretamente
  const formDefaultValues = useMemo(() => {
    if (isEditMode && userData) {
      return {
        email: userData.email,
        password: "",
        name: userData.name || "",
        role: userData.role,
        forceId: userData.forceId,
      };
    }
    return {
      email: "",
      password: "",
      name: "",
      role: undefined,
      forceId: undefined,
    };
  }, [isEditMode, userData]);

  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEditMode ? updateUserSchema : createUserSchema),
    defaultValues: formDefaultValues,
  });

  const selectedRole = form.watch("role");

  // Sincronizar formulário com userData quando mudar
  useEffect(() => {
    if (open) {
      form.reset(formDefaultValues);
    }
  }, [open, formDefaultValues, form]);

  // Reset forceId if admin_geral is selected
  useEffect(() => {
    if (selectedRole === UserRole.ADMIN_GERAL) {
      form.setValue("forceId", undefined);
    }
  }, [selectedRole]);

  const onSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    try {
      // Validate force requirement
      if (data.role !== UserRole.ADMIN_GERAL && !data.forceId) {
        form.setError("forceId", {
          message: "Força Policial é obrigatória para este perfil",
        });
        return;
      }

      if (isEditMode) {
        // Remove password if empty
        const updateData = { ...data };
        if (!updateData.password || updateData.password.trim() === "") {
          delete updateData.password;
        }
        await updateUserMutation.mutateAsync(updateData);
      } else {
        await createUserMutation.mutateAsync(data as CreateUserFormData);
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} user:`,
        error
      );
    }
  };

  // Get available roles based on current user role
  const availableRoles =
    currentUser?.role === UserRole.PONTO_FOCAL
      ? [UserRole.PONTO_FOCAL, UserRole.GESTOR, UserRole.USUARIO]
      : [
          UserRole.ADMIN_GERAL,
          UserRole.PONTO_FOCAL,
          UserRole.GESTOR,
          UserRole.USUARIO,
        ];

  const isLoading = isEditMode
    ? loadingUser || updateUserMutation.isPending
    : createUserMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize os dados do usuário. Deixe a senha em branco para mantê-la inalterada."
              : "Preencha os dados para criar um novo usuário no sistema."}
          </DialogDescription>
        </DialogHeader>

        {isEditMode && (loadingUser || !userData) ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Carregando dados do usuário...
            </p>
          </div>
        ) : isEditMode && userError ? (
          <ErrorAlert error={userError} title="Erro ao carregar usuário" />
        ) : (
          <Form {...form}>
            <form
              key={isEditMode && userData ? `edit-${userData.id}` : "create"}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do usuário" {...field} />
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
                      <Input
                        type="email"
                        placeholder="usuario@exemplo.com"
                        {...field}
                      />
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
                    <FormLabel>
                      {isEditMode ? "Nova Senha (opcional)" : "Senha Inicial"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        // type="password"
                        inputMode="numeric"
                        placeholder={
                          isEditMode
                            ? "Deixe em branco para manter a senha atual"
                            : "6-12 dígitos numéricos"
                        }
                        maxLength={12}
                        {...field}
                      />
                    </FormControl>
                    {isEditMode && (
                      <FormDescription>
                        Deixe em branco para manter a senha atual
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                      defaultValue={field.value?.toString()}
                      key={field.value} // Forçar re-mount ao mudar o valor
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {roleLabels[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedRole && selectedRole !== UserRole.ADMIN_GERAL && (
                <FormField
                  control={form.control}
                  name="forceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Força Policial</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                        disabled={loadingForces}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a força policial" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {forces?.map((force) => (
                            <SelectItem
                              key={force.id}
                              value={force.id.toString()}
                            >
                              {force.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter className="gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    onOpenChange(false);
                  }}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isEditMode ? "Atualizando..." : "Criando..."}
                    </>
                  ) : isEditMode ? (
                    "Atualizar Usuário"
                  ) : (
                    "Criar Usuário"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
