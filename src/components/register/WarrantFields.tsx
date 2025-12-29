import { type Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadButton } from './FileUploadButton';
import type { RegisterPersonFormData } from '@/schemas/person.schema';

interface WarrantFieldsProps {
  control: Control<RegisterPersonFormData>;
}

export function WarrantFields({ control }: WarrantFieldsProps) {
  return (
    <div className="space-y-4 pl-6 border-l-2 border-yellow-600">
      <FormField
        control={control}
        name="warrantStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Detalhes do Mandado</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva os detalhes do mandado de prisão..."
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="warrantFile"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <FormLabel>Arquivo do Mandado (PDF)</FormLabel>
            <FormControl>
              <FileUploadButton
                value={value || null}
                onChange={onChange}
                label="Upload do PDF do Mandado"
                accept="application/pdf,image/*"
                capture={false}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
