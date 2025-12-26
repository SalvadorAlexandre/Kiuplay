// src/api/uploadContentApi.ts
import apiClient from './apiClient';

// Interface padrão para facilitar a gestão no Front-end
interface ReleaseResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * 🎵 Upload de Single Individual
 */
export const uploadSingle = async (
  formData: FormData,
  onProgress?: (percent: number) => void
): Promise<ReleaseResponse> => {
  try {
    const response = await apiClient.post('/releases/upload-single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || "Erro ao subir Single." };
  }
};




/**
 * 💿 Gerenciamento de EP
 */

export const startEPDraft = async (formData: FormData): Promise<ReleaseResponse> => {
  try {
    const response = await apiClient.post('/releases/upload-ep', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || "Erro ao iniciar rascunho de EP." };
  }
};

export const addTrackToEP = async (epId: string, formData: FormData, onProgress?: (p: number) => void): Promise<ReleaseResponse> => {
  try {
    const response = await apiClient.post(`/releases/ep/${epId}/add-track`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || "Erro ao adicionar faixa ao EP." };
  }
};

export const finalizeEP = async (epId: string): Promise<ReleaseResponse> => {
  try {
    const response = await apiClient.patch(`/releases/finalize-ep/${epId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || "Erro ao finalizar EP." };
  }
};

export const abortEP = async (epId: string): Promise<ReleaseResponse> => {
  try {
    const response = await apiClient.delete(`/releases/abort-ep/${epId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: "Erro ao abortar lançamento de EP." };
  }
};

export const getPendingEP = async (): Promise<ReleaseResponse> => {
  try {
    const response = await apiClient.get('/releases/pending-ep');
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: "Erro ao buscar EP pendente." };
  }
};




/**
 * Gerenciamento de ÁLBUM
 */

export const startAlbumDraft = async (formData: FormData): Promise<ReleaseResponse> => {
  try {
    const response = await apiClient.post('/releases/upload-album', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || "Erro ao iniciar álbum." };
  }
};

export const addTrackToAlbum = async (albumId: string, formData: FormData, onProgress?: (p: number) => void): Promise<ReleaseResponse> => {
  try {
    const response = await apiClient.post(`/releases/album/${albumId}/add-track`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || "Erro ao subir faixa do álbum." };
  }
};

export const finalizeAlbum = async (albumId: string): Promise<ReleaseResponse> => {
  try {
    const response = await apiClient.patch(`/releases/finalize-album/${albumId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: "Erro ao finalizar lançamento do álbum." };
  }
};

export const abortAlbum = async (albumId: string): Promise<ReleaseResponse> => {
  try {
    const response = await apiClient.delete(`/releases/abort-album/${albumId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: "Erro ao cancelar álbum." };
  }
};

export const getPendingAlbum = async (): Promise<ReleaseResponse> => {
  try {
    const response = await apiClient.get('/releases/pending-album');
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: "Não foi possível recuperar álbuns pendentes." };
  }
};




{/**
import apiClient from './apiClient';
 * Upload de Single Individual
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
 * 💿 Gerenciamento de EP (Rascunho, Faixas e Finalização)
// Iniciar ou Recuperar Rascunho do EP (Capa + Título)
export const startEPDraft = async (formData: FormData) => {
  const response = await apiClient.post('/releases/upload-ep', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
// Adicionar uma faixa ao EP
export const addTrackToEP = async (epId: string, formData: FormData, onProgress?: (p: number) => void) => {
  const response = await apiClient.post(`/releases/ep/${epId}/add-track`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      }
    },
  });
  return response.data;
};

// Finalizar EP (Tornar Público)
export const finalizeEP = async (epId: string) => {
  const response = await apiClient.patch(`/releases/finalize-ep/${epId}`);
  return response.data;
};

// Abortar EP (Apagar tudo)
export const abortEP = async (epId: string) => {
  const response = await apiClient.delete(`/releases/abort-ep/${epId}`);
  return response.data;
};

// Busca rascunho de EP pendente
export const getPendingEP = async () => {
  const response = await apiClient.get('/releases/pending-ep');
  return response.data;
};

 * 🎹 Gerenciamento de ÁLBUM
export const startAlbumDraft = async (formData: FormData) => {
  const response = await apiClient.post('/releases/upload-album', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const addTrackToAlbum = async (albumId: string, formData: FormData, onProgress?: (p: number) => void) => {
  const response = await apiClient.post(`/releases/album/${albumId}/add-track`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      }
    },
  });
  return response.data;
};

export const finalizeAlbum = async (albumId: string) => {
  const response = await apiClient.patch(`/releases/finalize-album/${albumId}`);
  return response.data;
};

export const abortAlbum = async (albumId: string) => {
  const response = await apiClient.delete(`/releases/abort-album/${albumId}`);
  return response.data;
};

// Busca rascunho de ÁLBUM pendente
export const getPendingAlbum = async () => {
  const response = await apiClient.get('/releases/pending-album');
  return response.data;
};
*/}

















