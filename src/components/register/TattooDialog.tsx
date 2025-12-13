import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUploadButton } from './FileUploadButton';

interface TattooDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { photo: File; location: string; description?: string }) => void;
  initialData?: { photo: File; location: string; description?: string };
}

export function TattooDialog({
  open,
  onClose,
  onSave,
  initialData,
}: TattooDialogProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setPhoto(initialData.photo);
      setLocation(initialData.location);
      setDescription(initialData.description || '');
    } else {
      setPhoto(null);
      setLocation('');
      setDescription('');
    }
  }, [initialData, open]);

  const handleSave = () => {
    if (!photo || !location) return;

    onSave({
      photo,
      location,
      description: description || undefined,
    });

    setPhoto(null);
    setLocation('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Tatuagem' : 'Adicionar Tatuagem'}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da tatuagem.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tattoo-photo">
              Foto da Tatuagem
            </Label>
            <FileUploadButton
              value={photo}
              onChange={setPhoto}
              label="Tirar Foto da Tatuagem"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tattoo-location">
              Local do Corpo
            </Label>
            <Input
              id="tattoo-location"
              placeholder="Ex: Braço direito"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tattoo-description">
              Descrição (Opcional)
            </Label>
            <Textarea
              id="tattoo-description"
              placeholder="Descreva a tatuagem..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!photo || !location}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
