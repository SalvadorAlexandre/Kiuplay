// src/api/feedApi.ts

import apiClient from './apiClient';
import { BeatStoreFeedItem } from '@/src/types/contentType';
import { LibraryFeedItem } from '@/src/types/contentType';

//export const getBeatById = async (id: string): Promise<BeatStoreFeedItem> => {
// const response = await apiClient.get(`/feed/get-beat/${id}`); // Ajuste a rota conforme sua API
// return response.data.data;
//};

export const getBeatById = async (id: string): Promise<{
  success: boolean;
  data: BeatStoreFeedItem | null;
  error?: string;
}> => {
  try {
    const response = await apiClient.get(`/feed/get-beat/${id}`);

    // Assumindo que o seu back-end retorna { success: true, data: { ...beat } }
    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Erro ao buscar beat por ID:", error);
    return {
      success: false,
      data: null,
      error: "Erro ao conectar com o servidor de beats."
    };
  }
};

export const getLibraryContentDetails = async (id: string): Promise<{
  success: boolean;
  data: LibraryFeedItem | null, //any; // Aqui será o Single, Artista, Album ou EP
  error?: string;
}> => {
  try {
    const response = await apiClient.get(`/feed/library/${id}`);

    // Retornamos exatamente o que vem do back-end (que já tem success e data)
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar detalhes ${id}:`, error);
    return {
      success: false,
      data: null,
      error: "Erro de conexão com o servidor."
    };
  }
};


export const getBeatStoreFeed = async (page = 1, limit = 20): Promise<{
  data: BeatStoreFeedItem[],
  total: number,
  totalPages: number,
  success: boolean,
  error?: string // Adicionamos como opcional para não quebrar nada
}> => {
  try {
    const response = await apiClient.get(`/feed/beatstore?page=${page}&limit=${limit}`);

    return {
      success: response.data.success ?? true,
      data: response.data.data ?? [],
      total: response.data.pagination?.total ?? 0,
      totalPages: response.data.pagination?.totalPages ?? 0
    };
  } catch (error) {
    console.error("Erro ao carregar BeatStore:", error);
    return {
      success: false,
      data: [],
      total: 0,
      totalPages: 0,
      error: "Não foi possível conectar à Beat Store."
    };
  }
};


export const getLibraryFeed = async (page = 1, limit = 20): Promise<{
  data: LibraryFeedItem[],
  total: number,
  totalPages: number,
  success: boolean,
  error?: string
}> => {
  try {
    const response = await apiClient.get(`/feed/library?page=${page}&limit=${limit}`);

    return {
      success: response.data.success ?? true,
      data: response.data.data ?? [],
      total: response.data.pagination?.total ?? 0,
      totalPages: response.data.pagination?.totalPages ?? 0
    };
  } catch (error) {
    console.error("Erro ao carregar Library:", error);
    return {
      success: false,
      data: [],
      total: 0,
      totalPages: 0,
      error: "Falha na conexão com a sua biblioteca."
    };
  }
};






/**
export const getBeatStoreFeed = async (page = 1, limit = 20): Promise<{
  data: BeatStoreFeedItem[],
  total: number,
  totalPages: number,
  success: boolean
}> => {
  const response = await apiClient.get(`/feed/beatstore?page=${page}&limit=${limit}`);

  // Usando o mesmo padrão visual do Library para manter a consistência
  return {
    success: response.data.success,
    data: response.data.data,
    total: response.data.pagination.total,
    totalPages: response.data.pagination.totalPages
  };
};


// Feed da Library - Ajustado para o padrão com pagination
export const getLibraryFeed = async (page = 1, limit = 20): Promise<{
  data: LibraryFeedItem[],
  total: number,
  totalPages: number,
  success: boolean
}> => {
  const response = await apiClient.get(`/feed/library?page=${page}&limit=${limit}`);

  // response.data é o objeto { success, data, pagination }
  return {
    success: response.data.success,
    data: response.data.data,
    total: response.data.pagination.total,
    totalPages: response.data.pagination.totalPages
  };
};
 */
// Altere a Promise para incluir totalPages

