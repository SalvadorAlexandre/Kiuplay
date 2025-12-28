// src/redux/favoriteFreeBeatsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FreeBeat } from '../types/contentType';

interface FavoriteFreeBeatsState {
  items: FreeBeat[];
}

const initialState: FavoriteFreeBeatsState = {
  items: [],
};

const favoriteFreeBeatsSlice = createSlice({
  name: 'favoriteFreeBeats',
  initialState,
  reducers: {
    toggleFavoriteFreeBeat: (state, action: PayloadAction<FreeBeat>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },

    removeFavoriteFreeBeat: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    setFavoriteFreeBeats: (state, action: PayloadAction<FreeBeat[]>) => {
      state.items = action.payload;
    },
    
    clearFavoriteFreeBeats: () => initialState,
  },
});

export const { 
  toggleFavoriteFreeBeat, 
  removeFavoriteFreeBeat, 
  setFavoriteFreeBeats,
  clearFavoriteFreeBeats 
} = favoriteFreeBeatsSlice.actions;

export default favoriteFreeBeatsSlice.reducer;

