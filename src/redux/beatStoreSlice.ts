// src/redux/beatStoreSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExclusiveBeat } from '../types/contentType';

// ✅ Interface do estado global da BeatStore (REVISADA)
interface BeatStoreState {
    feeds: ExclusiveBeat[];
    exclusiveBeats: ExclusiveBeat[];
    favorites: ExclusiveBeat[];
    // 🛑 REMOVIDO: purchasedBeats (Movido para o purchasesSlice.ts)
}

// ✅ Estado inicial (REVISADO)
const initialState: BeatStoreState = {
    feeds: [],
    exclusiveBeats: [],
    favorites: [],
    // 🛑 REMOVIDO: purchasedBeats: [],
};

// ✅ Slice principal
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

        // 🆕 AÇÃO PRINCIPAL: Remove o beat das listas 'À VENDA'
        // Será usada após o sucesso da compra para limpar o feed e favoritos.
        markBeatAsSold(state, action: PayloadAction<string>) {
            const beatId = action.payload;

            // ✅ Removendo o beat de todas as categorias de venda
            state.feeds = state.feeds.filter(beat => beat.id !== beatId);
            state.exclusiveBeats = state.exclusiveBeats.filter(beat => beat.id !== beatId);
            state.favorites = state.favorites.filter(beat => beat.id !== beatId);

            // 🛑 NOTA: Linha 'state.purchasedBeats = ...' FOI REMOVIDA.
        },

        // 🛑 REMOVIDO: removeBeatFromAll (substituído por markBeatAsSold e focado na remoção de venda)
        // 🛑 REMOVIDO: addPurchasedBeat (Movido para o purchasesSlice.ts)
    },
});

// ✅ Exportações das actions e do reducer (REVISADO)
export const {
    setFeeds,
    setExclusiveBeats,
    setFavorites,
    markBeatAsSold, // 🆕 markBeatAsSold é a nova action chave
} = beatStoreSlice.actions;

export default beatStoreSlice.reducer;