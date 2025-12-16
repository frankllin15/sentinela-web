import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TattooViewCard } from './TattooViewCard';
import { PhotoModal } from './PhotoModal';
import type { Media } from '@/types/media.types';
import { MediaType } from '@/types/media.types';

interface PersonGalleryTabProps {
  medias: Media[];
}

export function PersonGalleryTab({ medias }: PersonGalleryTabProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string } | null>(null);

  const facePhoto = medias.find((m) => m.type === MediaType.FACE);
  const bodyPhoto = medias.find((m) => m.type === MediaType.FULL_BODY);
  const tattoos = medias.filter((m) => m.type === MediaType.TATTOO);

  const hasPrimaryPhotos = facePhoto || bodyPhoto;

  return (
    <div className="space-y-6">
      {/* Fotos Principais */}
      {hasPrimaryPhotos && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Fotos Principais</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {facePhoto && (
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedPhoto({ url: facePhoto.url, title: 'Foto de Rosto' })}
              >
                <CardContent className="p-4">
                  <img
                    src={facePhoto.url}
                    alt="Foto de Rosto"
                    className="w-full aspect-square object-cover rounded-md border"
                  />
                  <p className="text-center text-sm font-medium mt-2">Rosto</p>
                </CardContent>
              </Card>
            )}

            {bodyPhoto && (
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedPhoto({ url: bodyPhoto.url, title: 'Foto de Corpo Inteiro' })}
              >
                <CardContent className="p-4">
                  <img
                    src={bodyPhoto.url}
                    alt="Foto de Corpo Inteiro"
                    className="w-full aspect-square object-cover rounded-md border"
                  />
                  <p className="text-center text-sm font-medium mt-2">Corpo Inteiro</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Tatuagens */}
      {tattoos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Tatuagens</h3>
          <div className="space-y-3">
            {tattoos.map((tattoo) => (
              <TattooViewCard
                key={tattoo.id}
                imageUrl={tattoo.url}
                location={tattoo.label || 'Não especificado'}
                description={tattoo.description}
                onClick={() =>
                  setSelectedPhoto({
                    url: tattoo.url,
                    title: `Tatuagem - ${tattoo.label || 'Não especificado'}`,
                  })
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Mensagem se não houver fotos */}
      {!hasPrimaryPhotos && tattoos.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma foto cadastrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Este registro não possui fotos ou tatuagens cadastradas.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal de visualização */}
      {selectedPhoto && (
        <PhotoModal
          open={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          imageUrl={selectedPhoto.url}
          title={selectedPhoto.title}
        />
      )}
    </div>
  );
}
