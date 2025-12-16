import { Card, CardContent } from '@/components/ui/card';

interface TattooViewCardProps {
  imageUrl: string;
  location: string;
  description?: string;
  onClick: () => void;
}

export function TattooViewCard({
  imageUrl,
  location,
  description,
  onClick,
}: TattooViewCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={imageUrl}
            alt={`Tatuagem - ${location}`}
            className="w-24 h-24 object-cover rounded-md border"
          />
          <div className="flex-1">
            <h4 className="font-medium">{location}</h4>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
