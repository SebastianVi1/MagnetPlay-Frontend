export type User = {
  id: number;
  username: string;
  email: string;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterCredentials = {
  username: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};

export type RegisterResponse = {
  user: User;
  message: string;
};

export type BackendLoginResponse = string; // Just the JWT token

export type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

export type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" };

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};
