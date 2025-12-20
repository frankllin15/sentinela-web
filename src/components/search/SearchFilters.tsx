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
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

const filterSchema = z.object({
  fullName: z.string().optional(),
  nickname: z.string().optional(),
  cpf: z.string().optional(),
  motherName: z.string().optional(),
});

export type FilterFormValues = z.infer<typeof filterSchema>;

interface SearchFiltersProps {
  onApply: (filters: FilterFormValues) => void;
  onClear: () => void;
  initialValues?: FilterFormValues;
}

export function SearchFilters({
  onApply,
  onClear,
  initialValues = {},
}: SearchFiltersProps) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: initialValues,
  });

  const handleClear = () => {
    form.reset({
      fullName: '',
      nickname: '',
      cpf: '',
      motherName: '',
    });
    onClear();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vulgo</FormLabel>
              <FormControl>
                <Input placeholder="Digite o vulgo" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  placeholder="000.000.000-00"
                  type="text"
                  inputMode="numeric"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="motherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Mãe</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome da mãe" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            Aplicar Filtros
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Limpar
          </Button>
        </div>
      </form>
    </Form>
  );
}
