import { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadButtonProps {
  value: File | null;
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
  accept = 'image/*',
  capture = true,
  existingImageUrl,
  onRemoveExisting,
}: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        capture={capture ? 'environment' : undefined}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          onChange(file || null);
        }}
      />

      {/* Show preview of new file */}
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={label}
            className="w-full h-48 object-cover rounded-md border"
          />
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
              <RefreshCw className="mr-2 h-4 w-4" />
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
