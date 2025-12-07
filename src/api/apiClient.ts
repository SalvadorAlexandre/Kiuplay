// src/api/apiClient.ts
import axios from 'axios';
import { tokenStorage } from '@/src/utils/tokenStorage';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://localhost:3000"; // ajuste para seu backend

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 40000,
  headers: {
    "Content-Type": "application/json"
  }
});

// ---- INTERCEPTOR DE REQUISIÇÃO ----
apiClient.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// ---- INTERCEPTOR DE RESPOSTA ----
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // Exemplo: se receber 401 → logout automático depois
    return Promise.reject(err);
  }
);

export default apiClient;