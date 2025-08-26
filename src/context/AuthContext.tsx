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
  validateAccesToken,
  validateRefreshToken,
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const navigate = useNavigate();
  // Clear any existing tokens on initialization
  useEffect(() => {
    (async () => {
      const existingToken = localStorage.getItem("token");
      const existingUser = localStorage.getItem("user");
      if (existingToken && existingUser) {
        try {
          const user = JSON.parse(existingUser);
          const valid = await validateAccesToken(existingToken);
          console.log("validating token...");

          if (!valid) {
            console.log("Token expired, trying to refresh...");
            const existingRefreshToken = localStorage.getItem("refreshToken");

            if (existingRefreshToken) {
              try {
                // Backend returns User, Token and RefreshToken
                const refreshRes = await validateRefreshToken(
                  existingRefreshToken
                );

                if (
                  refreshRes &&
                  typeof refreshRes === "object" &&
                  refreshRes.token
                ) {
                  const newToken = refreshRes.token;
                  const newRefreshToken = refreshRes.refreshToken;
                  const refreshedUser = refreshRes.user ?? user;

                  localStorage.setItem("token", newToken);
                  if (newRefreshToken && typeof newRefreshToken === "string") {
                    localStorage.setItem("refreshToken", newRefreshToken);
                  }
                  // if backend return a new update credentials
                  localStorage.setItem("user", JSON.stringify(refreshedUser));

                  dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: { user: refreshedUser, token: newToken },
                  });
                  console.log("Token refreshed successfully.");
                  return;
                } else {
                  logoutUser();
                  dispatch({
                    type: "LOGIN_ERROR",
                    payload: "The refresh token is expired login again",
                  });
                  return;
                }
              } catch (refreshError) {
                console.log("Failed to refresh token", refreshError);
                // Fall through to logout
              }
            }

            dispatch({
              type: "LOGIN_ERROR",
              payload: "Expired or Invalid token",
            });
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("refreshToken");
            navigate("/login");
            return;
          }

          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user, token: existingToken },
          });
        } catch (err) {
          console.log(err);
        }
      }
      console.log("🔍 AuthProvider - Initialization complete");
    })();
  }, [navigate]);

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

export { AuthContext };
