import { useState, useCallback } from 'react';

interface UseGeolocationReturn {
  capture: () => void;
  loading: boolean;
  error: string | null;
  coords: { latitude: number; longitude: number } | null;
}

export function useGeolocation(): UseGeolocationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const capture = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo navegador');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setError('Não foi possível capturar a localização');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { capture, loading, error, coords };
}
