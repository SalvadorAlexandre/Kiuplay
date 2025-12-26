import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DraftsState {
  hasAlbumDraft: boolean;
  hasEPDraft: boolean;
}

const initialState: DraftsState = {
  hasAlbumDraft: false,
  hasEPDraft: false,
};

const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    // Permite atualizar um ou ambos os estados de uma vez
    setDraftStatus: (state, action: PayloadAction<Partial<DraftsState>>) => {
      return { ...state, ...action.payload };
    },
    // Limpa tudo (útil para logout ou reset)
    clearDrafts: () => initialState,
  },
});

export const { setDraftStatus, clearDrafts } = draftsSlice.actions;
export default draftsSlice.reducer;