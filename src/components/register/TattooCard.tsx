import { useMemo, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TattooCardProps {
  // Alterado para aceitar File OU string (URL)
  photo: File | string;
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
  // Deriva o preview diretamente de photo sem estado extra
  const preview = useMemo(() => {
    // Caso 1: Se for uma string (URL do backend/R2)
    if (typeof photo === "string") {
      return photo;
    }

    // Caso 2: Se for um File (Upload novo do usuário)
    if (photo instanceof File) {
      return URL.createObjectURL(photo);
    }

    return null;
  }, [photo]);

  // Cleanup do object URL quando o componente desmontar ou photo mudar
  useEffect(() => {
    if (photo instanceof File && preview) {
      return () => URL.revokeObjectURL(preview);
    }
  }, [photo, preview]);

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
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
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
