import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCPF, formatCoordinates } from '@/lib/format.utils';
import type { Person } from '@/types/person.types';

interface PersonDataTabProps {
  person: Person;
  onViewMap?: () => void;
}

export function PersonDataTab({ person, onViewMap }: PersonDataTabProps) {
  const hasIdentification = person.cpf || person.rg || person.voterId;
  const hasParents = person.motherName || person.fatherName;
  const hasAddress = person.addressPrimary || person.addressSecondary;
  const hasGPS = person.latitude !== 0 && person.longitude !== 0;

  return (
    <div className="space-y-4">
      {/* Identificação */}
      <Card>
        <CardHeader>
          <CardTitle>Identificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Nome Completo:</span>
            <p className="mt-1">{person.fullName}</p>
          </div>

          {person.nickname && (
            <div>
              <span className="text-sm font-medium text-muted-foreground">Vulgo:</span>
              <p className="mt-1">{person.nickname}</p>
            </div>
          )}

          {hasIdentification && (
            <>
              {person.cpf && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">CPF:</span>
                  <p className="mt-1">{formatCPF(person.cpf)}</p>
                </div>
              )}

              {person.rg && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">RG:</span>
                  <p className="mt-1">{person.rg}</p>
                </div>
              )}

              {person.voterId && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Título de Eleitor:</span>
                  <p className="mt-1">{person.voterId}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Filiação */}
      {hasParents && (
        <Card>
          <CardHeader>
            <CardTitle>Filiação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {person.motherName && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Nome da Mãe:</span>
                <p className="mt-1">{person.motherName}</p>
              </div>
            )}

            {person.fatherName && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Nome do Pai:</span>
                <p className="mt-1">{person.fatherName}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Endereço */}
      {hasAddress && (
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {person.addressPrimary && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Endereço Principal:</span>
                <p className="mt-1">{person.addressPrimary}</p>
              </div>
            )}

            {person.addressSecondary && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Complemento:</span>
                <p className="mt-1">{person.addressSecondary}</p>
              </div>
            )}

            {hasGPS && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Coordenadas GPS:</span>
                <div className="flex items-center gap-2 mt-1">
                  <p>{formatCoordinates(person.latitude, person.longitude)}</p>
                  {onViewMap && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={onViewMap}
                      className="h-auto p-0"
                    >
                      Ver no mapa
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status Legal */}
      {person.warrantStatus && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Status Legal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Mandado de Prisão:</span>
              <p className="mt-1">{person.warrantStatus}</p>
            </div>

            {person.warrantFileUrl && (
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="gap-2"
                >
                  <a href={person.warrantFileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Visualizar Documento
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Observações */}
      {person.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{person.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
