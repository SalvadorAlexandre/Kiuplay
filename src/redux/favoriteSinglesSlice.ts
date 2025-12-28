// src/redux/favoriteSinglesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Single } from '@/src/types/contentType';

interface FavoriteSinglesState {
  items: Single[];
}

const initialState: FavoriteSinglesState = {
  items: [],
};

const favoriteSinglesSlice = createSlice({
  name: 'favoriteSingles',
  initialState,
  reducers: {
    // Toggle favorito (coração)
    toggleFavoriteSingle: (state, action: PayloadAction<Single>) => {
      const index = state.items.findIndex(
        single => single.id === action.payload.id
      );

      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },

    // Remove explicitamente (por ID)
    removeFavoriteSingle: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        single => single.id !== action.payload
      );
    },

    // Adiciona várias singles (útil para EP/Album)
    addFavoriteSingles: (state, action: PayloadAction<Single[]>) => {
      action.payload.forEach(single => {
        if (!state.items.find(s => s.id === single.id)) {
          state.items.push(single);
        }
      });
    },

    // Remove várias singles de uma vez (útil para desfavoritar EP/Album)
    removeFavoriteSingles: (state, action: PayloadAction<Single[]>) => {
      const idsToRemove = action.payload.map(s => s.id);
      state.items = state.items.filter(s => !idsToRemove.includes(s.id));
    },

    // Carregamento inicial vindo do backend
    setFavoriteSingles: (state, action: PayloadAction<Single[]>) => {
      state.items = action.payload;
    },

    // Limpeza no logout
    clearFavoriteSingles: () => initialState,
  },
});

export const {
  toggleFavoriteSingle,
  removeFavoriteSingle,
  addFavoriteSingles,
  removeFavoriteSingles,
  setFavoriteSingles,
  clearFavoriteSingles,
} = favoriteSinglesSlice.actions;

export default favoriteSinglesSlice.reducer;