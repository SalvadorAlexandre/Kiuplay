// Importa hooks do React e os módulos de áudio do Expo AV
import { useEffect, useState, useRef } from 'react';
import { Audio } from 'expo-av';
// A linha abaixo está incorreta pois AVPlaybackStatus não é um membro exportado diretamente
// import { AVPlaybackStatus } from 'expo-av'; 
// Correto: você pode usar o tipo `AVPlaybackStatus` diretamente do namespace `Audio`
import type { AVPlaybackStatus } from 'expo-av';

// Hook customizado para controle de reprodução de áudio
export const useAudioPlayer = () => {
  // Estado que indica se o áudio está tocando
  const [isPlaying, setIsPlaying] = useState(false);

  // Guarda a instância atual do som
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Guarda o status atual do som (posição, se está tocando, etc.)
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);

  // Função para carregar e tocar um áudio a partir de uma URI
  const loadAndPlay = async (uri: string) => {
    // Se já existe um som carregado, descarrega-o
    if (sound) {
      await sound.unloadAsync();
    }

    // Cria uma nova instância de som e inicia a reprodução automaticamente
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );

    // Salva a nova instância no estado
    setSound(newSound);
    setIsPlaying(true);

    // Atualiza o status de reprodução sempre que algo muda (play, pause, etc.)
    newSound.setOnPlaybackStatusUpdate((status) => {
      setStatus(status);
    });
  };

  // Alterna entre play e pause
  const togglePlayPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  // Para a reprodução do áudio atual
  const stop = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  // Retorna as funções e estados para serem usados em componentes
  return {
    loadAndPlay,
    togglePlayPause,
    stop,
    isPlaying,
    status,
  };
};