import { type User, UserRole } from './auth.types';

export type { User };

export interface UserSearchFilters {
  forceId?: number;
  isActive?: boolean;
  page: number;
  limit: number;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  role: UserRole;
  forceId?: number;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  role?: UserRole;
  forceId?: number;
  isActive?: boolean;
}
