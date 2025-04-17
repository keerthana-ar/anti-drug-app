export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export type UserRole = 'admin' | 'authority' | 'user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 