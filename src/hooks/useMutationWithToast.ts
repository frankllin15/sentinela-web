import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';
import { toasts } from '@/lib/toast.utils';

export interface UseMutationWithToastOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown
> extends UseMutationOptions<TData, TError, TVariables, TContext> {
  /**
   * Mensagem de sucesso a ser exibida
   * Pode ser string ou função que recebe os dados retornados
   */
  successMessage?: string | ((data: TData) => string);

  /**
   * Mensagem de erro a ser exibida
   * Pode ser string ou função que recebe o erro
   * Se não fornecida, o axios interceptor mostrará o erro
   */
  errorMessage?: string | ((error: TError) => string);

  /**
   * Se deve exibir toast de sucesso
   * @default true
   */
  showSuccessToast?: boolean;

  /**
   * Se deve exibir toast de erro
   * @default false (o axios interceptor já mostra o erro por padrão)
   */
  showErrorToast?: boolean;
}

/**
 * Wrapper para useMutation com toasts automáticos
 *
 * Elimina a repetição de toast.success() em onSuccess
 * e opcionalmente toast.error() em onError
 *
 * @example
 * ```tsx
 * const createUser = useMutationWithToast({
 *   mutationFn: userService.create,
 *   successMessage: 'Usuário criado com sucesso',
 *   onSuccess: (user) => {
 *     queryClient.invalidateQueries({ queryKey: ['users'] });
 *   }
 * });
 * ```
 *
 * Com mensagem dinâmica:
 * ```tsx
 * const updateUser = useMutationWithToast({
 *   mutationFn: userService.update,
 *   successMessage: (user) => `${user.name} atualizado com sucesso`,
 * });
 * ```
 */
export function useMutationWithToast<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationWithToastOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const {
    successMessage,
    errorMessage,
    showSuccessToast = true,
    showErrorToast = false,
    onSuccess,
    onError,
    ...mutationOptions
  } = options;

  return useMutation({
    ...mutationOptions,
    onSuccess: (...args) => {
      const [data] = args;

      // Exibir toast de sucesso se configurado
      if (showSuccessToast && successMessage) {
        const message = typeof successMessage === 'function'
          ? successMessage(data)
          : successMessage;
        toasts.success(message);
      }

      // Chamar callback original se existir
      onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;

      // Exibir toast de erro se configurado
      if (showErrorToast && errorMessage) {
        const message = typeof errorMessage === 'function'
          ? errorMessage(error)
          : errorMessage;
        toasts.error(message);
      }

      // Chamar callback original se existir
      onError?.(...args);
    },
  });
}
