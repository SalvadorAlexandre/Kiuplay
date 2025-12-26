//src/api/userApi.ts
import apiClient from "./apiClient";

// Interface para manter o padrão profissional
interface UserResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const userApi = {
  /**
   * GET /auth/me → retorna os dados do usuário logado
   * Essencial para o carregamento inicial do perfil e verificação de token.
   */
  getMe: async (): Promise<UserResponse> => {
    try {
      const res = await apiClient.get("/auth/me");

      // Se o backend já retorna o objeto com success: true, apenas repassamos
      // Caso contrário, garantimos que o objeto tenha o campo success
      return {
        success: res.data?.success ?? true,
        data: res.data?.data ?? res.data
      };
    } catch (error: any) {
      console.error("Erro ao buscar dados do usuário (getMe):", error);

      return {
        success: false,
        error: error.response?.data?.error || "Sessão expirada ou erro de conexão.",
      };
    }
  }
};


{/**
  
import apiClient from "./apiClient";

export const userApi = {
  // GET /auth/me → retorna os dados do usuário logado
  getMe: async () => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  }
};
  */}

