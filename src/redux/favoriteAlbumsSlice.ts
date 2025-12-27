// src/redux/favoriteAlbumsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Album } from '@/src/types/contentType';

interface FavoriteAlbumsState {
  items: Album[];
}

const initialState: FavoriteAlbumsState = {
  items: [],
};

const favoriteAlbumsSlice = createSlice({
  name: 'favoriteAlbums',
  initialState,
  reducers: {
    // Toggle favorito (coração)
    toggleFavoriteAlbum: (state, action: PayloadAction<Album>) => {
      const index = state.items.findIndex(album => album.id === action.payload.id);
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },

    // Remove explicitamente (por ID)
    removeFavoriteAlbum: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(album => album.id !== action.payload);
    },

    // Carregamento inicial vindo do backend
    setFavoriteAlbums: (state, action: PayloadAction<Album[]>) => {
      state.items = action.payload;
    },

    // Limpeza no logout
    clearFavoriteAlbums: () => initialState,
  },
});

export const {
  toggleFavoriteAlbum,
  removeFavoriteAlbum,
  setFavoriteAlbums,
  clearFavoriteAlbums,
} = favoriteAlbumsSlice.actions;

export default favoriteAlbumsSlice.reducer;