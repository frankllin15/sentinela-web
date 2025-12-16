import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getGoogleMapsUrl, formatCoordinates } from '@/lib/format.utils';
import type { Person } from '@/types/person.types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface PersonMapTabProps {
  person: Person;
}

export function PersonMapTab({ person }: PersonMapTabProps) {
  const hasGPS = person.latitude !== 0 && person.longitude !== 0;

  if (!hasGPS) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Localização não disponível</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Este registro não possui coordenadas GPS cadastradas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mapa */}
      <Card>
        <CardContent className="p-0">
          <div className="h-96 w-full rounded-md overflow-hidden">
            <MapContainer
              center={[person.latitude, person.longitude]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[person.latitude, person.longitude]}>
                <Popup>{person.fullName}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Informações de Localização */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Localização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {person.addressPrimary && (
            <div>
              <span className="text-sm font-medium text-muted-foreground">Endereço:</span>
              <p className="mt-1">
                {person.addressPrimary}
                {person.addressSecondary && ` - ${person.addressSecondary}`}
              </p>
            </div>
          )}

          <div>
            <span className="text-sm font-medium text-muted-foreground">Coordenadas GPS:</span>
            <p className="mt-1">{formatCoordinates(person.latitude, person.longitude)}</p>
          </div>

          <div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-2"
            >
              <a
                href={getGoogleMapsUrl(person.latitude, person.longitude)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir no Google Maps
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
