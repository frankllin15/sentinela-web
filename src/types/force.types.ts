export interface Force {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateForceDto {
  name: string;
}

export interface UpdateForceDto {
  name?: string;
}
