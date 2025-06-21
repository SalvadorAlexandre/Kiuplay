// src/redux/playerSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAudioManager, Music } from '../utils/audioManager';
import { AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import type { RootState, AppDispatch } from './hooks'; // Make sure this path is correct if you renamed to hooks.ts

// --- Interfaces de Estado e Tipos Auxiliares ---
export interface PlayerState {
  currentTrack: Music | null;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  playlist: Music[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
  isExpanded: boolean;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  positionMillis: 0,
  durationMillis: 0,
  playlist: [],
  currentIndex: -1,
  isLoading: false,
  error: null,
  isExpanded: false,
};

interface SetPlaylistAndPlayPayload {
  newPlaylist: Music[];
  startIndex?: number;
}

// --- Thunks ---
export const setPlaylistAndPlayThunk = createAsyncThunk<
  void,
  SetPlaylistAndPlayPayload,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  'player/setPlaylistAndPlay',
  async ({ newPlaylist, startIndex = 0 }, { dispatch, rejectWithValue }) => {
    const audioManager = getAudioManager();

    await audioManager.stop();
    dispatch(resetPlayerState());

    if (!Array.isArray(newPlaylist) || newPlaylist.length === 0) return;

    dispatch(setPlaylist({ newPlaylist, startIndex }));
    const trackToPlay = newPlaylist[startIndex];

    if (trackToPlay) {
      dispatch(setLoading(true));
      try {
        await audioManager.loadAndPlay(trackToPlay, true);
      } catch (error: any) {
        console.error("Erro ao carregar ou reproduzir a música inicial:", error);
        return rejectWithValue(error.message || 'Erro desconhecido ao carregar música');
      } finally {
        dispatch(setLoading(false));
      }
    }
  }
);

export const togglePlayPauseThunk = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  'player/togglePlayPause',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const audioManager = getAudioManager();
    const state = getState().player;

    if (!state.currentTrack) {
      if (state.playlist.length > 0) {
        dispatch(setPlaylistAndPlayThunk({
          newPlaylist: state.playlist,
          startIndex: state.currentIndex === -1 ? 0 : state.currentIndex
        }));
      }
      return;
    }

    const isSoundActuallyLoaded = await audioManager.isSoundLoaded();

    if (!isSoundActuallyLoaded && !state.isLoading) {
      dispatch(setLoading(true));
      try {
        await audioManager.loadAndPlay(state.currentTrack, !state.isPlaying);
        dispatch(_setPlaying(!state.isPlaying));
      } catch (error: any) {
        console.error("Erro ao carregar para togglePlayPause:", error);
        return rejectWithValue(error.message || 'Erro desconhecido ao alternar play/pause');
      } finally {
        dispatch(setLoading(false));
      }
      return;
    }

    try {
      const wasPlaying = await audioManager.togglePlayPause();
      if (wasPlaying !== null) {
        dispatch(_setPlaying(!wasPlaying));
      }
    } catch (error: any) {
      console.error("Erro ao alternar play/pause:", error);
      return rejectWithValue(error.message || 'Erro desconhecido ao alternar play/pause');
    }
  }
);

export const playNextThunk = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  'player/playNext',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState().player;
    const audioManager = getAudioManager();

    if (state.playlist.length === 0) return;

    let nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.playlist.length) {
      nextIndex = 0;
    }

    dispatch(_setIndex(nextIndex));
    const nextTrack = state.playlist[nextIndex];

    if (nextTrack) {
      dispatch(setLoading(true));
      try {
        await audioManager.loadAndPlay(nextTrack, true);
        dispatch(_setPlaying(true));
      } catch (error: any) {
        console.error("Erro ao tocar a próxima música:", error);
        dispatch(playNextThunk());
        return rejectWithValue(error.message || 'Erro desconhecido ao tocar próxima música');
      } finally {
        dispatch(setLoading(false));
      }
    }
  }
);

export const playPreviousThunk = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  'player/playPrevious',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState().player;
    const audioManager = getAudioManager();

    if (state.playlist.length === 0) return;

    let prevIndex = state.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = state.playlist.length - 1;
    }

    dispatch(_setIndex(prevIndex));
    const prevTrack = state.playlist[prevIndex];

    if (prevTrack) {
      dispatch(setLoading(true));
      try {
        await audioManager.loadAndPlay(prevTrack, true);
        dispatch(_setPlaying(true));
      } catch (error: any) {
        console.error("Erro ao tocar a música anterior:", error);
        dispatch(playPreviousThunk());
        return rejectWithValue(error.message || 'Erro desconhecido ao tocar música anterior');
      } finally {
        dispatch(setLoading(false));
      }
    }
  }
);

export const seekToThunk = createAsyncThunk<
  void,
  number,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  'player/seekTo',
  async (positionMillis, { dispatch, getState, rejectWithValue }) => {
    const audioManager = getAudioManager();
    const state = getState().player;

    if (state.durationMillis > 0 && await audioManager.isSoundLoaded()) {
      try {
        await audioManager.seekTo(positionMillis);
        dispatch(updatePlaybackStatus({
          isLoaded: true,
          positionMillis,
          durationMillis: state.durationMillis,
          isPlaying: state.isPlaying,
          playableDurationMillis: state.durationMillis,
          shouldPlay: state.isPlaying,
          didJustFinish: false,
          isLooping: false,
          isMuted: false,
          rate: 1,
          shouldCorrectPitch: false,
          volume: 1,
          uri: (state.currentTrack?.uri as string) || '',
        } as AVPlaybackStatusSuccess));
      } catch (error: any) {
        console.error("Erro ao buscar posição:", error);
        return rejectWithValue(error.message || 'Erro desconhecido ao buscar posição');
      }
    } else {
      return rejectWithValue('Não há música carregada ou duração inválida para buscar.');
    }
  }
);

export const stopPlayerThunk = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; rejectValue: string }
>(
  'player/stopPlayer',
  async (_, { dispatch, rejectWithValue }) => {
    const audioManager = getAudioManager();
    try {
      await audioManager.stop();
      dispatch(resetPlayerState());
    } catch (error: any) {
      console.error("Erro ao parar o player:", error);
      return rejectWithValue(error.message || 'Erro desconhecido ao parar o player');
    }
  }
);

// --- Slice ---
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<SetPlaylistAndPlayPayload>) => {
      state.playlist = action.payload.newPlaylist;
      state.currentIndex = action.payload.startIndex ?? 0;
      state.currentTrack = state.playlist[state.currentIndex] || null;
      state.positionMillis = 0;
      state.durationMillis = 0;
      state.isPlaying = false;
      state.error = null;
    },
    updatePlaybackStatus: (state, action: PayloadAction<AVPlaybackStatus>) => {
      const status = action.payload;
      if ('isLoaded' in status && status.isLoaded) {
        state.positionMillis = status.positionMillis;
        state.durationMillis = status.durationMillis ?? 0;
        state.isPlaying = status.isPlaying;

        if (state.currentTrack && status.uri) {
          // --- CORREÇÃO AQUI ---
          // Certifica-se de que currentTrack.uri é string ou number antes de chamar toString()
          const currentTrackUri = (typeof state.currentTrack.uri === 'string' || typeof state.currentTrack.uri === 'number')
            ? state.currentTrack.uri.toString()
            : ''; // Ou alguma string padrão, ou jogue um erro, dependendo da sua lógica

          // --- CORREÇÃO AQUI ---
          // Verifica se status.uri é string ou number antes de chamar toString()
          const statusUri = (typeof status.uri === 'string' || typeof status.uri === 'number')
            ? status.uri.toString()
            : ''; // Ou alguma string padrão, ou jogue um erro

          if (currentTrackUri !== statusUri) {
            const newTrack = state.playlist.find(t => {
              // --- CORREÇÃO AQUI ---
              const tUri = (typeof t.uri === 'string' || typeof t.uri === 'number')
                ? t.uri.toString()
                : ''; // Default se não for string nem number
              return tUri === statusUri;
            });
            if (newTrack) {
              state.currentTrack = newTrack;
              // Ajusta currentIndex para refletir o newTrack encontrado
              state.currentIndex = state.playlist.findIndex(t => {
                const tUri = (typeof t.uri === 'string' || typeof t.uri === 'number')
                  ? t.uri.toString()
                  : '';
                return tUri === statusUri;
              });
            }
          }
        }
        // Lida com erros de playback reportados pelo status
        if ('error' in status && typeof status.error === 'string') {
          state.error = status.error; // Agora, TypeScript sabe que status.error é uma string
          // ...
        }
      }
    },
    _setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    _setIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
      state.currentTrack = state.playlist[action.payload] || null;
      state.positionMillis = 0;
      state.durationMillis = 0;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetPlayerState: (state) => {
      Object.assign(state, initialState);
    },
    setExpanded: (state, action: PayloadAction<boolean>) => {
      state.isExpanded = action.payload;
    },
    // Removendo o setError pois já tratamos o erro diretamente no status de playback.
    // Se precisar de um setError genérico, podemos adicioná-lo de volta.
    // setError: (state, action: PayloadAction<string | null>) => {
    //   state.error = action.payload;
    // },
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
        state.error = action.payload || action.error.message || 'Falha ao carregar playlist';
        state.isPlaying = false;
      })
      .addCase(togglePlayPauseThunk.rejected, (state, action) => {
        state.error = action.payload || action.error.message || 'Erro ao alternar play/pause';
      })
      .addCase(playNextThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(playNextThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(playNextThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Erro ao tocar próxima música';
      })
      .addCase(playPreviousThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(playPreviousThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(playPreviousThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Erro ao tocar música anterior';
      })
      .addCase(seekToThunk.rejected, (state, action) => {
        state.error = action.payload || action.error.message || 'Erro ao buscar posição';
      })
      .addCase(stopPlayerThunk.rejected, (state, action) => {
        state.error = action.payload || action.error.message || 'Erro ao parar o player';
      });
  },
});

export const {
  setPlaylist,
  updatePlaybackStatus,
  _setPlaying,
  _setIndex,
  setLoading,
  resetPlayerState,
  setExpanded,
} = playerSlice.actions;

export default playerSlice.reducer;