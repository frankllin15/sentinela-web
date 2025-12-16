import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata um CPF para o padrão brasileiro: 123.456.789-00
 * @param cpf - CPF sem formatação (apenas números)
 * @returns CPF formatado
 */
export function formatCPF(cpf: string): string {
  if (!cpf) return '';

  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '');

  // Aplica a máscara
  if (cleaned.length !== 11) return cpf;

  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata uma data ISO para o formato brasileiro com hora
 * @param dateString - Data no formato ISO
 * @returns Data formatada: "15/03/2024 às 14:30"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return dateString;
  }
}

/**
 * Formata coordenadas geográficas
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Coordenadas formatadas: "-15.793889, -47.882778"
 */
export function formatCoordinates(lat: number, lng: number): string {
  if (!lat || !lng) return '';

  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

/**
 * Cria um link do Google Maps com as coordenadas
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns URL do Google Maps
 */
export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
