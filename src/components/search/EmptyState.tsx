import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function EmptyState({ onClearFilters, hasActiveFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <SearchX className="h-16 w-16 text-muted-foreground/50 mb-4" />

      <h3 className="text-lg font-semibold mb-2">
        Nenhum resultado encontrado
      </h3>

      <p className="text-muted-foreground mb-6 max-w-md">
        {hasActiveFilters
          ? 'Não encontramos nenhuma pessoa com os filtros aplicados. Tente ajustar os critérios de busca.'
          : 'Ainda não há pessoas cadastradas no sistema.'}
      </p>

      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters}>
          Limpar Filtros
        </Button>
      )}
    </div>
  );
}
