import type { User } from 'firebase/auth';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface AuthActions {
  signIn: (email: string, senha: string) => Promise<void>;
  signUp: (email: string, senha: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export type AuthContextType = AuthState & AuthActions;