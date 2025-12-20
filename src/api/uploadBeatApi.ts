
import apiClient from './apiClient';

/**
 * Upload de Beat Exclusivo com progresso real
 */
export const uploadExclusiveBeat = async (
  formData: FormData,
  onProgress?: (percent: number) => void
) => {
  const response = await apiClient.post(
    '/upload-beats/upload-exclusive-beat',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // 🔹 Captura o evento de upload do Axios
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

/**
 * Upload de Beat Gratuito com progresso real
 */
export const uploadFreeBeat = async (
  formData: FormData,
  onProgress?: (percent: number) => void
) => {
  const response = await apiClient.post(
    '/upload-beats/upload-free-beat',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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