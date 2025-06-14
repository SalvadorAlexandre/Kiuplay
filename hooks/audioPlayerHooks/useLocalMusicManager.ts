// hooks/useLocalMusic.ts
import { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Music = {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
};

const STORAGE_KEY = 'kiuplay_selected_musics';

export default function useLocalMusic() {
  const [selectedMusics, setSelectedMusics] = useState<Music[]>([]);

  useEffect(() => {
    // Ao iniciar, recupera os metadados salvos
    const loadMusics = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSelectedMusics(JSON.parse(saved));
      }
    };
    loadMusics();
  }, []);

  const handleSelectMusics = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
        multiple: true,
        copyToCacheDirectory: false,
      });

      if (!result?.assets || result.canceled) return;

      const musics: Music[] = result.assets.map(asset => ({
        uri: asset.uri,
        name: asset.name,
        size: asset.size,
        mimeType: asset.mimeType,
      }));

      setSelectedMusics(musics);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(musics));
    } catch (error) {
      console.error('Erro ao selecionar músicas:', error);
    }
  };

  return {
    selectedMusics,
    handleSelectMusics,
  };
}