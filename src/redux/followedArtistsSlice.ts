// src/redux/followedArtistsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Interface para um artista seguido.
// Deve conter as informações essenciais para exibir o artista na lista de "seguindo".
export interface FollowedArtist {
    id: string; // O ID único do artista
    name: string; // O nome do artista
    profileImageUrl?: string; // URL da imagem de perfil do artista (opcional)
}

// Interface para o estado do slice de artistas seguidos
interface FollowedArtistsState {
    artists: FollowedArtist[];
}

const initialState: FollowedArtistsState = {
    artists: [], // Começa com uma lista vazia de artistas seguidos
};

const followedArtistsSlice = createSlice({
    name: 'followedArtists',
    initialState,
    reducers: {
        // Ação para adicionar um artista aos seguidos
        addFollowedArtist: (state, action: PayloadAction<FollowedArtist>) => {
            // Verifica se o artista já está na lista para evitar duplicatas
            const exists = state.artists.some(artist => artist.id === action.payload.id);
            if (!exists) {
                state.artists.push(action.payload);
            }
        },
        // Ação para remover um artista dos seguidos
        removeFollowedArtist: (state, action: PayloadAction<string>) => { // Payload é o ID do artista
            state.artists = state.artists.filter(artist => artist.id !== action.payload);
        },
        // Ação para carregar artistas seguidos (útil se você persistir isso localmente)
        setFollowedArtists: (state, action: PayloadAction<FollowedArtist[]>) => {
            state.artists = action.payload;
        },
    },
});

export const { addFollowedArtist, removeFollowedArtist, setFollowedArtists } = followedArtistsSlice.actions;

export default followedArtistsSlice.reducer;