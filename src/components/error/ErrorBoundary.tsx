import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary para capturar erros não tratados em componentes React
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 *
 * Com fallback customizado:
 * ```tsx
 * <ErrorBoundary fallback={(error, reset) => (
 *   <div>
 *     <h1>Ops! {error.message}</h1>
 *     <button onClick={reset}>Tentar novamente</button>
 *   </div>
 * )}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro para monitoramento futuro
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Callback customizado se fornecido
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Fallback customizado
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      // Fallback padrão
      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Algo deu errado</h2>
                <p className="text-sm text-muted-foreground">
                  {this.state.error.message || 'Ocorreu um erro inesperado'}
                </p>
              </div>

              <Button onClick={() => window.location.reload()} className="w-full">
                Recarregar Página
              </Button>

              {import.meta.env.DEV && (
                <details className="w-full text-left">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                    Detalhes técnicos (dev mode)
                  </summary>
                  <pre className="mt-2 rounded-md bg-muted p-3 text-xs text-muted-foreground overflow-x-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
