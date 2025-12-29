import { useMutationWithToast } from '@/hooks/useMutationWithToast';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/store/auth.store';
import { storage } from '@/lib/storage';
import type { UpdateUserDto } from '@/types/user.types';

export function useUpdateProfile() {
  const { user, setUser } = useAuthStore();

  return useMutationWithToast({
    mutationFn: async (data: UpdateUserDto & { confirmPassword?: string }) => {
      if (!user) throw new Error('Usuário não autenticado');

      // Remove confirmPassword (campo apenas para validação frontend)
      const updateData = { ...data };
      delete updateData.confirmPassword;

      // Remove password se vazio (padrão do UserFormDialog.tsx:130-132)
      if (!updateData.password || updateData.password.trim() === '') {
        delete updateData.password;
      }

      return userService.update(user.id, updateData);
    },
    successMessage: 'Perfil atualizado com sucesso',
    onSuccess: (updatedUser) => {
      // Atualiza Zustand store E localStorage
      setUser(updatedUser);
      storage.setUser(updatedUser);
    },
  });
}
