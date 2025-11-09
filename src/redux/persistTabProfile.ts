// src/redux/persistProfileTabs.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ProfileTabKey =
  | 'single'
  | 'extendedPlay'
  | 'album'
  | 'purchasedBeats'
  | 'exclusiveBeatsForSale'
  | 'freeBeats';

interface ProfileTabsState {
  activeTab: ProfileTabKey;
}

const initialState: ProfileTabsState = {
  activeTab: 'single', // valor padrão inicial
};

const profileTabsSlice = createSlice({
  name: 'profileTabs',
  initialState,
  reducers: {
    setProfileActiveTab(state, action: PayloadAction<ProfileTabKey>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setProfileActiveTab } = profileTabsSlice.actions;
export default profileTabsSlice.reducer;