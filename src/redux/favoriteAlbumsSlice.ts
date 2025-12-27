// src/redux/favoriteAlbumsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Album, Single } from '@/src/types/contentType';
import { addFavoriteSingles, removeFavoriteSingles } from './favoriteSinglesSlice';
import { AppDispatch } from './store';

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
    toggleFavoriteAlbum: (state, action: PayloadAction<Album>) => {
      const index = state.items.findIndex(album => album.id === action.payload.id);
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },

    removeFavoriteAlbum: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(album => album.id !== action.payload);
    },

    setFavoriteAlbums: (state, action: PayloadAction<Album[]>) => {
      state.items = action.payload;
    },

    clearFavoriteAlbums: () => initialState,
  },
});

// Thunk para favoritar/desfavoritar Album e suas singles
export const toggleFavoriteAlbumWithSingles = (album: Album) => {
  return (dispatch: AppDispatch, getState: () => any) => {
    const isFavorited = getState().favoriteAlbums.items.some((item: Album) => item.id === album.id);

    if (isFavorited) {
      dispatch(removeFavoriteAlbum(album.id));
      dispatch(removeFavoriteSingles(album.tracks)); // Remove todas as singles do Album
    } else {
      dispatch(toggleFavoriteAlbum(album));
      dispatch(addFavoriteSingles(album.tracks)); // Adiciona todas as singles do Album
    }
  };
};

export const {
  toggleFavoriteAlbum,
  removeFavoriteAlbum,
  setFavoriteAlbums,
  clearFavoriteAlbums,
} = favoriteAlbumsSlice.actions;

export default favoriteAlbumsSlice.reducer;