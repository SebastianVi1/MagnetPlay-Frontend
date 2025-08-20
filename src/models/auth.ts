export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
};
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
