//src/redux/beatStoreSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExclusiveBeat } from '../types/contentType';

// ✅ Interface do estado global da BeatStore
interface BeatStoreState {
    feeds: ExclusiveBeat[];
    exclusiveBeats: ExclusiveBeat[];
    favorites: ExclusiveBeat[];
    purchasedBeats: ExclusiveBeat[]; // 🆕 novo campo para beats comprados
}

// ✅ Estado inicial
const initialState: BeatStoreState = {
    feeds: [],
    exclusiveBeats: [],
    favorites: [],
    purchasedBeats: [], // 🆕 inicializa vazio
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

        // 🧹 Remove um beat de todas as listas (inclui os comprados também)
        removeBeatFromAll(state, action: PayloadAction<string>) {
            const beatId = action.payload;

            // ✅ Removendo o beat de todas as categorias
            state.feeds = state.feeds.filter(beat => beat.id !== beatId);
            state.exclusiveBeats = state.exclusiveBeats.filter(beat => beat.id !== beatId);
            state.favorites = state.favorites.filter(beat => beat.id !== beatId);
            state.purchasedBeats = state.purchasedBeats.filter(beat => beat.id !== beatId); // 🆕 linha adicionada
        },

        // 🛒 Adiciona um beat comprado (evita duplicações)
        addPurchasedBeat(state, action: PayloadAction<ExclusiveBeat>) {
            const alreadyExists = state.purchasedBeats.some(b => b.id === action.payload.id);
            if (!alreadyExists) {
                state.purchasedBeats.unshift(action.payload); // adiciona no início da lista
            }
        },
    },
});

// ✅ Exportações das actions e do reducer
export const {
    setFeeds,
    setExclusiveBeats,
    setFavorites,
    removeBeatFromAll,
    addPurchasedBeat, // 🆕 exportado para usar em outras telas
} = beatStoreSlice.actions;

export default beatStoreSlice.reducer;