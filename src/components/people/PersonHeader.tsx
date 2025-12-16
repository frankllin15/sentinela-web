import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Person } from '@/types/person.types';

interface PersonHeaderProps {
  person: Person;
}

export function PersonHeader({ person }: PersonHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-14 md:top-16 z-40 bg-background border-b border-border py-4 mb-6 -mx-4 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/home')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{person.fullName}</h1>
            {person.nickname && (
              <p className="text-muted-foreground mt-1">
                Vulgo: {person.nickname}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/app/people/${person.id}/edit`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </div>

        {(person.isConfidential || person.warrantStatus) && (
          <div className="flex gap-2 mt-3">
            {person.isConfidential && (
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                Sigiloso
              </Badge>
            )}
            {person.warrantStatus && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Mandado de Prisão
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
