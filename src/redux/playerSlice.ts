// src/redux/playerSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// Importe Music do audioManager SE Music for a interface para os metadados do arquivo local.
// Se Track for a interface mais completa, importe Track de um arquivo de tipos.
import { getAudioManager, } from '../utils/audioManager'; // Renomear para evitar conflito
import { AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { PlayableContent } from '@/src/types/contentType'; // Importe o novo tipo PlayableContent
import {shuffleArray} from '@/src/utils/arrayUtils'

import type { RootState, AppDispatch } from './store';

// Obtenha a instância singleton do AudioManager
const audioManager = getAudioManager();

// --- Define a interface Track de forma mais robusta e global ---
// Esta interface deve ser consistente com a que você usará no LocalMusicScreen
// e na forma como os dados são consumidos pelo AudioManager (se ele precisar de mais metadados)
// src/redux/playerSlice.ts

export type Track = PlayableContent & {
  source: // Mantenha ou ajuste a source para englobar todas as origens possíveis do player
  'library-local'
  | 'library-cloud-feeds'
  | 'library-cloud-favorites'
  | 'beatstore-feeds'
  | 'beatstore-favorites'
  | 'user-profile'
  | 'unknown'
  // Adicione outras propriedades específicas do player se houver (ex: `isPlaying`, `progress`, etc. - mas essas geralmente vão para o estado do slice, não na Track interface em si)
}

// --- Define a estrutura do estado global do player ---
export interface PlayerState {
  currentTrack: Track | null; // Agora usa a interface Track
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  playlist: Track[]; // Agora a playlist é de Tracks
  shuffledPlaylist: Track[]; // NOVO: A playlist na ordem embaralhada
  isShuffle: boolean; // NOVO: Indica se o shuffle está ativo
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
  isExpanded: boolean;
  isRepeat: boolean;
  isSeeking: boolean;
  //coverImage: string | null;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  positionMillis: 0,
  durationMillis: 0,
  playlist: [],
  shuffledPlaylist: [], // Inicialmente vazia
  isShuffle: false, // Inicialmente desativado
  currentIndex: -1,
  isLoading: false,
  error: null,
  isExpanded: false,
  isRepeat: false,
  isSeeking: false,
  //coverImage: null,
};

interface SetPlaylistAndPlayPayload {
  newPlaylist: Track[]; // Agora usa Track[]
  startIndex?: number;
  shouldPlay?: boolean;
}

// --- THUNKS ASSÍNCRONAS ---

// Thunk para definir a playlist e começar a reproduzir uma música
export const setPlaylistAndPlayThunk = createAsyncThunk<
  void,
  SetPlaylistAndPlayPayload,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  'player/setPlaylistAndPlay',
  async ({ newPlaylist, startIndex = 0, shouldPlay = true }, { dispatch, rejectWithValue }) => {
    // Primeiro, para qualquer reprodução atual e reseta o estado
    await audioManager.stop();
    dispatch(resetPlayerState()); // Reseta o estado Redux para limpar a UI

    if (!Array.isArray(newPlaylist) || newPlaylist.length === 0) {
      dispatch(setError('Playlist vazia ou inválida.'));
      return rejectWithValue('Playlist vazia ou inválida.');
    }

    const trackToPlay = newPlaylist[startIndex];

    if (trackToPlay) {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        // Agora passando a Track completa como esperado pelo AudioManager
        await audioManager.loadAndPlay(trackToPlay, shouldPlay);

        dispatch(_setPlaylist({ newPlaylist, startIndex })); // Atualiza Redux após carregar
      } catch (error: any) {
        console.error("Erro ao carregar ou reproduzir a música inicial:", error);
        dispatch(setError(error.message || 'Erro desconhecido ao carregar música.'));
        return rejectWithValue(error.message || 'Erro desconhecido ao carregar música');
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      dispatch(setError('Música inicial não encontrada na playlist.'));
      return rejectWithValue('Música inicial não encontrada na playlist.');
    }
  }
);

// --- NOVA THUNK: playTrackThunk ---
// Usada para tocar uma música específica da playlist (ou definir uma nova playlist e tocar)
export const playTrackThunk = createAsyncThunk<
  void,
  number, // Payload: index da música na playlist atual do Redux
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  'player/playTrack',
  async (targetIndex, { dispatch, getState, rejectWithValue }) => {
    const state = getState().player;

    if (targetIndex < 0 || targetIndex >= state.playlist.length) {
      dispatch(setError('Índice da música inválido.'));
      return rejectWithValue('Índice da música inválido.');
    }

    const trackToPlay = state.playlist[targetIndex];

    if (trackToPlay) {
      // Se já é a música atual e está carregada
      if (state.currentTrack?.id === trackToPlay.id && await audioManager.isSoundLoaded()) {
        if (!state.isPlaying) {
          await audioManager.play(); // Passa o Track completo
        }
        dispatch(_setIndex(targetIndex));
        dispatch(setError(null));
        return;
      }

      dispatch(_setIndex(targetIndex));
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        await audioManager.stop();
        await audioManager.loadAndPlay(trackToPlay, true); // Passa o Track completo
      } catch (error: any) {
        console.error("Erro ao carregar e tocar a faixa:", error);
        dispatch(setError(error.message || 'Erro ao carregar e tocar a música.'));
        return rejectWithValue(error.message || 'Erro ao carregar e tocar a música');
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      dispatch(setError('Música não encontrada no índice especificado.'));
      return rejectWithValue('Música não encontrada no índice especificado.');
    }
  }
);

// Thunk para alternar entre play e pause (mantido, mas com refinamentos)
export const togglePlayPauseThunk = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  'player/togglePlayPause',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState().player;

    // Se não há música atual, mas há playlist, tenta tocar a música atual da playlist
    if (!state.currentTrack && state.playlist.length > 0) {
      const initialIndex = state.currentIndex === -1 ? 0 : state.currentIndex;
      // Usa playTrackThunk para lidar com o carregamento e reprodução da primeira música
      dispatch(playTrackThunk(initialIndex));
      return;
    } else if (!state.currentTrack && state.playlist.length === 0) {
      console.warn("Nenhuma música para tocar na playlist.");
      dispatch(setError("Nenhuma música para tocar."));
      return;
    }

    try {
      const soundLoadedStatus = await audioManager.isSoundLoaded();

      if (soundLoadedStatus) {
        const newPlayingState = await audioManager.togglePlayPause();
        if (newPlayingState !== null) {
          dispatch(_setPlaying(newPlayingState));
        }
      } else {
        // Se a música atual está definida no Redux mas não carregada
        if (state.currentTrack) {
          dispatch(setLoading(true));
          dispatch(setError(null));
          await audioManager.loadAndPlay(state.currentTrack, !state.isPlaying); // Usa o Track completo
        } else {
          dispatch(setError('Não foi possível carregar o player para alternar.'));
        }
      }
    } catch (error: any) {
      console.error("Erro ao alternar play/pause:", error);
      dispatch(setError(error.message || 'Erro desconhecido ao alternar play/pause.'));
      return rejectWithValue(error.message || 'Erro desconhecido ao alternar play/pause');
    } finally {
      dispatch(setLoading(false));
    }
  }
);


// Thunk para tocar a próxima música na playlist
// src/redux/playerSlice.ts

export const playNextThunk = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  'player/playNext',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState().player;

    // Determina qual playlist usar com base no estado do shuffle
    const currentActivePlaylist = state.isShuffle ? state.shuffledPlaylist : state.playlist;

    if (currentActivePlaylist.length === 0 || state.currentIndex === -1) {
      dispatch(setError("Nenhuma playlist ou música selecionada para avançar."));
      return;
    }

    // Encontra o índice da música ATUAL dentro da playlist ATIVA.
    // Isso é crucial porque currentIndex do Redux aponta para a playlist ORIGINAL,
    // mas a navegação é feita na playlist ativa (original ou embaralhada).
    const currentTrackId = state.currentTrack?.id;
    let currentTrackIndexInActivePlaylist = currentActivePlaylist.findIndex(t => t.id === currentTrackId);

    // Se a música atual não foi encontrada na activePlaylist (o que pode acontecer
    // se o shuffle for ativado/desativado no meio da música),
    // tentamos usar o currentIndex original como ponto de partida para a activePlaylist.
    // Isso pode levar a um comportamento ligeiramente diferente ao alternar o shuffle
    // no meio da música, mas é uma solução comum.
    if (currentTrackIndexInActivePlaylist === -1) {
      // Tenta encontrar a música atual na playlist original e usa esse índice
      // como ponto de partida para a activePlaylist, se ela contiver a música.
      currentTrackIndexInActivePlaylist = state.currentIndex;
      // Garante que o índice não seja inválido
      if (currentTrackIndexInActivePlaylist >= currentActivePlaylist.length) {
        currentTrackIndexInActivePlaylist = currentActivePlaylist.length - 1;
      }
    }


    let nextTrackIndexInActivePlaylist = currentTrackIndexInActivePlaylist + 1;

    // Lógica para o final da playlist: repetição ou parada
    if (nextTrackIndexInActivePlaylist >= currentActivePlaylist.length) {
      if (state.isRepeat) {
        nextTrackIndexInActivePlaylist = 0; // Volta para o início da playlist ATIVA
        // Se shuffle está ativo e a playlist está repetindo, re-embaralhar para uma nova sequência
        if (state.isShuffle) {
          // Re-embaralha as músicas da playlist original inteira
          const newShuffledPlaylist = shuffleArray(state.playlist);
          // Atualiza a shuffledPlaylist no estado. Não alteramos `isShuffle` para não disparar re-render desnecessário.
          dispatch(playerSlice.actions._setShuffledPlaylist(newShuffledPlaylist));
          // Importante: A próxima música será a primeira da nova playlist embaralhada
          nextTrackIndexInActivePlaylist = 0;
        }
      } else {
        // Se não repete e chegou ao fim, para a reprodução
        dispatch(stopPlayerThunk());
        return;
      }
    }

    const nextTrackToPlay = currentActivePlaylist[nextTrackIndexInActivePlaylist];

    if (nextTrackToPlay) {
      // Encontra o índice da próxima música na playlist ORIGINAL para passar para playTrackThunk
      const originalIndex = state.playlist.findIndex(t => t.id === nextTrackToPlay.id);
      if (originalIndex !== -1) {
        dispatch(playTrackThunk(originalIndex));
      } else {
        // Caso de erro: música na playlist ativa não encontrada na playlist original
        dispatch(setError('Erro: Música não encontrada na playlist original.'));
        return rejectWithValue('Música não encontrada na playlist original.');
      }
    } else {
      dispatch(setError('Não foi possível determinar a próxima música.'));
      return rejectWithValue('Não foi possível determinar a próxima música.');
    }
  }
);

// Thunk para tocar a música anterior na playlist
export const playPreviousThunk = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  'player/playPrevious',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState().player;

    if (state.playlist.length === 0 || state.currentIndex === -1) {
      dispatch(setError("Nenhuma playlist ou música selecionada para retroceder."));
      return;
    }

    let prevIndex = state.currentIndex - 1;
    // Se isRepeat estiver ativado, volta para o final da playlist
    if (prevIndex < 0) {
      if (state.isRepeat) {
        prevIndex = state.playlist.length - 1;
      } else {
        // Se não houver repetição e for a primeira música, parar
        dispatch(stopPlayerThunk());
        return;
      }
    }

    // Usa a nova thunk para tocar a música anterior
    dispatch(playTrackThunk(prevIndex));
  }
);

// Thunk para buscar uma posição específica na música (mantida)
export const seekToThunk = createAsyncThunk<
  void,
  number, // Payload: positionMillis
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  'player/seekTo',
  async (positionMillis, { dispatch, getState, rejectWithValue }) => {
    const state = getState().player;

    if (state.currentTrack && state.durationMillis > 0 && await audioManager.isSoundLoaded()) {
      dispatch(setSeeking(true));
      try {
        await audioManager.seekTo(positionMillis);
        // A atualização real da posição e de `isSeeking` para false virá do `updatePlaybackStatus` do AudioManager.
      } catch (error: any) {
        console.error("Erro ao buscar posição:", error);
        dispatch(setError(error.message || 'Erro desconhecido ao buscar posição.'));
        dispatch(setSeeking(false));
        return rejectWithValue(error.message || 'Erro desconhecido ao buscar posição');
      }
    } else {
      const errorMessage = 'Não há música carregada ou duração inválida para buscar.';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk para parar o player completamente (mantida)
export const stopPlayerThunk = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; rejectValue: string }
>(
  'player/stopPlayer',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await audioManager.stop();
      dispatch(resetPlayerState());
    } catch (error: any) {
      console.error("Erro ao parar o player:", error);
      dispatch(setError(error.message || 'Erro desconhecido ao parar o player.'));
      return rejectWithValue(error.message || 'Erro desconhecido ao parar o player');
    }
  }
);

// Thunk para definir o volume (mantida)
export const setVolumeThunk = createAsyncThunk<
  void,
  number, // Payload: volume (0.0 - 1.0)
  { dispatch: AppDispatch; rejectValue: string }
>(
  'player/setVolume',
  async (volume: number, { dispatch, rejectWithValue }) => {
    try {
      await audioManager.setVolume(volume);
      dispatch(_setVolume(volume));
    } catch (error: any) {
      console.error("Erro ao definir volume:", error);
      dispatch(setError(error.message || 'Erro ao definir volume.'));
      return rejectWithValue(error.message || 'Erro ao definir volume');
    }
  }
);


// --- SLICE PRINCIPAL DO PLAYER ---
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    //Para lidar com a capa da currentTrack
    //setCoverImage: (state, action: PayloadAction<string | null>) => {
    // state.coverImage = action.payload;
    //},
    // Ação síncrona para alternar o modo shuffle
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
      if (state.isShuffle) {
        // Se ativado:
        // 1. Mantém as músicas já tocadas + a música atual na ordem original.
        // 2. Embaralha apenas as músicas restantes da playlist original.
        // 3. Concatena tudo para formar a shuffledPlaylist.

        const playedTracks = state.playlist.slice(0, state.currentIndex + 1);
        const remainingTracksToShuffle = state.playlist.slice(state.currentIndex + 1);
        const shuffledRemaining = shuffleArray(remainingTracksToShuffle);

        state.shuffledPlaylist = [...playedTracks, ...shuffledRemaining];

        // NOTA: O currentIndex no Redux continua se referindo à playlist original.
        // A lógica de playNext/playPrevious usará a shuffledPlaylist para a navegação.

      } else {
        // Se desativado:
        // Limpa a shuffledPlaylist, indicando que a playlist original será usada.
        state.shuffledPlaylist = [];
      }
    },
    _setShuffledPlaylist: (state, action: PayloadAction<Track[]>) => {
      state.shuffledPlaylist = action.payload;
    },
    // Ação síncrona para definir a playlist e o índice (usado por thunks)
    _setPlaylist: (state, action: PayloadAction<SetPlaylistAndPlayPayload>) => {
      state.playlist = action.payload.newPlaylist; // A playlist original
      state.currentIndex = action.payload.startIndex ?? 0;
      state.currentTrack = state.playlist[state.currentIndex] || null;
      state.positionMillis = 0;
      state.durationMillis = 0;
      state.isPlaying = false;
      state.error = null;
      state.isShuffle = false; // Desativa o shuffle ao definir uma nova playlist
      state.shuffledPlaylist = []; // Limpa a playlist embaralhada
    },

    // Ação síncrona para atualizar o status de reprodução vindo do AudioManager
    // src/redux/playerSlice.ts

    // ...

    updatePlaybackStatus: (state, action: PayloadAction<AVPlaybackStatus>) => {
      const status = action.payload;

      if ('isLoaded' in status && status.isLoaded) {
        state.positionMillis = status.positionMillis;
        state.durationMillis = status.durationMillis ?? 0;
        state.isPlaying = status.isPlaying;
        state.isLoading = status.isBuffering;

        if (state.isSeeking && !status.isBuffering) {
          state.isSeeking = false;
        }

        // Se o URI do status difere do URI da música atual no estado Redux,
        // atualiza currentTrack e currentIndex para refletir a música que *realmente* está tocando.
        // Isso é crucial se o AudioManager muda de faixa por conta própria (ex: em loop automático interno)
        // ou se o shuffle alterou a próxima música.
        if (status.uri && state.currentTrack && String(state.currentTrack.uri) !== String(status.uri)) {
          const matchedIndex = state.playlist.findIndex(t => String(t.uri) === String(status.uri));
          if (matchedIndex !== -1) {
            state.currentTrack = state.playlist[matchedIndex];
            state.currentIndex = matchedIndex; // Sempre atualiza o currentIndex para a playlist ORIGINAL
          }
        }

        // ... restante da sua lógica de updatePlaybackStatus (didJustFinish, erros)
        if ('error' in status && typeof status.error === 'string' && status.error) {
          state.error = status.error;
          state.isPlaying = false;
          state.isLoading = false;
        }

        if ('didJustFinish' in status && status.didJustFinish) {
          state.isPlaying = false;
          state.positionMillis = 0;
          // IMPORTANTE: A lógica de avançar para a próxima música (incluindo shuffle)
          // DEVE ser disparada a partir do `useEffect` em `AudioPlayerBar` quando `didJustFinish` for true.
          // Não adicione `dispatch(playNextThunk())` aqui diretamente para evitar ciclos e garantir o controle do componente.
        }

      } else if ('error' in status && typeof status.error === 'string' && status.error) {
        state.error = status.error;
        state.isPlaying = false;
        state.isLoading = false;
        state.currentTrack = null;
        state.currentIndex = -1;
      }
    },

    // Ações síncronas simples para controle direto do estado
    _setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    _setIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
      state.currentTrack = state.playlist[action.payload] || null;
      state.positionMillis = 0;
      state.durationMillis = 0;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        state.isPlaying = false;
        state.isLoading = false;
      }
    },
    setSeeking: (state, action: PayloadAction<boolean>) => {
      state.isSeeking = action.payload;
    },
    _setVolume: (state, action: PayloadAction<number>) => {
      // state.volume = action.payload; // Adicione 'volume' ao PlayerState se quiser rastreá-lo no Redux
    },
    toggleExpanded: (state) => {
      state.isExpanded = !state.isExpanded;
    },
    toggleRepeat: (state) => {
      state.isRepeat = !state.isRepeat;
    },
    resetPlayerState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(setPlaylistAndPlayThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setPlaylistAndPlayThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(setPlaylistAndPlayThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isPlaying = false;
        state.error = action.payload || 'Falha ao carregar playlist e música.';
        state.currentTrack = null;
        state.currentIndex = -1;
      })
      // playTrackThunk (NOVA)
      .addCase(playTrackThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(playTrackThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(playTrackThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isPlaying = false;
        state.error = action.payload || 'Falha ao tocar música específica.';
      })
      // togglePlayPauseThunk
      .addCase(togglePlayPauseThunk.rejected, (state, action) => {
        state.error = action.payload || 'Erro ao alternar reprodução.';
        state.isLoading = false;
      })
      // playNextThunk
      .addCase(playNextThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(playNextThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(playNextThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isPlaying = false;
        state.error = action.payload || 'Erro ao avançar para a próxima música.';
      })
      // playPreviousThunk
      .addCase(playPreviousThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(playPreviousThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(playPreviousThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isPlaying = false;
        state.error = action.payload || 'Erro ao retroceder para a música anterior.';
      })
      // seekToThunk
      .addCase(seekToThunk.rejected, (state, action) => {
        state.isSeeking = false;
        state.error = action.payload || 'Erro ao buscar posição na música.';
      })
      // stopPlayerThunk
      .addCase(stopPlayerThunk.rejected, (state, action) => {
        state.error = action.payload || 'Erro ao parar o player.';
      })
      // setVolumeThunk
      .addCase(setVolumeThunk.rejected, (state, action) => {
        state.error = action.payload || 'Erro ao definir o volume.';
      });

  },
});

export const {
  _setPlaylist,
  updatePlaybackStatus,
  _setPlaying,
  _setIndex,
  setLoading,
  setError,
  setSeeking,
  _setVolume,
  _setShuffledPlaylist,
  toggleExpanded,
  toggleRepeat,
  resetPlayerState,
  toggleShuffle,
} = playerSlice.actions;

export default playerSlice.reducer;