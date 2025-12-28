//src/api/userApi.ts
import apiClient from "./apiClient";

export const userApi = {
  // GET /auth/me → retorna os dados do usuário logado
  getMe: async () => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  }


  
};

export const getMyContentPaginated = async (
  type: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    // Note a URL batendo com o que registramos no server.ts
    const response = await apiClient.get(`/user-content/my-profile-items`, {
      params: { type, page, limit }
    });
    return response.data; // { success, data, pagination }
  } catch (error) {
    console.error("Erro ao buscar conteúdo paginado", error);
    return { success: false, data: [], pagination: { totalPages: 0 } };
  }
};