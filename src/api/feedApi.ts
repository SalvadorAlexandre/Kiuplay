// src/api/feedApi.ts

import apiClient from './apiClient';
import { BeatStoreFeedItem } from '@/src/types/contentType';
import { LibraryFeedItem } from '@/src/types/contentType';

export const getBeatById = async (id: string): Promise<BeatStoreFeedItem> => {
  const response = await apiClient.get(`/feed/get-beat/${id}`); // Ajuste a rota conforme sua API
  return response.data.data;
}; 

export const getBeatStoreFeed = async (page = 1, limit = 20): Promise<{ data: BeatStoreFeedItem[], total: number }> => {
  const response = await apiClient.get(`/feed/beatstore?page=${page}&limit=${limit}`);

  // Extraímos os dados e o total que está dentro de pagination
  return {
    data: response.data.data,
    total: response.data.pagination.total // Caminho correto conforme o teu log do Insomnia
  };
};

// Feed da Library
export const getLibraryFeed = async (page = 1, limit = 20): Promise<{ data: LibraryFeedItem[], total: number }> => {
  const response = await apiClient.get(`/feed/library?page=${page}&limit=${limit}`);
  return response.data; // já contém { data, total }
};