import React, {
  createContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import {
  loginUser,
  logoutUser,
  signUpUser,
} from "../service/UserService";
import {
  type AuthState,
  type AuthAction,
  initialAuthState,
  type LoginCredentials,
  type RegisterCredentials,
} from "../models/auth";

import { useNavigate } from "react-router-dom";
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

// what context contain
type AuthContextType = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: RegisterCredentials) => Promise<void>;
  isAuthenticated: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const navigate = useNavigate();
  // Load user from localStorage on initialization
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        });
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
      }
    }
  }, []);

  function isAuthenticated(): boolean {
    return !!(state.user && state.token);
  }

  async function signIn(credentials: LoginCredentials) {
    try {
      dispatch({ type: "LOGIN_START" });

      const { user, token, refreshToken } = await loginUser(credentials);

      const normalizedUser = {
        id: user.id,
        username: user.username,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: normalizedUser, token },
      });
      navigate("/");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      dispatch({ type: "LOGIN_ERROR", payload: errorMessage });
      throw error; //rethrow so the component can handle it
    }
  }

  async function signOut() {
    try {
      logoutUser();
    } catch {
      /* ignore logout errors */
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  }

  async function signUp(credentials: RegisterCredentials) {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await signUpUser(credentials); // { user, token, refreshToken }
      const { user, token, refreshToken } = response;
      console.log(user);
      if (!token || typeof token !== "string") {
        throw new Error("Invalid token received from server");
      }
      const normalizedUser = {
        id: user.id,
        username: user.username,
      };
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: normalizedUser, token },
      });
      navigate("/");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      console.log(errorMessage);
      dispatch({ type: "LOGIN_ERROR", payload: errorMessage });
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{ state, dispatch, signIn, signOut, signUp, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

