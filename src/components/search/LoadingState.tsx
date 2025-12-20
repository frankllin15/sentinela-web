import { Card, CardContent } from '@/components/ui/card';

export function LoadingState() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-muted animate-pulse flex-shrink-0" />

              <div className="flex-1 space-y-2">
                <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                <div className="flex gap-2 mt-2">
                  <div className="h-5 bg-muted rounded animate-pulse w-16" />
                  <div className="h-5 bg-muted rounded animate-pulse w-20" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
