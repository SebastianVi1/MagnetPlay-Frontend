import axios from "axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  RegisterResponse,
  BackendLoginResponse,
} from "../models/auth";
import { useNavigate } from "react-router-dom";
const baseUri: string = "/api";

// Create a separate axios instance for validation calls to avoid interceptor loops
const validationAxios = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Configure axios defaults for better debugging
axios.defaults.timeout = 10000;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = false; // Disable credentials for cross-origin requests

//interceptor to include jwt token in future requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//Handle errors of the expired token.
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only handle 401 errors (unauthorized) - not validation errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      //TODO: ADD REFRESH TOKEN

      // Check if this is a validation request to avoid clearing session unnecessarily
      if (error.config?.url?.includes("/auth/validate")) {
        return Promise.reject(error);
      }
      
      // Check if this is a refresh request to avoid infinite loops
      if (error.config?.url?.includes("/auth/refresh")) {
        logoutUser();
        window.location.href = "/login";
        return Promise.reject(error);
      }
      
      // Only handle API requests (not frontend routes)
      if (error.config?.url?.startsWith("/api")) {
        // Handle token refresh asynchronously
        return handleTokenRefresh(error);
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to handle token refresh
async function handleTokenRefresh(error: any) {
  const existingRefreshToken = localStorage.getItem("refreshToken");
  const existingAccesToken = localStorage.getItem("token");
  
  if (!existingRefreshToken) {
    console.log("❌ No refresh token found, logging out");
    logoutUser();
    window.location.href = "/login";
    return Promise.reject(error);
  }

  // Check if access token is still valid first
  if (existingAccesToken) {
    try {
      const isValid = await validateAccesToken(existingAccesToken);
      if (isValid) {
        // Access token is still valid, retry the original request
        error.config.headers.Authorization = `Bearer ${existingAccesToken}`;
        console.log("✅ Access token still valid, retrying request");
        return axios.request(error.config);
      }
    } catch (validationError) {
      console.log("⚠️ Error validating access token:", validationError);
      // Continue to refresh token
    }
  }

  // Try to refresh the token
  try {
    console.log("🔄 Attempting to refresh token...");
    
    const refreshResponse = await validateRefreshToken(existingRefreshToken);
    console.log("🔄 Refresh response:", refreshResponse);
    
    if (refreshResponse && refreshResponse.token) {
      // Store new tokens
      localStorage.setItem("token", refreshResponse.token);
      if (refreshResponse.refreshToken) {
        localStorage.setItem("refreshToken", refreshResponse.refreshToken);
      }
      
      // Retry the original request with new token
      error.config.headers.Authorization = `Bearer ${refreshResponse.token}`;
      return axios.request(error.config);
    } else {
      // Refresh failed, logout user
      logoutUser();
      window.location.href = "/login";
      return Promise.reject(error);
    }
  } catch (refreshError) {
    // Refresh token is invalid, logout user
    logoutUser();
    window.location.href = "/login";
    return Promise.reject(error);
  }
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<BackendLoginResponse> {
  try {
    const { data } = await axios.post<BackendLoginResponse>(
      baseUri + "/auth/login",
      credentials
    );
    const { token } = data;
    if (!token || typeof token !== "string") {
      throw new Error("Invalid token received from server");
    }
    return data; // { user, token }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data: unknown = err.response?.data;
      const backendMessage =
        typeof data === "object" && data !== null && "message" in data
          ? (data as { message: string }).message
          : undefined;

      console.log(`Login failed with status: ${status}`);
      console.log(`Backend message: ${backendMessage}`);

      if (status === 401) {
        throw new Error(backendMessage || "Invalid username or password");
      }
      if (status === 400) {
        throw new Error(backendMessage || "Invalid login data");
      }
      if (status === 403) {
        throw new Error(backendMessage || "Access denied");
      }
      if (status === 500) {
        throw new Error(
          backendMessage || "Internal server error - contact administrator"
        );
      }
    }
    console.error("Login error:", err);
    throw new Error("Login failed - unknown error");
  }
}

export async function signUpUser(
  credentials: RegisterCredentials
): Promise<RegisterResponse> {
  try {
    const { data } = await axios.post<RegisterResponse>(
      baseUri + "/auth/register",
      credentials
    );
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data: unknown = err.response?.data;
      const backendMessage =
        typeof data === "object" && data !== null && "message" in data
          ? (data as { message: string }).message
          : undefined;

      console.log(`Registration failed with status: ${status}`);
      console.log(`Backend message: ${backendMessage}`);

      if (status === 409) {
        throw new Error(backendMessage || "Username or email already exists");
      }
      if (status === 400) {
        throw new Error(backendMessage || "Invalid registration data");
      }
      if (status === 403) {
        throw new Error(
          backendMessage ||
            "Not allowed to register - check backend configuration"
        );
      }
      if (status === 500) {
        throw new Error(
          backendMessage || "Internal server error - contact administrator"
        );
      }
    }
    console.error("Registration error:", err);
    throw new Error("Registration failed - unknown error");
  }
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

export async function validateAccesToken(token: string): Promise<boolean> {
  try {
    const response = await validationAxios.post<{ isValid: boolean }>("/auth/validate", token);
    return response.data.isValid;
  } catch (err) {
    console.log("Problem occurred: " + err);
    return false;
  }
}

export async function getFavoriteMovies(userId: number) {
  try {
    const response = await axios.get(baseUri + `/user/${userId}/favorites`);
    return response.data;
  } catch (err) {
    console.log("Failed to fetch favorite movies:", err);
    throw err;
  }
}

export async function validateRefreshToken(
  refreshToken: string
): Promise<BackendLoginResponse | null> {
  try {
    const res = await axios.post<BackendLoginResponse>(
      baseUri + "/auth/refresh",
      refreshToken 
    );
    
    console.log("✅ Refresh token response received:", res.data);
    return res.data;
  } catch (err) {
    console.log("validateRefreshToken failed:", err);
    return null;
  }
}

