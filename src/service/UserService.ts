import axios from "axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  RegisterResponse,
  BackendLoginResponse,
} from "../models/auth";
import { redirect } from "react-router-dom";

const baseUri: string = "/api";

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
    if (error.response?.status === 401) {
      // Check if this is a validation request to avoid clearing session unnecessarily
      if (error.config?.url?.includes("/auth/validate")) {
        return Promise.reject(error);
      }

      // Only redirect if not already on login page
      if (window.location.pathname !== "/login") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

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
  localStorage.clear();
}

export async function validateToken(token: string): Promise<boolean> {
  // Let the axios interceptor handle the Authorization header automatically
  // The token is already in localStorage, so the interceptor will add it
  await axios
    .post<{ isValid: boolean }>(baseUri + "/auth/validate", token)
    .then((res) => {
      if (!res.data.isValid) {
        logoutUser();
        return false;
      }
    })
    .catch((err) => {
      console.log("Problem occurred: " + err);
    })
    .finally(() => {
      console.log("token validated");
    });
  return true;
}
