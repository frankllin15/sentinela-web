import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TattooCardProps {
  photo: File;
  location: string;
  description?: string;
  onEdit: () => void;
  onRemove: () => void;
}

export function TattooCard({
  photo,
  location,
  description,
  onEdit,
  onRemove,
}: TattooCardProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {preview && (
            <img
              src={preview}
              alt={location}
              className="w-24 h-24 object-cover rounded-md border"
            />
          )}
          <div className="flex-1">
            <h4 className="font-semibold">{location}</h4>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <Edit className="h-3 w-3 mr-1" />
                Editar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onRemove}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Remover
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
