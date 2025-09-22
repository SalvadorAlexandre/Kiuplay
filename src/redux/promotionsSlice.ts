//src/redux/promotionsSlice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Promotion {
  id: string;
  adTitle: string;
  customMessage: string;
  startDate: string;
  endDate: string;
  coverSource: any; // A fonte da imagem pode ser um objeto ou um require
  contentTitle: string;
  status: 'active' | 'expired' | 'pending' | 'removed';
}

interface PromotionsState {
  activePromotions: Promotion[];
}

const initialState: PromotionsState = {
  activePromotions: [],
};

const promotionsSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    addPromotion: (state, action: PayloadAction<Promotion>) => {
      state.activePromotions.push(action.payload);
    },
    removePromotion: (state, action: PayloadAction<string>) => {
      state.activePromotions = state.activePromotions.filter(
        (promo) => promo.id !== action.payload
      );
    },
  },
});

export const { addPromotion, removePromotion } = promotionsSlice.actions;

export default promotionsSlice.reducer;