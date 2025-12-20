import { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePeopleList } from '@/hooks/queries/usePeopleQueries';
import { PersonCard } from '@/components/search/PersonCard';
import { FilterSheet } from '@/components/search/FilterSheet';
import { Pagination } from '@/components/search/Pagination';
import { LoadingState } from '@/components/search/LoadingState';
import { EmptyState } from '@/components/search/EmptyState';
import type { FilterFormValues } from '@/components/search/SearchFilters';

const DEFAULT_LIMIT = 20;

export function SearchPage() {
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState<FilterFormValues>({});
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const { data, isLoading, error } = usePeopleList({
    ...filterValues,
    page,
    limit: DEFAULT_LIMIT,
  });

  const activeFilterCount = Object.values(filterValues).filter(
    (value) => value && value.trim() !== ''
  ).length;

  const hasActiveFilters = activeFilterCount > 0;

  const handleApplyFilters = (filters: FilterFormValues) => {
    setFilterValues(filters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Buscar Pessoas</h1>
        </div>

        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <p className="text-lg text-destructive mb-4">
            Erro ao carregar dados. Por favor, tente novamente.
          </p>
          <Button onClick={() => window.location.reload()}>Recarregar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Buscar Pessoas</h1>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsFilterSheetOpen(true)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : data && data.data.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.data.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalItems={data.total}
            itemsPerPage={DEFAULT_LIMIT}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <EmptyState
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      <FilterSheet
        open={isFilterSheetOpen}
        onOpenChange={setIsFilterSheetOpen}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        initialValues={filterValues}
      />
    </div>
  );
}
