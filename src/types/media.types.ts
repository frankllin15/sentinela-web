export const MediaType = {
  FACE: 'FACE',
  FULL_BODY: 'FULL_BODY',
  TATTOO: 'TATTOO',
} as const;

export type MediaTypeValue = typeof MediaType[keyof typeof MediaType];

export interface Media {
  id: number;
  type: MediaTypeValue;
  url: string;
  label?: string;
  description?: string;
  personId: number;
  createdAt: string;
}

export interface CreateMediaDto {
  type: MediaTypeValue;
  url: string;
  label?: string;
  description?: string;
  personId: number;
}
