//src/redux/purchasesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PurchasedBeat } from '../types/contentType';

interface PurchasesState {
  items: PurchasedBeat[];
}

const initialState: PurchasesState = {
  items: [],
};

const purchasesSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    // Define uma lista inicial (útil para mocks ou carregamento da API)
    setPurchasedBeats(state, action: PayloadAction<PurchasedBeat[]>) {
      state.items = action.payload;
    },

    // Adiciona um novo beat comprado (quando a compra é confirmada)
    addPurchasedBeat(state, action: PayloadAction<PurchasedBeat>) {
      // Evita duplicar o mesmo beat
      const alreadyExists = state.items.some(
        (beat) => beat.id === action.payload.id
      );
      if (!alreadyExists) {
        state.items.unshift(action.payload);
      }
    },

    // Remove um beat do histórico (se necessário)
    removePurchasedBeat(state, action: PayloadAction<string>) {
      state.items = state.items.filter((beat) => beat.id !== action.payload);
    },

    // Limpa todos os beats comprados (por exemplo, ao deslogar)
    clearPurchases(state) {
      state.items = [];
    },
  },
});

export const {
  setPurchasedBeats,
  addPurchasedBeat,
  removePurchasedBeat,
  clearPurchases,
} = purchasesSlice.actions;

export default purchasesSlice.reducer;