//src/redux/favoritesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Defina a interface para um vídeo favorito.
// Ela deve conter as informações essenciais para exibir o vídeo na lista de curtidas.
export interface FavoritedVideo {
  videoId: string;
  title: string;
  artist: string;
  videoThumbnailUrl: string;
  // Adicione outras propriedades se precisar exibi-las na lista de curtidas
  // Por exemplo: viewsCount, uploadTime, etc.
}

// Defina a interface para o estado do slice de favoritos
interface FavoritesState {
  videos: FavoritedVideo[];
}

const initialState: FavoritesState = {
  videos: [], // Começa com uma lista vazia de vídeos favoritos
};

const favoritesVideoSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Ação para adicionar um vídeo aos favoritos
    addFavoriteVideo: (state, action: PayloadAction<FavoritedVideo>) => {
      // Verifica se o vídeo já está na lista para evitar duplicatas
      const exists = state.videos.some(video => video.videoId === action.payload.videoId);
      if (!exists) {
        state.videos.push(action.payload);
      }
    },
    // Ação para remover um vídeo dos favoritos
    removeFavoriteVideo: (state, action: PayloadAction<string>) => { // Payload é o videoId
      state.videos = state.videos.filter(video => video.videoId !== action.payload);
    },
    // Ação para carregar favoritos (útil se você persistir isso localmente ou em um backend)
    setFavoriteVideos: (state, action: PayloadAction<FavoritedVideo[]>) => {
      state.videos = action.payload;
    },
  },
});

export const { addFavoriteVideo, removeFavoriteVideo, setFavoriteVideos } = favoritesVideoSlice.actions;

export default favoritesVideoSlice.reducer;
