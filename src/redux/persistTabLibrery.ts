// src/redux/persistTabLibrery.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypeSubTab } from '@/hooks/useSubTabSelectorLibrary';

interface LibraryState {
  selectedLocalTab: TypeSubTab;
  selectedCloudTab: TypeSubTab;
  selectedLibraryContent: 'local' | 'cloud'; // nova propriedade
}

const initialState: LibraryState = {
  selectedLocalTab: 'tudo',
  selectedCloudTab: 'feeds',
  selectedLibraryContent: 'local', // inicial
};

const libraryTabSlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setLocalTab(state, action: PayloadAction<TypeSubTab>) {
      state.selectedLocalTab = action.payload;
    },
    setCloudTab(state, action: PayloadAction<TypeSubTab>) {
      state.selectedCloudTab = action.payload;
    },
    setLibraryContent(state, action: PayloadAction<'local' | 'cloud'>) {
      state.selectedLibraryContent = action.payload;
    },
  },
});

export const { setLocalTab, setCloudTab, setLibraryContent } = libraryTabSlice.actions;
export default libraryTabSlice.reducer;