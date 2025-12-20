import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Person } from '@/types/person.types';
import { ROUTES } from '@/constants/routes';

interface PersonCardProps {
  person: Person;
}

function PersonCardComponent({ person }: PersonCardProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleClick = () => {
    navigate(ROUTES.PEOPLE_DETAIL.replace(':id', person.id.toString()));
  };

  return (
    <Card
      className="hover:border-primary transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 flex-shrink-0">
            {person.facePhotoUrl && <AvatarImage src={person.facePhotoUrl} alt={person.fullName} />}
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

export const PersonCard = memo(PersonCardComponent);
