import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { ErrorAlert, type ErrorAlertProps } from "@/components/ui/error-alert";
import { isApiError } from "@/lib/error.utils";
import { toasts } from "@/lib/toast.utils";
import { useEffect } from "react";

export interface UseQueryWithErrorOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[]
> extends UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {
  /**
   * Se deve exibir toast automaticamente quando houver erro
   * @default false
   */
  showErrorToast?: boolean;

  /**
   * Mensagem customizada para o toast de erro
   */
  errorMessage?: string;

  /**
   * Título para o ErrorAlert
   * @default "Erro ao carregar dados"
   */
  errorTitle?: string;

  /**
   * Props adicionais para o ErrorAlert
   */
  errorAlertProps?: Partial<ErrorAlertProps>;
}

export type UseQueryWithErrorResult<TData = unknown, TError = Error> = UseQueryResult<TData, TError> & {
  /**
   * Componente ErrorAlert pronto para renderizar
   * Retorna null se não houver erro
   */
  errorAlert: React.ReactNode;

  /**
   * Verifica se o erro é uma instância de ApiError
   */
  isApiError: boolean;
};

/**
 * Wrapper para useQuery com suporte a ErrorAlert automático
 *
 * @example
 * ```tsx
 * const { data, errorAlert, refetch } = useQueryWithError({
 *   queryKey: ['user', id],
 *   queryFn: () => userService.getById(id),
 *   errorTitle: 'Erro ao carregar usuário',
 * });
 *
 * if (!data) return errorAlert;
 *
 * return <div>{data.name}</div>;
 * ```
 *
 * Com toast automático:
 * ```tsx
 * const query = useQueryWithError({
 *   queryKey: ['users'],
 *   queryFn: userService.list,
 *   showErrorToast: true,
 *   errorMessage: 'Não foi possível carregar a lista de usuários',
 * });
 * ```
 */
export function useQueryWithError<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[]
>(
  options: UseQueryWithErrorOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryWithErrorResult<TData, TError> {
  const {
    showErrorToast = false,
    errorMessage,
    errorTitle = "Erro ao carregar dados",
    errorAlertProps,
    ...queryOptions
  } = options;

  const queryResult = useQuery(queryOptions);
  const { error, refetch } = queryResult;

  // Exibir toast de erro se configurado
  useEffect(() => {
    if (showErrorToast && error) {
      const message = errorMessage || "Erro ao carregar dados";
      toasts.error(error instanceof Error ? error : message);
    }
  }, [error, showErrorToast, errorMessage]);

  // Gerar ErrorAlert
  const errorAlert = error ? (
    <ErrorAlert
      error={error instanceof Error ? error : String(error)}
      title={errorTitle}
      onRetry={() => refetch()}
      {...errorAlertProps}
    />
  ) : null;

  const isErrorApiError = error ? isApiError(error) : false;

  return {
    ...queryResult,
    errorAlert,
    isApiError: isErrorApiError,
  };
}
