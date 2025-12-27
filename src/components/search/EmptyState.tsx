import { SearchX, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/error.utils';

interface EmptyStateProps {
  variant?: 'empty' | 'error';
  error?: Error | string;
  onClearFilters?: () => void;
  onRetry?: () => void;
  hasActiveFilters?: boolean;
  title?: string;
  description?: string;
}

export function EmptyState({
  variant = 'empty',
  error,
  onClearFilters,
  onRetry,
  hasActiveFilters = false,
  title,
  description,
}: EmptyStateProps) {
  // Error variant
  if (variant === 'error') {
    const errorMessage = error ? getErrorMessage(error) : 'Ocorreu um erro ao carregar os dados';

    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>

        <h3 className="text-lg font-semibold mb-2 text-destructive">
          {title || 'Erro ao carregar'}
        </h3>

        <p className="text-muted-foreground mb-6 max-w-md">
          {description || errorMessage}
        </p>

        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Tentar Novamente
          </Button>
        )}
      </div>
    );
  }

  // Empty variant (default)
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <SearchX className="h-16 w-16 text-muted-foreground/50 mb-4" />

      <h3 className="text-lg font-semibold mb-2">
        {title || 'Nenhum resultado encontrado'}
      </h3>

      <p className="text-muted-foreground mb-6 max-w-md">
        {description || (hasActiveFilters
          ? 'Não encontramos nenhuma pessoa com os filtros aplicados. Tente ajustar os critérios de busca.'
          : 'Ainda não há pessoas cadastradas no sistema.')}
      </p>

      {hasActiveFilters && onClearFilters && (
        <Button variant="outline" onClick={onClearFilters}>
          Limpar Filtros
        </Button>
      )}
    </div>
  );
}
