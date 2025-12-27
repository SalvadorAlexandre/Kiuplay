// src/redux/favoriteEpSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExtendedPlayEP } from '@/src/types/contentType';

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
    // Toggle favorito (coração)
    toggleFavoriteEP: (state, action: PayloadAction<ExtendedPlayEP>) => {
      const index = state.items.findIndex(ep => ep.id === action.payload.id);
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },

    // Remove explicitamente (por ID)
    removeFavoriteEP: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(ep => ep.id !== action.payload);
    },

    // Carregamento inicial vindo do backend
    setFavoriteEPs: (state, action: PayloadAction<ExtendedPlayEP[]>) => {
      state.items = action.payload;
    },

    // Limpeza no logout
    clearFavoriteEPs: () => initialState,
  },
});

export const {
  toggleFavoriteEP,
  removeFavoriteEP,
  setFavoriteEPs,
  clearFavoriteEPs,
} = favoriteEpSlice.actions;

export default favoriteEpSlice.reducer;