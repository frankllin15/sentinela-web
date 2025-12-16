import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/format.utils';
import type { Person } from '@/types/person.types';

interface AuditInfoProps {
  person: Person;
}

export function AuditInfo({ person }: AuditInfoProps) {
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="text-sm text-muted-foreground space-y-2">
          <div>
            <span className="font-medium">Cadastrado em:</span>{' '}
            {formatDate(person.createdAt)}
          </div>
          {person.updatedAt && person.updatedAt !== person.createdAt && (
            <div>
              <span className="font-medium">Última edição:</span>{' '}
              {formatDate(person.updatedAt)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
