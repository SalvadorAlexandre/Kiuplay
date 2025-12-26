// src/api/stripeApi.ts
import apiClient from "./apiClient";

// Interface unificada para respostas do Stripe
export interface StripeSetupResponse {
  success: boolean;
  clientSecret?: string;
  publishableKey?: string;
  error?: string;
}

// ---------------------------
// SEPA
// ---------------------------
export async function createSepaSetupIntent(): Promise<StripeSetupResponse> {
  try {
    const response = await apiClient.post("/payments/setup-sepa");
    // Se o backend retornar direto o objeto com as chaves, espalhamos ele com success: true
    return {
      success: true,
      ...response.data
    };
  } catch (error: any) {
    console.error("Erro ao criar SetupIntent SEPA:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Não foi possível iniciar a configuração SEPA."
    };
  }
}

// ---------------------------
// CARTÃO GLOBAL (Visa, Amex, MasterCard)
// ---------------------------
export const stripeApi = {
  fetchGlobalCardSetup: async (): Promise<StripeSetupResponse> => {
    try {
      const response = await apiClient.post('/payments/setup-card');
      return {
        success: true,
        ...response.data
      };
    } catch (error: any) {
      console.error('Erro ao buscar SetupIntent do cartão global:', error);
      // Alteramos de 'throw' para o retorno amigável para manter o padrão das outras APIs
      return {
        success: false,
        error: error.response?.data?.error || 'Falha ao carregar configuração do cartão global'
      };
    }
  },
};





{/**
  import apiClient from "./apiClient";

// ---------------------------
// SEPA
// ---------------------------
export interface SetupIntentResponse {
  clientSecret: string;
  publishableKey: string;
}

export async function createSepaSetupIntent(): Promise<SetupIntentResponse> {
  const response = await apiClient.post<SetupIntentResponse>("/payments/setup-sepa");
  return response.data;
}


// ---------------------------
// CARTÃO GLOBAL (Visa, Amex, MasterCard)
// ---------------------------
export interface GlobalCardSetupResponse {
  clientSecret: string;
  publishableKey: string;
}

export const stripeApi = {
  fetchGlobalCardSetup: async (): Promise<GlobalCardSetupResponse> => {
    try {
      const response = await apiClient.post<GlobalCardSetupResponse>('/payments/setup-card');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar SetupIntent do cartão global:', error);
      throw new Error(error?.message || 'Falha ao carregar cartão global');
    }
  },
};
  */}