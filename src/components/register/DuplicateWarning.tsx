import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DuplicateWarningProps {
  message: string;
}

export function DuplicateWarning({ message }: DuplicateWarningProps) {
  return (
    <Badge variant="outline" className="border-yellow-600 bg-yellow-950 text-yellow-200">
      <AlertTriangle className="mr-1 h-3 w-3" />
      {message}
    </Badge>
  );
}
