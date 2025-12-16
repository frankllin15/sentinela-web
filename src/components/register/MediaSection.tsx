import { useState } from 'react';
import { type Control, useFieldArray } from 'react-hook-form';
import { Plus } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FileUploadButton } from './FileUploadButton';
import { TattooCard } from './TattooCard';
import { TattooDialog } from './TattooDialog';
import type { RegisterPersonFormData } from '@/schemas/person.schema';
import type { Media } from '@/types/media.types';

interface MediaSectionProps {
  control: Control<RegisterPersonFormData>;
  existingFacePhoto?: Media;
  existingBodyPhoto?: Media;
}

export function MediaSection({ control, existingFacePhoto, existingBodyPhoto }: MediaSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'tattoos',
  });

  const handleSaveTattoo = (data: { photo: File; location: string; description?: string }) => {
    if (editingIndex !== null) {
      update(editingIndex, data);
      setEditingIndex(null);
    } else {
      append(data);
    }
  };

  const handleEditTattoo = (index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
  };

  const handleCloseTattooDialog = () => {
    setDialogOpen(false);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">
          Seção A: Evidências (Mídia)
        </h2>
        <p className="text-sm text-muted-foreground">
          Fotos e identificação visual do indivíduo
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="facePhoto"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Foto de Rosto</FormLabel>
              <FormControl>
                <FileUploadButton
                  value={value}
                  onChange={onChange}
                  label="Tirar Foto do Rosto"
                  existingImageUrl={existingFacePhoto?.url}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="fullBodyPhoto"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Foto de Corpo Inteiro</FormLabel>
              <FormControl>
                <FileUploadButton
                  value={value}
                  onChange={onChange}
                  label="Tirar Foto de Corpo Inteiro"
                  existingImageUrl={existingBodyPhoto?.url}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Tatuagens</h3>
            <p className="text-sm text-muted-foreground">
              Adicione fotos de tatuagens para identificação
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Tatuagem
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-md">
            <p>Nenhuma tatuagem adicionada</p>
            <p className="text-sm mt-1">Clique no botão acima para adicionar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <TattooCard
                key={field.id}
                photo={field.photo}
                location={field.location}
                description={field.description}
                onEdit={() => handleEditTattoo(index)}
                onRemove={() => remove(index)}
              />
            ))}
          </div>
        )}
      </div>

      <TattooDialog
        open={dialogOpen}
        onClose={handleCloseTattooDialog}
        onSave={handleSaveTattoo}
        initialData={editingIndex !== null ? fields[editingIndex] : undefined}
      />
    </div>
  );
}
