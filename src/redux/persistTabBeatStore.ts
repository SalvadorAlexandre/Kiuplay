import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BeatTabKey = 'feeds' | 'curtidas' | 'seguindo';

interface BeatStoreTabsState {
  activeTab: BeatTabKey;
}

const initialState: BeatStoreTabsState = {
  activeTab: 'feeds',
};

const beatStoreTabsSlice = createSlice({
  name: 'beatStoreTabs',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<BeatTabKey>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = beatStoreTabsSlice.actions;
export default beatStoreTabsSlice.reducer;