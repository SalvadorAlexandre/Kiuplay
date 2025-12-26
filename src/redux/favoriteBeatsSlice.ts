import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BeatStoreFeedItem } from '../types/contentType';

interface FavoriteBeatsState {
  items: BeatStoreFeedItem[];
}

const initialState: FavoriteBeatsState = {
  items: [],
};

const favoriteBeatsSlice = createSlice({
  name: 'favoriteBeats',
  initialState,
  reducers: {
    // Adiciona ou Remove dependendo se já existe (Útil para o botão de coração)
    toggleFavoriteBeat: (state, action: PayloadAction<BeatStoreFeedItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },

    // Remove especificamente pelo ID (Útil para listas e swipes)
    removeFavoriteBeat: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    // Carrega a lista completa (Útil para sincronização com o Backend)
    setFavoriteBeats: (state, action: PayloadAction<BeatStoreFeedItem[]>) => {
      state.items = action.payload;
    },
    
    // Opcional: Limpa todos os favoritos (Útil no Logout)
    clearFavoriteBeats: (state) => {
      state.items = [];
    }
  },
});

export const { 
  toggleFavoriteBeat, 
  removeFavoriteBeat, 
  setFavoriteBeats,
  clearFavoriteBeats 
} = favoriteBeatsSlice.actions;

export default favoriteBeatsSlice.reducer;