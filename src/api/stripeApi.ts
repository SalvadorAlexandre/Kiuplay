// src/api/stripeApi.ts
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