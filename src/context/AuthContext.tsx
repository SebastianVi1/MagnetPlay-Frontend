import React, { createContext, useReducer, type ReactNode } from "react";
import { loginUser, logoutUser, signUpUser } from "../service/UserService";
import {
  type AuthState,
  type AuthAction,
  initialAuthState,
  type LoginCredentials,
  type RegisterCredentials,
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

// what context contain
type AuthContextType = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: RegisterCredentials) => Promise<void>;
  isAuthenticated: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Clear any existing tokens on initialization
  React.useEffect(() => {
    const existingToken = localStorage.getItem("token");
    const existingUser = localStorage.getItem("user");
    
    
    // Clear any existing data to start fresh
    if (existingToken || existingUser) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    
    console.log("🔍 AuthProvider - Initialization complete"); // Debug log
  }, []);

  function isAuthenticated(){
    if (state.user && state.token){
      return true
      
    }
    return false;
  }

  async function signIn(credentials: LoginCredentials) {
    dispatch({ type: "LOGIN_START" });
    try {
      console.log("hello");
      const response = await loginUser(credentials);
      
      const token = await loginUser(credentials);
      
      // Backend returns just the token, so we need to create user object
      if (!token || typeof token !== 'string') {
        throw new Error("Invalid token received from server");
      }
      
      //  Create user object from JWT token payload
      const user = {
        id: 0, // Will be extracted from token
        username: credentials.username, // Use credentials username
        email: "", // Will be empty for now
      };
      

      
      console.log("🔍 signIn - Storing token in localStorage"); // Debug log
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Verify token was stored
      const storedToken = localStorage.getItem("token");
      
      dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } });
      console.log("🔍 signIn - Login successful, state updated"); // Debug log
      
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

  
  async function signUp(credentials: RegisterCredentials) {
    try {
      // Call signUpUser service
      const response = await signUpUser(credentials);
      console.log("User registered successfully:", response);
      
      // Optionally auto-login after registration
      // Or redirect to login page
      
    } catch (error) {
      console.error("SignUp error:", error);
      throw error; // Re-throw to let component handle it
    }
  }

  return (
    <AuthContext.Provider value={{ state, dispatch, signIn, signOut, signUp, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext}
