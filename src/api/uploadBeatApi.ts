import apiClient from './apiClient';

/**
 * Upload de Beat Exclusivo
 */
export const uploadExclusiveBeat = async (formData: FormData) => {
  const response = await apiClient.post(
    '/upload-beats/upload-exclusive-beat',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

/**
 * Upload de Beat Gratuito
 */
export const uploadFreeBeat = async (formData: FormData) => {
  const response = await apiClient.post(
    '/upload-beats/upload-free-beat',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};