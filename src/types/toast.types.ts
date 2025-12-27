import type { ExternalToast } from 'sonner';

/**
 * Opções estendidas para toast notifications
 */
export type ToastOptions = ExternalToast;

/**
 * Mensagens para toast.promise()
 */
export interface PromiseMessages<T = unknown> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: Error) => string);
}
