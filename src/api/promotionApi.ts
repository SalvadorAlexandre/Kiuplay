// src/api/promotionApi.ts
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