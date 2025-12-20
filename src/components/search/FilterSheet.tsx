import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { SearchFilters, type FilterFormValues } from './SearchFilters';

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: FilterFormValues) => void;
  onClear: () => void;
  initialValues?: FilterFormValues;
}

export function FilterSheet({
  open,
  onOpenChange,
  onApply,
  onClear,
  initialValues,
}: FilterSheetProps) {
  const handleApply = (filters: FilterFormValues) => {
    onApply(filters);
    onOpenChange(false);
  };

  const handleClear = () => {
    onClear();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filtros de Busca</SheetTitle>
          <SheetDescription>
            Refine sua busca usando os filtros abaixo
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <SearchFilters
            onApply={handleApply}
            onClear={handleClear}
            initialValues={initialValues}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
