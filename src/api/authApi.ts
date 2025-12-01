//src/api/authApi.ts

import apiClient from "./apiClient";

export const authApi = {
  // ───────────────────────────────
  // SIGNUP
  // ───────────────────────────────
  signUp: async (data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => {
    const res = await apiClient.post("/auth/signup", data);
    return res.data;
  },

  // ───────────────────────────────
  // SIGNIN
  // ───────────────────────────────
  signIn: async (data: {
    email: string;
    password: string;
  }) => {
    const res = await apiClient.post("/auth/login", data);
    return res.data; // deve conter token, user etc.
  },

  // ───────────────────────────────
  // VERIFICAR E-MAIL
  // ───────────────────────────────
  verifyEmail: async (token: string) => {
    const res = await apiClient.get(`/auth/verify-email/${token}`);
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post("/auth/forgot-password", { email });
    return res.data;
  }
};