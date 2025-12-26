import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateUser } from '@/hooks/mutations/useUserMutations';
import { useForceList } from '@/hooks/queries/useForceQueries';
import { useAuthStore } from '@/store/auth.store';
import { createUserSchema, type CreateUserFormData } from '@/schemas/user.schema';
import { UserRole } from '@/types/auth.types';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleLabels = {
  [UserRole.ADMIN_GERAL]: 'Administrador Geral',
  [UserRole.PONTO_FOCAL]: 'Ponto Focal',
  [UserRole.GESTOR]: 'Gestor',
  [UserRole.USUARIO]: 'Usuário',
};

export function UserFormDialog({ open, onOpenChange }: UserFormDialogProps) {
  const currentUser = useAuthStore((state) => state.user);
  const createUserMutation = useCreateUser();
  const { data: forces, isLoading: loadingForces } = useForceList();

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      role: undefined,
      forceId: undefined,
    },
  });

  const selectedRole = form.watch('role');

  // Reset forceId if admin_geral is selected
  useEffect(() => {
    if (selectedRole === UserRole.ADMIN_GERAL) {
      form.setValue('forceId', undefined);
    }
  }, [selectedRole, form]);

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      // Validate force requirement
      if (data.role !== UserRole.ADMIN_GERAL && !data.forceId) {
        form.setError('forceId', {
          message: 'Força Policial é obrigatória para este perfil',
        });
        return;
      }

      await createUserMutation.mutateAsync(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Get available roles based on current user role
  const availableRoles = currentUser?.role === UserRole.PONTO_FOCAL
    ? [UserRole.PONTO_FOCAL, UserRole.GESTOR, UserRole.USUARIO]
    : [UserRole.ADMIN_GERAL, UserRole.PONTO_FOCAL, UserRole.GESTOR, UserRole.USUARIO];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo usuário no sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <FormLabel>Senha Inicial</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      inputMode="numeric"
                      placeholder="6-12 dígitos numéricos"
                      maxLength={12}
                      {...field}
                    />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um perfil" />
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
                          <SelectItem key={force.id} value={force.id.toString()}>
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

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                disabled={createUserMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Usuário'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
