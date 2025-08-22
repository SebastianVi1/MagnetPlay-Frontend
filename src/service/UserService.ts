import axios from "axios";
import type { User, LoginCredentials, RegisterCredentials, LoginResponse, RegisterResponse, BackendLoginResponse } from "../models/auth";

const baseUri: string = "/api";

//interceptor to include jwt token in future requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Handle errors of the expired token.
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function loginUser(credentials: LoginCredentials): Promise<BackendLoginResponse> {
  return axios.post<BackendLoginResponse>(
    baseUri + "/auth/login",
    credentials
  ).then((response) => {
    console.log("user logged in");
    
    const {user, token} = response.data;
    
    if (!token || typeof token !== 'string') {
      throw new Error("Invalid token received from server");
    }
    
    return token; // Return just the token
  }).catch((err: unknown) => {
    console.error("Login error:", err);
    throw new Error("Bad credentials");
  });
}

export function signUpUser(credentials: RegisterCredentials): Promise<RegisterResponse> {
  return axios.post<RegisterResponse>(
    baseUri + "/auth/register", 
    credentials
  ).then((response) => {
    console.log("user registered");
    return response.data;
  }).catch((err: unknown) => {
    console.error("Registration error:", err);
    throw new Error("Registration failed");
  });
}

export function logoutUser() {
  return axios.post(baseUri + "/auth/logout");
}
