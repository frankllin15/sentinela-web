import { toast } from 'sonner';
import { getErrorMessage, isApiError } from './error.utils';
import type { ToastOptions, PromiseMessages } from '@/types/toast.types';

/**
 * Wrappers padronizados para notificações toast
 * Garante consistência de mensagens, pontuação e durações
 */
export const toasts = {
  /**
   * Toast de sucesso
   * Adiciona automaticamente "!" no final da mensagem
   * Duração padrão: 3 segundos
   */
  success: (message: string, options?: ToastOptions) => {
    const formattedMessage = message.endsWith('!') ? message : `${message}!`;
    return toast.success(formattedMessage, {
      duration: 3000,
      ...options,
    });
  },

  /**
   * Toast de erro
   * Aceita Error | ApiError | string
   * Extrai mensagem user-facing de ApiError automaticamente
   * Duração padrão: 5 segundos
   */
  error: (error: Error | string, options?: ToastOptions) => {
    let message: string;

    if (typeof error === 'string') {
      message = error;
    } else if (isApiError(error)) {
      // Se é user-facing, usa a mensagem do backend
      message = error.isUserFacing
        ? error.message
        : 'Ocorreu um erro inesperado. Tente novamente mais tarde';
    } else {
      message = getErrorMessage(error);
    }

    // Remove "!" se existir no final (erros não devem ter exclamação)
    const formattedMessage = message.endsWith('!') ? message.slice(0, -1) : message;

    return toast.error(formattedMessage, {
      duration: 5000,
      ...options,
    });
  },

  /**
   * Toast informativo
   * Sem exclamação no final
   * Duração padrão: 3 segundos
   */
  info: (message: string, options?: ToastOptions) => {
    const formattedMessage = message.endsWith('!') ? message.slice(0, -1) : message;
    return toast.info(formattedMessage, {
      duration: 3000,
      ...options,
    });
  },

  /**
   * Toast de aviso
   * Sem exclamação no final
   * Duração padrão: 4 segundos
   */
  warning: (message: string, options?: ToastOptions) => {
    const formattedMessage = message.endsWith('!') ? message.slice(0, -1) : message;
    return toast.warning(formattedMessage, {
      duration: 4000,
      ...options,
    });
  },

  /**
   * Toast de carregamento
   * Retorna ID do toast para permitir dismiss posterior
   */
  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, options);
  },

  /**
   * Toast baseado em Promise
   * Mostra loading -> success/error automaticamente
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: PromiseMessages<T>
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: (data) => {
        const msg = typeof messages.success === 'function'
          ? messages.success(data)
          : messages.success;
        return msg.endsWith('!') ? msg : `${msg}!`;
      },
      error: (error) => {
        let msg: string;

        if (typeof messages.error === 'function') {
          msg = messages.error(error);
        } else {
          msg = messages.error;
        }

        // Para promises, se receber ApiError, usar a mensagem do erro
        if (isApiError(error) && error.isUserFacing) {
          msg = error.message;
        }

        return msg.endsWith('!') ? msg.slice(0, -1) : msg;
      },
    });
  },

  /**
   * Dispensa um toast específico ou todos
   */
  dismiss: (id?: string | number) => {
    toast.dismiss(id);
  },
};
