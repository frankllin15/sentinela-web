import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePeopleList } from "@/hooks/queries/usePeopleQueries";
import { PersonCard } from "@/components/search/PersonCard";
import { FilterSheet } from "@/components/search/FilterSheet";
import { Pagination } from "@/components/search/Pagination";
import { LoadingState } from "@/components/search/LoadingState";
import { EmptyState } from "@/components/search/EmptyState";
import type { FilterFormValues } from "@/components/search/SearchFilters";
import { PageHeader } from "@/components/layout/PageHeader";

const DEFAULT_LIMIT = 20;

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Ler filtros e página da URL
  const page = Number(searchParams.get("page")) || 1;
  const isConfidentialParam = searchParams.get("isConfidential");
  const filterValues: FilterFormValues = {
    fullName: searchParams.get("fullName") || '',
    nickname: searchParams.get("nickname") || '',
    cpf: searchParams.get("cpf") || '',
    motherName: searchParams.get("motherName") || '',
    fatherName: searchParams.get("fatherName") || '',
    isConfidential: isConfidentialParam === 'true' ? true : isConfidentialParam === 'false' ? false : undefined,
  };

  const { data, isLoading, error, refetch } = usePeopleList({
    ...filterValues,
    page,
    limit: DEFAULT_LIMIT,
  });

  const activeFilterCount = Object.entries(filterValues).filter(
    ([key, value]) => {
      if (key === 'isConfidential') return value !== undefined;
      return typeof value === 'string' && value.trim() !== '';
    }
  ).length;

  const hasActiveFilters = activeFilterCount > 0;

  const handleApplyFilters = (filters: FilterFormValues) => {
    const newParams = new URLSearchParams();

    // Adicionar filtros na URL (apenas valores não vazios)
    Object.entries(filters).forEach(([key, value]) => {
      if (value && typeof value === "string" && value.trim() !== "") {
        newParams.set(key, value);
      } else if (typeof value === "boolean") {
        newParams.set(key, value.toString());
      }
    });

    // Reset para página 1
    newParams.set("page", "1");

    setSearchParams(newParams);

    // Força uma nova consulta mesmo que os filtros sejam iguais
    setTimeout(() => refetch(), 0);
  };

  const handleClearFilters = () => {
    setSearchParams({ page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Buscar Indivíduos</h1>
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
    <div className="max-w-6xl mx-auto pb-8 space-y-6">
      <PageHeader
        title="Buscar Indivíduos"
        icon={Search}
        breadcrumbs={[
          { label: "Início", href: "/app/home", icon: Home },
          { label: "Buscar" },
        ]}
        actions={
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
        }
      />

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
