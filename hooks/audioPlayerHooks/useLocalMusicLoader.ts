///hooks/audioPlayerHooks/useLocalMusicLoader';
import { useState, useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';

export interface Music {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
  title?: string;
  artist?: string;
  cover?: string;
}

export default function useLocalMusicPicker() {
  const [musics, setMusics] = useState<Music[]>([]);

  const pickMusics = useCallback(async (): Promise<Music[]> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return []; // <- Retorna array vazio

      const selected = result.assets.map(asset => ({
        uri: asset.uri,
        name: asset.name,
        size: asset.size,
      }));

      setMusics(selected);
      return selected; // <- RETORNO CORRIGIDO
    } catch (error) {
      console.error('Erro ao selecionar músicas:', error);
      return []; // <- Em caso de erro, retorna array vazio também
    }
  }, []);

  return {
    musics,
    pickMusics,
  };
}