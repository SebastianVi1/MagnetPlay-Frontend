import axios from "axios";
import type { User } from "../models/auth";

const baseUri: string = "http://localhost:8080";

export function loginUser(credentials: { username: string; password: string }) {
  return axios.post<{ user: User; token: string }>(
    baseUri + "/api/auth/login",
    credentials
  );
}

export function logoutUser() {
  return axios.post(baseUri + "/api/auth/logout");
}
