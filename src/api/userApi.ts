//src/api/userApi.ts
import apiClient from "./apiClient";

export const userApi = {
  // GET /auth/me → retorna os dados do usuário logado
  getMe: async () => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  }
};