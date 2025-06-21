// src/utils/audioManager.ts
import { Audio, AVPlaybackStatus, AVPlaybackStatusError, AVPlaybackStatusSuccess } from 'expo-av';

export type Music = {
  uri: string | number;
  name: string;
  title?: string;
  artist?: string;
  coverUri?: string;
  size?: number;
  mimeType?: string;
};

type PlaybackStatusCallback = (status: AVPlaybackStatus) => void;

class AudioManager {
  private sound: Audio.Sound | null;
  private playbackStatusUpdateCallback: PlaybackStatusCallback | null;
  private isSeeking: boolean;

  constructor() {
    this.sound = null;
    this.playbackStatusUpdateCallback = null;
    this.isSeeking = false;
  }

  public setPlaybackStatusUpdateCallback(callback: PlaybackStatusCallback): void {
    this.playbackStatusUpdateCallback = callback;
  }

  private _onPlaybackStatusUpdate = (status: AVPlaybackStatus): void => {
    if (this.playbackStatusUpdateCallback) {
      this.playbackStatusUpdateCallback(status);
    }
  };

  // ADICIONADO: Getter público para a instância do som
  public getSound(): Audio.Sound | null {
    return this.sound;
  }

  // ADICIONADO: Getter público para verificar se o som está carregado
  public async isSoundLoaded(): Promise<boolean> {
      if (this.sound) {
          const status = await this.sound.getStatusAsync();
          return 'isLoaded' in status && status.isLoaded;
      }
      return false;
  }

  public getIsSeeking(): boolean {
    return this.isSeeking;
  }

  public setSeeking(isSeeking: boolean): void {
    this.isSeeking = isSeeking;
  }

  public async loadAndPlay(track: Music, shouldPlay: boolean = true): Promise<void> {
    if (!track || !track.uri) {
      throw new Error("Track ou URI inválidos para carregar.");
    }

    if (this.sound) {
      try {
        await this.sound.unloadAsync();
        this.sound.setOnPlaybackStatusUpdate(null);
      } catch (error) {
        console.warn("Erro ao descarregar áudio anterior, mas prosseguindo:", error);
      }
    }

    console.log(`AudioManager: Carregando ${track.name || track.title} de ${track.uri}`);

    const { sound: newSound } = await Audio.Sound.createAsync(
      typeof track.uri === 'string' ? { uri: track.uri } : track.uri,
      { shouldPlay: shouldPlay, progressUpdateIntervalMillis: 500 },
      this._onPlaybackStatusUpdate
    );
    this.sound = newSound;

    if (shouldPlay) {
      await this.sound.playAsync();
    }
  }

  public async play(): Promise<void> {
    if (this.sound) {
      const status = await this.sound.getStatusAsync();
      if ('isLoaded' in status && status.isLoaded && !status.isPlaying) {
        await this.sound.playAsync();
      } else if (!('isLoaded' in status) || !status.isLoaded) {
        console.warn("AudioManager: Tentando play sem áudio carregado. Verifique a lógica de carregamento no Redux.");
      }
    }
  }

  public async pause(): Promise<void> {
    if (this.sound) {
      const status = await this.sound.getStatusAsync();
      if ('isLoaded' in status && status.isLoaded && status.isPlaying) {
        await this.sound.pauseAsync();
      }
    }
  }

  public async stop(): Promise<void> {
    if (this.sound) {
      const status = await this.sound.getStatusAsync();
      if ('isLoaded' in status && status.isLoaded) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      }
      this.sound = null;
    }
  }

  public async togglePlayPause(): Promise<boolean | null> {
    if (this.sound) {
      const status = await this.sound.getStatusAsync();
      if ('isLoaded' in status && status.isLoaded) {
        if (status.isPlaying) {
          await this.sound.pauseAsync();
        } else {
          await this.sound.playAsync();
        }
        return status.isPlaying;
      }
    }
    return null;
  }

  public async seekTo(positionMillis: number): Promise<void> {
    if (this.sound) {
      this.isSeeking = true;
      await this.sound.setPositionAsync(positionMillis);
    }
  }

  public async unload(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.unloadAsync();
        this.sound.setOnPlaybackStatusUpdate(null);
      } catch (error) {
        console.warn("Erro ao descarregar áudio no unload geral:", error);
      }
      this.sound = null;
    }
  }
}

let audioManagerInstance: AudioManager | null = null;
export const getAudioManager = (): AudioManager => {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager();
  }
  return audioManagerInstance;
};