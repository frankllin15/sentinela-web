import { ErrorAlert, type ErrorAlertProps } from './error-alert';

export interface FormErrorAlertProps extends Omit<ErrorAlertProps, 'title'> {
  title?: string;
}

/**
 * Variante de ErrorAlert otimizada para formulários
 * Exibe erros de API acima dos campos do formulário
 */
export function FormErrorAlert({
  error,
  title = 'Erro ao enviar formulário',
  ...props
}: FormErrorAlertProps) {
  if (!error) return null;

  return (
    <ErrorAlert
      error={error}
      title={title}
      {...props}
    />
  );
}
