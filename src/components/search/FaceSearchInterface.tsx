import { useState, useRef, useMemo, useEffect } from "react";
import { Camera, Search as SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { FaceSearchFilters } from "@/types/common.types";
import { cn } from "@/lib/utils";

interface FaceSearchInterfaceProps {
  onSearchSubmit: (params: FaceSearchFilters) => void;
}

const THRESHOLD_PRESETS = [
  { value: 0.5, label: "Ampla" },
  { value: 0.7, label: "Similar" },
  { value: 0.9, label: "Exata" },
] as const;

export function FaceSearchInterface({ onSearchSubmit }: FaceSearchInterfaceProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [threshold, setThreshold] = useState(0.7);
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = useMemo(() => {
    if (selectedImage) {
      return URL.createObjectURL(selectedImage);
    }
    return null;
  }, [selectedImage]);

  useEffect(() => {
    if (selectedImage && preview) {
      return () => URL.revokeObjectURL(preview);
    }
  }, [selectedImage, preview]);

  const handleSearch = () => {
    if (!selectedImage) {
      toast.error("Selecione uma foto para buscar");
      return;
    }

    // Envia o arquivo diretamente para a API com ID único
    onSearchSubmit({
      image: selectedImage,
      threshold,
      limit: 20,
      searchId: `${Date.now()}-${Math.random()}`, // ID único para cada busca
    });
  };

  const handleClear = () => {
    setSelectedImage(null);
    setThreshold(0.5);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Buscar por Reconhecimento Facial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setSelectedImage(file || null);
          }}
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Foto para busca"
              className="w-full h-64 object-cover rounded-md border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full h-64 border-dashed"
            onClick={() => inputRef.current?.click()}
          >
            <Camera className="mr-2 h-6 w-6" />
            <span className="text-lg">Capturar ou Selecionar Foto</span>
          </Button>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Sensibilidade da Busca</label>
          <div className="grid grid-cols-3 gap-2">
            {THRESHOLD_PRESETS.map((preset) => (
              <Button
                key={preset.value}
                type="button"
                variant="outline"
                className={cn(
                  "h-12",
                  threshold === preset.value && "bg-primary ring-1 ring-inset ring-primary hover:bg-primary/90 hover:text-primary-foreground"
                )}
                onClick={() => setThreshold(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Ampla: mais resultados, menos precisão | Exata: menos resultados, mais precisão
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            className="flex-1 h-12"
            onClick={handleSearch}
            disabled={!selectedImage}
          >
            <SearchIcon className="mr-2 h-5 w-5" />
            Buscar
          </Button>

          {selectedImage && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="h-12"
            >
              Limpar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
