import { useEffect } from 'react';
import { type Control, type UseFormSetValue, useWatch } from 'react-hook-form';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { WarrantFields } from './WarrantFields';
import { useGeolocation } from '@/hooks/useGeolocation';
import type { RegisterPersonFormData } from '@/schemas/person.schema';

interface LocationLegalSectionProps {
  control: Control<RegisterPersonFormData>;
  setValue: UseFormSetValue<RegisterPersonFormData>;
}

export function LocationLegalSection({ control, setValue }: LocationLegalSectionProps) {
  const { capture, loading, error, coords } = useGeolocation();
  const hasWarrant = useWatch({ control, name: 'hasWarrant' });

  useEffect(() => {
    if (coords) {
      setValue('latitude', coords.latitude);
      setValue('longitude', coords.longitude);
    }
  }, [coords, setValue]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">
          Seção C: Localização e Informações Legais
        </h2>
        <p className="text-sm text-muted-foreground">
          Endereço, geolocalização e status legal
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={control}
          name="addressPrimary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço Principal</FormLabel>
              <FormControl>
                <Input
                  placeholder="Rua, número, bairro"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="addressSecondary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input
                  placeholder="Apartamento, bloco, referência"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <FormLabel>Geolocalização (GPS) *</FormLabel>
              <FormDescription>
                Capture a localização atual do dispositivo
              </FormDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={capture}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Capturando...
                </>
              ) : coords ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  GPS Capturado
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Capturar GPS
                </>
              )}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {coords && (
            <div className="text-xs text-muted-foreground bg-card p-2 rounded border">
              Lat: {coords.latitude.toFixed(6)}, Long: {coords.longitude.toFixed(6)}
            </div>
          )}

          <FormField
            control={control}
            name="latitude"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="longitude"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="hasWarrant"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border bg-card p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="cursor-pointer">
                  Possui Mandado de Prisão?
                </FormLabel>
                <FormDescription>
                  Marque se o indivíduo possui mandado de prisão em aberto
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {hasWarrant && <WarrantFields control={control} />}

        <FormField
          control={control}
          name="isConfidential"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border bg-card p-4">
              <div className="space-y-0.5">
                <FormLabel>Registro Sigiloso</FormLabel>
                <FormDescription>
                  Registro visível apenas para gestores e administradores
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informações adicionais relevantes..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
