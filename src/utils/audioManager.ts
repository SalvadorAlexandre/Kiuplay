// src/utils/audioManager.ts
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Track } from '../redux/playerSlice'; // ajuste o caminho conforme necessário

type PlaybackStatusCallback = (status: AVPlaybackStatus) => void;

class AudioManager {
  private sound: Audio.Sound | null;
  private currentLoadedTrack: Track | null; // Adicionado para rastrear a música atualmente carregada
  private playbackStatusUpdateCallback: PlaybackStatusCallback | null;
  private isCurrentlyLoading: boolean = false;
  // private isSeeking: boolean; // Removido: gerenciado pelo Redux

  constructor() {
    this.sound = null;
    this.currentLoadedTrack = null;
    this.playbackStatusUpdateCallback = null;
    // this.isSeeking = false; // Removido
    this.configureAudioMode(); // Configura o modo de áudio na inicialização
  }

  // Configura o modo de áudio (chamado uma vez na inicialização)
  private async configureAudioMode() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        // interruptionModeAndroid: Audio.InterruptioNModeAndroid.DoNotDuck,
        //interruptionModeIOS: Audio.InterruptioNModeIOS.DoNotMixWithOthers,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error("AudioManager: Erro ao configurar modo de áudio:", error);
    }
  }

  /**
   * Define o callback que será chamado a cada atualização do status de reprodução.
   * @param callback A função de callback que receberá o status de reprodução.
   */
  public setPlaybackStatusUpdateCallback(callback: PlaybackStatusCallback | null): void {
    this.playbackStatusUpdateCallback = callback;
    // Se já existe um som carregado, atualiza o callback imediatamente para que ele comece a receber updates
    if (this.sound) {
      this.sound.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
    }
  }

  /**
   * Handler interno para as atualizações de status do expo-av.
   * Ele invoca o callback registrado externamente.
   * @param status O status de reprodução fornecido pelo expo-av.
   */
  private _onPlaybackStatusUpdate = (status: AVPlaybackStatus): void => {
    if (this.playbackStatusUpdateCallback) {
      this.playbackStatusUpdateCallback(status);
    }
  };

  /**
   * Retorna a instância atual do Audio.Sound.
   * @returns A instância de Audio.Sound ou null se nenhuma estiver carregada.
   */
  public getSound(): Audio.Sound | null {
    return this.sound;
  }

  /**
   * Retorna a Track que está atualmente carregada no AudioManager.
   * @returns A Track carregada ou null.
   */
  public getCurrentLoadedTrack(): Track | null {
    return this.currentLoadedTrack;
  }

  /**
   * Verifica se o som atual está carregado.
   * @returns Uma Promise que resolve para true se o som estiver carregado, false caso contrário.
   */
  public async isSoundLoaded(): Promise<boolean> {
    if (this.sound) {
      const status = await this.sound.getStatusAsync();
      return 'isLoaded' in status && status.isLoaded;
    }
    return false;
  }

  /**
   * Carrega uma nova música e opcionalmente a reproduz.
   * @param track O objeto Track contendo a URI da música.
   * @param shouldPlay Se true, a música será reproduzida imediatamente após o carregamento.
   * @throws Um erro se o track ou URI forem inválidos.
   */



  public async loadAndPlay(track: Track, shouldPlay: boolean = true): Promise<void> {
    if (!track || !track.uri) throw new Error("Track ou URI inválidos.");

    // 1. Evita recarregar se for a mesma música já pronta
    if (this.currentLoadedTrack && this.currentLoadedTrack.id === track.id) {
      const status = await this.sound?.getStatusAsync();
      if (status?.isLoaded) {
        if (shouldPlay && !status.isPlaying) await this.sound?.playAsync();
        return;
      }
    }

    // 2. Trava de Segurança: Se já está carregando algo, interrompa.
    // Em PWAs, é vital garantir que o sound anterior seja descarregado ANTES de criar o novo
    this.isCurrentlyLoading = true;

    try {
      if (this.sound) {
        console.log("AudioManager: Limpando rastro do áudio anterior...");
        // Forçamos o silêncio imediato
        await this.sound.stopAsync().catch(() => { });
        await this.sound.unloadAsync().catch(() => { });
        this.sound.setOnPlaybackStatusUpdate(null);
        this.sound = null;
      }

      console.log(`AudioManager: Iniciando carga de '${track.title}'`);

      // 3. Criar o som
      const { sound: newSound } = await Audio.Sound.createAsync(
        typeof track.uri === 'string' ? { uri: track.uri } : track.uri,
        { shouldPlay: shouldPlay, progressUpdateIntervalMillis: 500 },
        this._onPlaybackStatusUpdate
      );

      // 4. VERIFICAÇÃO DE ATROPELAMENTO (RACE CONDITION)
      // Se enquanto carregava, o trackId mudou (clique duplo rápido), descarte este áudio.
      if (this.currentLoadedTrack && this.currentLoadedTrack.id !== track.id && this.sound !== null) {
        console.log("AudioManager: Detectado atropelamento de carga. Cancelando áudio antigo.");
        await newSound.unloadAsync();
        return;
      }

      this.sound = newSound;
      this.currentLoadedTrack = track;

    } catch (error) {
      console.error("AudioManager: Falha no carregamento:", error);
      this.isCurrentlyLoading = false;
      throw error;
    } finally {
      this.isCurrentlyLoading = false;
    }
  }





  /**
   * Inicia a reprodução do som atual se ele estiver carregado e pausado.
   */
  public async play(): Promise<void> {
    if (this.sound) {
      const status = await this.sound.getStatusAsync();
      if ('isLoaded' in status && status.isLoaded && !status.isPlaying) {
        console.log("AudioManager: Iniciando reprodução.");
        await this.sound.playAsync();
      } else if (!('isLoaded' in status) || !status.isLoaded) {
        console.warn("AudioManager: Tentando play sem áudio carregado. Verifique a lógica de carregamento no Redux.");
      }
    }
  }

  /**
   * Pausa a reprodução do som atual se ele estiver carregado e reproduzindo.
   */
  public async pause(): Promise<void> {
    if (this.sound) {
      const status = await this.sound.getStatusAsync();
      if ('isLoaded' in status && status.isLoaded && status.isPlaying) {
        console.log("AudioManager: Pausando reprodução.");
        await this.sound.pauseAsync();
      }
    }
  }

  /**
   * Para e descarrega o som atual.
   */
  public async stop(): Promise<void> {
    if (this.sound) {
      try {
        // 1. Primeiro removemos o callback para o Redux parar de ouvir imediatamente
        this.sound.setOnPlaybackStatusUpdate(null);

        const status = await this.sound.getStatusAsync();
        if (status.isLoaded) {
          await this.sound.stopAsync();
          await this.sound.unloadAsync();
        }
      } catch (e) {
        console.warn("Erro ao parar:", e);
      } finally {
        this.sound = null;
        this.currentLoadedTrack = null;
      }
    }
  }


  /**
   * Alterna entre reproduzir e pausar o som atual.
   * @returns Uma Promise que resolve para true se o som estiver tocando após a alternância,
   * false se estiver pausado, ou null se não houver som carregado.
   */
  public async togglePlayPause(): Promise<boolean | null> {
    if (this.sound) {
      const status = await this.sound.getStatusAsync();
      if ('isLoaded' in status && status.isLoaded) {
        if (status.isPlaying) {
          await this.sound.pauseAsync();
          console.log("AudioManager: Alternando para PAUSE.");
          return false; // Agora está pausado
        } else {
          await this.sound.playAsync();
          console.log("AudioManager: Alternando para PLAY.");
          return true; // Agora está tocando
        }
      }
    }
    console.warn("AudioManager: Tentando alternar play/pause sem áudio carregado.");
    return null;
  }

  /**
   * Define o volume de reprodução do som.
   * @param volume O volume desejado (entre 0.0 e 1.0).
   */
  public async setVolume(volume: number): Promise<void> {
    if (this.sound) {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      await this.sound.setVolumeAsync(clampedVolume);
    }
  }

  /**
   * Busca (avança ou retrocede) para uma posição específica na reprodução.
   * @param positionMillis A posição desejada em milissegundos.
   */
  public async seekTo(positionMillis: number): Promise<void> {
    if (this.sound) {
      // O `isSeeking` é agora gerenciado no Redux, então não precisamos dele aqui.
      // A atualização do status (que o Redux observará) indicará o fim da busca.
      await this.sound.setPositionAsync(positionMillis);
      console.log(`AudioManager: Buscando para ${positionMillis}ms.`);
    } else {
      console.warn("AudioManager: Tentando buscar posição sem áudio carregado.");
    }
  }

  /**
   * Descarrega o som atual.
   * Este método é mais para uma limpeza geral se o player for fechado ou redefinido.
   */
  public async unload(): Promise<void> {
    if (this.sound) {
      try {
        console.log("AudioManager: Descarregando áudio (geral).");
        await this.sound.stopAsync(); // Parar antes de descarregar para evitar erros
        await this.sound.unloadAsync();
        this.sound.setOnPlaybackStatusUpdate(null); // Importante remover o listener
      } catch (error) {
        console.warn("AudioManager: Erro ao descarregar áudio no unload geral:", error);
      }
      this.sound = null;
      this.currentLoadedTrack = null;
    }
  }
}

// Implementação do padrão Singleton para garantir uma única instância do AudioManager
let audioManagerInstance: AudioManager | null = null;
export const getAudioManager = (): AudioManager => {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager();
  }
  return audioManagerInstance;
};



{/**
    public async stop(): Promise<void> {
    if (this.sound) {
      const status = await this.sound.getStatusAsync();
      if ('isLoaded' in status && status.isLoaded) {
        console.log("AudioManager: Parando e descarregando áudio.");
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      }
      this.sound.setOnPlaybackStatusUpdate(null); // Remove o listener
      this.sound = null; // Limpa a referência ao som
      this.currentLoadedTrack = null; // Limpa a track carregada
    }
  }

    
    */}





{/**
     public async loadAndPlay(track: Track, shouldPlay: boolean = true): Promise<void> {
    if (!track || !track.uri) {
      throw new Error("Track ou URI inválidos para carregar.");
    }

    // CRÍTICO: Se a mesma música já está carregada e não está em um estado de erro,
    // apenas ajusta o play/pause sem recarregar.
    if (this.currentLoadedTrack && this.currentLoadedTrack.id === track.id) {
      const status = await this.sound?.getStatusAsync();
      if (status && 'isLoaded' in status && status.isLoaded) {
        console.log(`AudioManager: Música '${track.title}' já carregada. Apenas ajustando play/pause.`);
        if (shouldPlay && !status.isPlaying) {
          await this.sound?.playAsync();
        } else if (!shouldPlay && status.isPlaying) {
          await this.sound?.pauseAsync();
        }
        return; // Sai da função, não precisa recarregar
      }
      // Se não está carregada apesar de ser a mesma ID, procede para recarregar
    }

    // Se houver um som carregado (e não é a mesma música que acabou de passar na verificação acima), descarregue-o primeiro
    if (this.sound) {
      try {
        console.log("AudioManager: Descarregando áudio anterior...");
        await this.sound.stopAsync(); // Parar antes de descarregar
        await this.sound.unloadAsync();
        this.sound.setOnPlaybackStatusUpdate(null); // Remove o listener do som anterior
        this.sound = null; // Garante que a referência seja limpa
        this.currentLoadedTrack = null; // Garante que a track carregada seja limpa
      } catch (error) {
        console.warn("AudioManager: Erro ao descarregar áudio anterior, mas prosseguindo com novo carregamento:", error);
      }
    }

    //console.log(`AudioManager: Carregando ${track.title || track.title || 'música desconhecida'} (${track.uri})`);
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        typeof track.uri === 'string' ? { uri: track.uri } : track.uri,
        { shouldPlay: shouldPlay, progressUpdateIntervalMillis: 500 },
        this._onPlaybackStatusUpdate
      );
      this.sound = newSound;
      this.currentLoadedTrack = track; // Define a música carregada
      console.log(`AudioManager: Música '${track.title}' carregada com sucesso.`);

      if (shouldPlay) {
        await this.sound.playAsync();
      }
    } catch (error) {
      console.error("AudioManager: Erro ao carregar e tocar som:", error);
      // Em caso de erro, garante que o player esteja limpo
      if (this.sound) {
        await this.sound.unloadAsync().catch(() => {}); // Tenta descarregar mesmo com erro
        this.sound.setOnPlaybackStatusUpdate(null);
      }
      this.sound = null;
      this.currentLoadedTrack = null;
      throw error; // Re-lança o erro para ser tratado pelo Redux
    }
  }
     */}
