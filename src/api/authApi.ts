//src/api/authApi.ts



import apiClient from "./apiClient";

// Interface para manter a consistência do erro amigável
interface AuthResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export const authApi = {
  // ───────────────────────────────
  // SIGNUP
  // ───────────────────────────────
  signUp: async (data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post("/auth/signup", data);
      return res.data;
    } catch (error: any) {
      console.error("Erro no SignUp:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Erro ao criar conta. Verifique sua conexão.",
      };
    }
  },

  // ───────────────────────────────
  // SIGNIN
  // ───────────────────────────────
  signIn: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post("/auth/login", data);
      return res.data;
    } catch (error: any) {
      console.error("Erro no SignIn:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Falha no login. Verifique seus dados ou a conexão.",
      };
    }
  },

  // ───────────────────────────────
  // VERIFICAR E-MAIL
  // ───────────────────────────────
  verifyEmail: async (token: string): Promise<AuthResponse> => {
    try {
      const res = await apiClient.get(`/auth/verify-email/${token}`);
      return res.data;
    } catch (error: any) {
      return {
        success: false,
        error: "Token inválido ou expirado.",
      };
    }
  },

  // ───────────────────────────────
  // ESQUECI A SENHA
  // ───────────────────────────────
  forgotPassword: async (email: string): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post("/auth/forgot-password", { email });
      return res.data;
    } catch (error: any) {
      return {
        success: false,
        error: "Não foi possível enviar o e-mail de recuperação.",
      };
    }
  }
};




{/** 
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
  */}

