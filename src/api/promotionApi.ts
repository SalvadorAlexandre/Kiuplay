// src/api/promotionApi.ts
import apiClient from "./apiClient";

export async function createPromotion(data: any) {
  // Ajustado para bater com app.use('/promotions-content') + router.post('/create')
  const response = await apiClient.post("/promotions-content/create", data);
  return response.data;
}

export async function deletePromotion(id: string) {
  // Ajustado para bater com router.delete('/delete/:id')
  const response = await apiClient.delete(`/promotions-content/delete/${id}`);
  return response.data;
}