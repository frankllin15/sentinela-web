import { ApiError } from '@/types/api-error';

/**
 * Verifica se um erro é uma instância de ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Extrai uma mensagem legível de diferentes tipos de erro
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado';
}

/**
 * Verifica se a mensagem de erro deve ser exibida ao usuário final
 */
export function isUserFacingError(error: unknown): boolean {
  if (isApiError(error)) {
    return error.isUserFacing;
  }
  return false;
}

/**
 * Obtém detalhes técnicos do erro (apenas em modo dev)
 */
export function getErrorDetails(error: unknown): Record<string, unknown> | undefined {
  if (isApiError(error)) {
    return error.details;
  }
  return undefined;
}

/**
 * Formata a mensagem de erro para exibição ao usuário
 * Se não for user-facing, retorna mensagem genérica
 */
export function formatErrorMessage(error: unknown): string {
  if (isApiError(error) && error.isUserFacing) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Ocorreu um erro inesperado. Tente novamente mais tarde';
}
