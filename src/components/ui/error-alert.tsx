import { AlertCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getErrorMessage, getErrorDetails } from '@/lib/error.utils';
import { Button } from './button';

export interface ErrorAlertProps {
  error: Error | string | null | undefined;
  title?: string;
  className?: string;
  showIcon?: boolean;
  showDetails?: boolean;
  onRetry?: () => void;
}

export function ErrorAlert({
  error,
  title = 'Erro',
  className,
  showIcon = true,
  showDetails = false,
  onRetry,
}: ErrorAlertProps) {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  if (!error) return null;

  const message = getErrorMessage(error);
  const details = showDetails ? getErrorDetails(error) : undefined;
  const isDev = import.meta.env.DEV;
  const hasDetails = isDev && details && Object.keys(details).length > 0;

  return (
    <div
      className={cn(
        'rounded-lg border border-destructive/50 bg-destructive/10 p-4',
        className
      )}
      role="alert"
    >
      <div className="flex gap-3">
        {showIcon && (
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        )}
        <div className="flex-1 space-y-2">
          <div className="space-y-1">
            <h5 className="font-medium text-destructive">{title}</h5>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>

          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3"
            >
              Tentar Novamente
            </Button>
          )}

          {hasDetails && (
            <div className="mt-3 pt-3 border-t border-destructive/20">
              <button
                onClick={() => setDetailsExpanded(!detailsExpanded)}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform',
                    detailsExpanded && 'rotate-180'
                  )}
                />
                Detalhes técnicos (dev mode)
              </button>

              {detailsExpanded && (
                <pre className="mt-2 rounded-md bg-slate-950 p-3 text-xs text-slate-50 overflow-x-auto">
                  {JSON.stringify(details, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
