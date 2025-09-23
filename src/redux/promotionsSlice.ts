// src/redux/promotionsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Promotion } from '@/src/types/contentType';

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