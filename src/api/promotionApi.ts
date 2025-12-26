// src/api/promotionApi.ts
import apiClient from "./apiClient";

// Interface para garantir a tipagem da resposta
interface PromotionResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function createPromotion(data: any): Promise<PromotionResponse> {
  try {
    const response = await apiClient.post("/promotions-content/create", data);
    // Retorna o objeto de sucesso vindo do backend
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar promoção:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Erro ao processar a promoção. Verifique sua conexão.",
    };
  }
}

export async function deletePromotion(id: string): Promise<PromotionResponse> {
  try {
    const response = await apiClient.delete(`/promotions-content/delete/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao eliminar promoção:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Não foi possível eliminar a promoção.",
    };
  }
}

export async function getMyPromotions(): Promise<PromotionResponse> {
  try {
    const response = await apiClient.get("/promotions-content/get-my-promotions");
    return response.data;
  } catch (error: any) {
    console.error("Erro ao carregar minhas promoções:", error);
    return {
      success: false,
      data: [], // Retornamos array vazio para não quebrar listas no front
      error: "Falha ao carregar a lista de promoções.",
    };
  }
}



{/**
  import apiClient from "./apiClient";

export async function createPromotion(data: any) {
  const response = await apiClient.post("/promotions-content/create", data);
  return response.data;
}

export async function deletePromotion(id: string) {
  const response = await apiClient.delete(`/promotions-content/delete/${id}`);
  return response.data;
}

export async function getMyPromotions() {
  const response = await apiClient.get("/promotions-content/get-my-promotions");
  return response.data;
}
  
  */}