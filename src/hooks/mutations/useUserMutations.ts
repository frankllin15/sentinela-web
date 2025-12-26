import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService } from '@/services/user.service';
import { queryKeys } from '@/lib/query-keys';
import type { CreateUserDto, UpdateUserDto } from '@/types/user.types';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => userService.create(data),
    onSuccess: (newUser) => {
      // Cache the new user
      queryClient.setQueryData(queryKeys.users.detail(newUser.id), newUser);
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('Usuário criado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar usuário. Verifique os dados e tente novamente.');
    },
  });
}

export function useUpdateUser(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDto) => userService.update(userId, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.users.detail(userId), updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('Usuário atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar usuário.');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => userService.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('Usuário removido com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover usuário.');
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: number; isActive: boolean }) =>
      userService.toggleStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('Status do usuário atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar status do usuário.');
    },
  });
}
