import React, { createContext, useReducer, type ReactNode } from "react";
import { loginUser, logoutUser } from "../service/UserService";
import {
  type AuthState,
  type AuthAction,
  initialAuthState,
} from "../models/auth";

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case "LOGIN_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT":
      return { ...initialAuthState };
    default:
      return state;
  }
}

type AuthContextType = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  signIn: (credentials: {
    username: string;
    password: string;
  }) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  async function signIn(credentials: { username: string; password: string }) {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await loginUser(credentials);
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } });
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch({ type: "LOGIN_ERROR", payload: errorMessage });
    }
  }

  async function signOut() {
    try {
      await logoutUser();
    } catch {
      // handle logout error
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <AuthContext.Provider value={{ state, dispatch, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
