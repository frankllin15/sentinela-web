import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PhotoModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export function PhotoModal({ open, onClose, imageUrl, title }: PhotoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-[70vh] object-contain rounded-md"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
