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
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';

const filterSchema = z.object({
  fullName: z.string().optional(),
  nickname: z.string().optional(),
  cpf: z.string().optional(),
  motherName: z.string().optional(),
  fatherName: z.string().optional(),
  isConfidential: z.boolean().optional(),
  //filtro de meus registros
  isMyRecords: z.boolean().optional(),
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
    defaultValues: {
      fullName: '',
      nickname: '',
      cpf: '',
      motherName: '',
      fatherName: '',
      isConfidential: false,
      isMyRecords: false,
      ...initialValues,
    },
  });

  const handleClear = () => {
    form.reset({
      fullName: '',
      nickname: '',
      cpf: '',
      motherName: '',
      fatherName: '',
      isConfidential: false,
      isMyRecords: false,
    });
    onClear();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
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

        <FormField
          control={form.control}
          name="fatherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Pai</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do pai" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isConfidential"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Confidencial</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Exibir apenas registros confidenciais
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isMyRecords"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Meus Registros</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Exibir apenas registros criados por mim
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        </div>

        <div className="flex gap-2 pt-4 border-t bg-background sticky bottom-0 mt-4 pb-2">
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
