import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { UserFilters, type UserFilterFormValues } from './UserFilters';

interface UserFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: UserFilterFormValues) => void;
  onClear: () => void;
  initialValues?: UserFilterFormValues;
}

export function UserFilterSheet({
  open,
  onOpenChange,
  onApply,
  onClear,
  initialValues,
}: UserFilterSheetProps) {
  const handleApply = (filters: UserFilterFormValues) => {
    onApply(filters);
    onOpenChange(false);
  };

  const handleClear = () => {
    onClear();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md px-4">
        <SheetHeader>
          <SheetTitle>Filtros de Usuários</SheetTitle>
          <SheetDescription>
            Refine a listagem usando os filtros abaixo
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <UserFilters
            onApply={handleApply}
            onClear={handleClear}
            initialValues={initialValues}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
