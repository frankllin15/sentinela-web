import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForceList } from '@/hooks/queries/useForceQueries';

const filterSchema = z.object({
  forceId: z.string().optional(),
  isActive: z.string().optional(),
});

export type UserFilterFormValues = z.infer<typeof filterSchema>;

interface UserFiltersProps {
  onApply: (filters: UserFilterFormValues) => void;
  onClear: () => void;
  initialValues?: UserFilterFormValues;
}

export function UserFilters({
  onApply,
  onClear,
  initialValues,
}: UserFiltersProps) {
  const { data: forces } = useForceList();

  const form = useForm<UserFilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: initialValues || {
      forceId: '',
      isActive: '',
    },
  });

  const handleSubmit = (data: UserFilterFormValues) => {
    onApply(data);
  };

  const handleClear = () => {
    form.reset({
      forceId: '',
      isActive: '',
    });
    onClear();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="forceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Força Policial</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as forças" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">Todas as forças</SelectItem>
                  {forces?.map((force) => (
                    <SelectItem key={force.id} value={force.id.toString()}>
                      {force.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status do Usuário</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">Todos os status</SelectItem>
                  <SelectItem value="true">Ativos</SelectItem>
                  <SelectItem value="false">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            Aplicar Filtros
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="flex-1"
          >
            Limpar
          </Button>
        </div>
      </form>
    </Form>
  );
}
