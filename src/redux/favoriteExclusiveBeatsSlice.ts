// src/redux/favoriteExclusiveBeatsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Importamos a interface correta que você definiu
import { ExclusiveBeat } from '../types/contentType'; 

interface FavoriteExclusiveBeatsState {
  items: ExclusiveBeat[]; // Tipagem específica aqui
}

const initialState: FavoriteExclusiveBeatsState = {
  items: [],
};

const favoriteExclusiveBeatsSlice = createSlice({
  name: 'favoriteExclusiveBeats',
  initialState,
  reducers: {
    toggleFavoriteExclusiveBeat: (state, action: PayloadAction<ExclusiveBeat>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },

    removeFavoriteExclusiveBeat: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    setFavoriteExclusiveBeats: (state, action: PayloadAction<ExclusiveBeat[]>) => {
      state.items = action.payload;
    },
    
    clearFavoriteExclusiveBeats: () => initialState,
  },
});

export const { 
  toggleFavoriteExclusiveBeat, 
  removeFavoriteExclusiveBeat, 
  setFavoriteExclusiveBeats,
  clearFavoriteExclusiveBeats 
} = favoriteExclusiveBeatsSlice.actions;

export default favoriteExclusiveBeatsSlice.reducer;