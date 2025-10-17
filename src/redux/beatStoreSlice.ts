//src/redux/beatStoreSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExclusiveBeat } from '../types/contentType';

interface BeatStoreState {
  feeds: ExclusiveBeat[];
  exclusiveBeats: ExclusiveBeat[];
  favorites: ExclusiveBeat[];
}

const initialState: BeatStoreState = {
  feeds: [],
  exclusiveBeats: [],
  favorites: [],
};

const beatStoreSlice = createSlice({
  name: 'beatStore',
  initialState,
  reducers: {
    setFeeds(state, action: PayloadAction<ExclusiveBeat[]>) {
      state.feeds = action.payload;
    },
    setExclusiveBeats(state, action: PayloadAction<ExclusiveBeat[]>) {
      state.exclusiveBeats = action.payload;
    },
    setFavorites(state, action: PayloadAction<ExclusiveBeat[]>) {
      state.favorites = action.payload;
    },
    removeBeatFromAll(state, action: PayloadAction<string>) {
      const beatId = action.payload;
      state.feeds = state.feeds.filter(beat => beat.id !== beatId);
      state.exclusiveBeats = state.exclusiveBeats.filter(beat => beat.id !== beatId);
      state.favorites = state.favorites.filter(beat => beat.id !== beatId);
    },
  },
});

export const { setFeeds, setExclusiveBeats, setFavorites, removeBeatFromAll } = beatStoreSlice.actions;
export default beatStoreSlice.reducer;