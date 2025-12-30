import { Search, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchModeToggleProps {
  mode: 'text' | 'face';
  onModeChange: (mode: 'text' | 'face') => void;
}

export function SearchModeToggle({ mode, onModeChange }: SearchModeToggleProps) {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg">
      <Button
        variant="ghost"
        className={cn(
          "flex-1 h-12 gap-2",
          mode === 'text' && "bg-background shadow-sm hover:bg-background"
        )}
        onClick={() => onModeChange('text')}
      >
        <Search className="h-5 w-5" />
        <span className="font-medium">Busca Textual</span>
      </Button>

      <Button
        variant="ghost"
        className={cn(
          "flex-1 h-12 gap-2",
          mode === 'face' && "bg-background shadow-sm hover:bg-background"
        )}
        onClick={() => onModeChange('face')}
      >
        <ScanLine className="h-5 w-5" />
        <span className="font-medium">Busca por Face</span>
      </Button>
    </div>
  );
}
