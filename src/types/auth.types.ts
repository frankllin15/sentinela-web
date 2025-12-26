export const UserRole = {
  ADMIN_GERAL: "admin_geral",
  PONTO_FOCAL: "ponto_focal",
  GESTOR: "gestor",
  USUARIO: "usuario",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: number;
  email: string;
  name?: string;
  role: UserRole;
  forceId?: number;
  forceName?: string;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  initialize: () => Promise<void>;
}
