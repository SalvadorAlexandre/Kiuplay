// src/redux/favoriteEpSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExtendedPlayEP, Single } from '@/src/types/contentType';
import { addFavoriteSingles, removeFavoriteSingles } from './favoriteSinglesSlice';
import { AppDispatch } from './store';

interface FavoriteEPState {
  items: ExtendedPlayEP[];
}

const initialState: FavoriteEPState = {
  items: [],
};

const favoriteEpSlice = createSlice({
  name: 'favoriteEp',
  initialState,
  reducers: {
    toggleFavoriteEP: (state, action: PayloadAction<ExtendedPlayEP>) => {
      const index = state.items.findIndex(ep => ep.id === action.payload.id);
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },

    removeFavoriteEP: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(ep => ep.id !== action.payload);
    },

    setFavoriteEPs: (state, action: PayloadAction<ExtendedPlayEP[]>) => {
      state.items = action.payload;
    },

    clearFavoriteEPs: () => initialState,
  },
});

// Thunk para favoritar/desfavoritar EP e suas singles
export const toggleFavoriteEPWithSingles = (ep: ExtendedPlayEP) => {
  return (dispatch: AppDispatch, getState: () => any) => {
    const isFavorited = getState().favoriteEPs.items.some((item: ExtendedPlayEP) => item.id === ep.id);

    if (isFavorited) {
      dispatch(removeFavoriteEP(ep.id));
      dispatch(removeFavoriteSingles(ep.tracks)); // Remove todas as singles do EP
    } else {
      dispatch(toggleFavoriteEP(ep));
      dispatch(addFavoriteSingles(ep.tracks)); // Adiciona todas as singles do EP
    }
  };
};

export const {
  toggleFavoriteEP,
  removeFavoriteEP,
  setFavoriteEPs,
  clearFavoriteEPs,
} = favoriteEpSlice.actions;

export default favoriteEpSlice.reducer;