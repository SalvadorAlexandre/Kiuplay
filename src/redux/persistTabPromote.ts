import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Definimos as chaves exatamente como aparecem no teu objeto fullProfile
export type PromoteTabKey =
  | 'singles'
  | 'eps'
  | 'albums'
  | 'exclusiveBeats'
  | 'freeBeats';

interface PromoteTabsState {
  activeTab: PromoteTabKey;
}

const initialState: PromoteTabsState = {
  activeTab: 'singles', // Padrão inicial
};

const promoteTabsSlice = createSlice({
  name: 'promoteTabs',
  initialState,
  reducers: {
    setPromoteActiveTab(state, action: PayloadAction<PromoteTabKey>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setPromoteActiveTab } = promoteTabsSlice.actions;
export default promoteTabsSlice.reducer;