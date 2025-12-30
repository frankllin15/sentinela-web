import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import type { FaceSearchResult } from '@/types/common.types';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

interface FaceSearchResultsProps {
  results: FaceSearchResult[];
  isLoading: boolean;
  error: Error | null;
  threshold: number;
  onClearSearch: () => void;
}

function FaceSearchResultCardComponent({ result }: { result: FaceSearchResult }) {
  const navigate = useNavigate();
  const { person, similarity, facePhotoUrl } = result;

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleClick = () => {
    navigate(ROUTES.PEOPLE_DETAIL.replace(':id', person.id.toString()));
  };

  const similarityPercent = Math.round(similarity * 100);

  const getSimilarityBadgeVariant = (percent: number): "default" | "secondary" | "destructive" => {
    if (percent >= 70) return "default"; // Verde (high confidence)
    if (percent >= 50) return "secondary"; // Amarelo/cinza (medium confidence)
    return "secondary"; // Cinza (low confidence)
  };

  const getSimilarityColor = (percent: number): string => {
    if (percent >= 70) return "text-green-600 dark:text-green-400";
    if (percent >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-muted-foreground";
  };

  return (
    <Card
      className="hover:border-primary transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 shrink-0 rounded-2xl">
            {facePhotoUrl && <AvatarImage src={facePhotoUrl} alt={person.fullName} />}
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {getInitials(person.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{person.fullName}</h3>

            {person.nickname && (
              <p className="text-sm text-muted-foreground truncate">
                Vulgo: {person.nickname}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              <Badge
                variant={getSimilarityBadgeVariant(similarityPercent)}
                className={cn("flex items-center gap-1", getSimilarityColor(similarityPercent))}
              >
                <Sparkles className="h-3 w-3" />
                {similarityPercent}% match
              </Badge>

              {person.warrantStatus && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Mandado
                </Badge>
              )}

              {person.isConfidential && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Confidencial
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const FaceSearchResultCard = memo(FaceSearchResultCardComponent);

export function FaceSearchResults({
  results,
  isLoading,
  error,
  threshold,
  onClearSearch,
}: FaceSearchResultsProps) {
  if (isLoading) {
    return <LoadingState count={6} />;
  }

  if (error) {
    return (
      <LoadingState
        error={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        title="Nenhum resultado encontrado"
        description={
          threshold >= 0.7
            ? "Nenhuma pessoa encontrada com essa sensibilidade. Tente usar 'Similar' ou 'Ampla' para mais resultados."
            : "Não encontramos nenhuma pessoa com essa foto. Tente outra imagem ou ajuste a sensibilidade."
        }
        onClearFilters={onClearSearch}
        hasActiveFilters
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
        </p>
        <Button variant="outline" size="sm" onClick={onClearSearch}>
          Nova Busca
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((result) => (
          <FaceSearchResultCard key={result.person.id} result={result} />
        ))}
      </div>
    </div>
  );
}
