// src/api/uploadContentApi.ts
import apiClient from './apiClient';

/**
 * Upload de Single
 */

export const uploadSingle = async (
  formData: FormData, 
  onProgress?: (percent: number) => void // Callback opcional
) => {
  const response = await apiClient.post(
    '/releases/upload-single',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // 🔹 Esta é a chave para o progresso real:
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    }
  );

  return response.data;
};



{/**export const uploadSingle = async (formData: FormData) => {
  const response = await apiClient.post(
    '/releases/upload-single',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};


import apiClient from './apiClient'; */}