import { useQueryClient } from '@tanstack/react-query';
import { useMutationWithToast } from '@/hooks/useMutationWithToast';
import { userService } from '@/services/user.service';
import { queryKeys } from '@/lib/query-keys';
import type { CreateUserDto, UpdateUserDto } from '@/types/user.types';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutationWithToast({
    mutationFn: (data: CreateUserDto) => userService.create(data),
    successMessage: 'Usuário criado com sucesso',
    onSuccess: (newUser) => {
      // Cache the new user
      queryClient.setQueryData(queryKeys.users.detail(newUser.id), newUser);
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useUpdateUser(userId: number) {
  const queryClient = useQueryClient();

  return useMutationWithToast({
    mutationFn: (data: UpdateUserDto) => userService.update(userId, data),
    successMessage: 'Usuário atualizado com sucesso',
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.users.detail(userId), updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutationWithToast({
    mutationFn: (userId: number) => userService.delete(userId),
    successMessage: 'Usuário removido com sucesso',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutationWithToast({
    mutationFn: ({ userId, isActive }: { userId: number; isActive: boolean }) =>
      userService.toggleStatus(userId, isActive),
    successMessage: 'Status do usuário atualizado',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
