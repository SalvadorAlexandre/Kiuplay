
import apiClient from './apiClient';

// Interface para manter o padrão de resposta
interface UploadResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Upload de Beat Exclusivo com tratamento de erro e progresso
 */
export const uploadExclusiveBeat = async (
  formData: FormData,
  onProgress?: (percent: number) => void
): Promise<UploadResponse> => {
  try {
    const response = await apiClient.post(
      '/upload-beats/upload-exclusive-beat',
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

    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error("Erro no upload de beat exclusivo:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Falha no upload. Verifique sua conexão ou o tamanho do arquivo."
    };
  }
};

/**
 * Upload de Beat Gratuito com tratamento de erro e progresso
 */
export const uploadFreeBeat = async (
  formData: FormData,
  onProgress?: (percent: number) => void
): Promise<UploadResponse> => {
  try {
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

    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error("Erro no upload de beat gratuito:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Não foi possível concluir o upload do beat gratuito."
    };
  }
};



{/**
  import apiClient from './apiClient';


 * Upload de Beat Exclusivo com progresso real

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


 * Upload de Beat Gratuito com progresso real

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
  */}