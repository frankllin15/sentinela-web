import { useRef, useMemo, useEffect } from "react";
import { Camera, X, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadButtonProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  label: string;
  accept?: string;
  capture?: boolean;
  existingImageUrl?: string;
  onRemoveExisting?: () => void;
}

export function FileUploadButton({
  value,
  onChange,
  label,
  accept = "image/*",
  capture = true,
  existingImageUrl,
  onRemoveExisting,
}: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const isImage = useMemo(() => {
    if (value instanceof File) return value.type.startsWith("image/");
    if (typeof value === "string") return value.match(/\.(jpeg|jpg|gif|png)$/i);
    return false;
  }, [value]);

  // Deriva o preview diretamente de value sem estado extra
  const preview = useMemo(() => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    } else if (typeof value === "string") {
      return value;
    }
    return null;
  }, [value]);

  // Cleanup do object URL quando o componente desmontar ou value mudar
  useEffect(() => {
    if (value instanceof File && preview) {
      return () => URL.revokeObjectURL(preview);
    }
  }, [value, preview]);

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        capture={capture ? "environment" : undefined}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          onChange(file || null);
        }}
      />

      {/* Show preview of new file */}
      {preview ? (
        <div className="relative">
          {isImage ? (
            <img
              src={preview}
              alt={label}
              className="w-full h-48 object-cover rounded-md border"
            />
          ) : (
            /* Renderização para PDF ou outros documentos */
            <div className="w-full h-48 flex flex-col items-center justify-center bg-muted rounded-md border">
              <FileText className="h-12 w-12 text-muted-foreground" />
              <span className="mt-2 text-sm font-medium">
                {value instanceof File ? value.name : "Documento Selecionado"}
              </span>
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => onChange(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : existingImageUrl ? (
        /* Show existing image with option to change */
        <div className="space-y-2">
          <div className="relative">
            <img
              src={existingImageUrl}
              alt={label}
              className="w-full h-48 object-cover rounded-md border"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => inputRef.current?.click()}
            >
              <RefreshCw className="h-4 w-4" />
              Alterar Foto
            </Button>
            {onRemoveExisting && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={onRemoveExisting}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Show upload button */
        <Button
          type="button"
          variant="outline"
          className="w-full h-48 border-dashed"
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="mr-2 h-5 w-5" />
          {label}
        </Button>
      )}
    </div>
  );
}
