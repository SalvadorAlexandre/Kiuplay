// contexts/AudioPlayerContext.tsx
// Contexto para gerenciar o estado do player de áudio
// Importações necessárias

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';

// 🎵 Tipo da música que será usada no player
export type Music = {
  uri: string | number;
  name: string;
  coverUri?: string;
  size?: number; 
  mimeType?: string;
};

// 🎧 Interface com todas as funções e estados disponíveis no contexto
interface AudioPlayerContextProps {
  playlist: Music[];
  setPlaylist: (musics: Music[]) => void;
  setPlaylistAndReset: (newPlaylist: Music[]) => Promise<void>; // ✅ Adicione esta linha
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  currentTrack: Music | null;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  toggleExpanded: () => void;
  playNext: () => void;
  playPrevious: () => void;
  loadAndPlay: (source: string | number, cover?: string) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  stop: () => Promise<void>;
  isPlaying: boolean;
  status: AVPlaybackStatus | null;
  seek: (milliseconds: number) => Promise<void>;
  coverUri: string | null;

  // 🎶 Novos estados e funções para músicas locais
  selectedMusics: Music[];
  handleSelectMusics: () => Promise<void>;
}

const AudioPlayerContext = createContext<AudioPlayerContextProps | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlist, setPlaylist] = useState<Music[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [selectedMusics, setSelectedMusics] = useState<Music[]>([]);
  const soundRef = useRef<Audio.Sound | null>(null);

  const currentTrack = playlist[currentIndex] || null;

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setStatus(status);
  };

  const loadAndPlay = async (source: string | number, cover?: string) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current.setOnPlaybackStatusUpdate(null);
      soundRef.current = null;
    }

    const { sound, status } = await Audio.Sound.createAsync(
      typeof source === 'string' ? { uri: source } : source,
      { shouldPlay: true },
      onPlaybackStatusUpdate
    );

    soundRef.current = sound;
    setStatus(status);
    setIsPlaying(true);
    setCoverUri(cover ?? null);
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    const status = await soundRef.current.getStatusAsync();
    if (status.isLoaded) {
      if (status.isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const stop = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current.setOnPlaybackStatusUpdate(null);
      soundRef.current = null;
      setIsPlaying(false);
    }
  };

  const setPlaylistAndReset = async (newPlaylist: Music[]) => {
    await stop(); // Para qualquer faixa anterior
    setPlaylist(newPlaylist);
    setCurrentIndex(-1); // Nenhuma faixa selecionada
  };

  const seek = async (milliseconds: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(milliseconds);
    }
  };

  const playNext = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  // 🔁 Carrega e toca a faixa atual quando muda o índice
  useEffect(() => {
    let isMounted = true;
    if (
      playlist.length === 0 ||
      currentIndex < 0 ||
      currentIndex >= playlist.length ||
      !playlist[currentIndex]?.uri
    ) {
      return;
    }
    const playCurrent = async () => {
      const track = playlist[currentIndex];
      if (isMounted) {
        await loadAndPlay(track.uri, track.coverUri);
      }
    };
    playCurrent();
    return () => {
      isMounted = false;
    };
  }, [currentIndex, playlist]);

  // 🎵 Função para selecionar músicas locais e armazenar no estado global
  const handleSelectMusics = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const musics: Music[] = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.name || 'Sem nome',
          size: asset.size,
          coverUri: undefined,
        }));

        setSelectedMusics(musics);
      }
    } catch (error) {
      console.error('Erro ao selecionar músicas:', error);
    }
  };

  const contextValue = useMemo(() => ({
    playlist,
    setPlaylist,
    setPlaylistAndReset,
    currentIndex,
    setCurrentIndex,
    currentTrack,
    isExpanded,
    setIsExpanded,
    toggleExpanded,
    playNext,
    playPrevious,
    loadAndPlay,
    togglePlayPause,
    stop,
    isPlaying,
    status,
    seek,
    coverUri,
    selectedMusics,
    handleSelectMusics,
  }), [
    playlist,
    currentIndex,
    currentTrack,
    isExpanded,
    coverUri,
    isPlaying,
    status,
    selectedMusics,
  ]);

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayerContext must be used within an AudioPlayerProvider');
  }
  return context;
};