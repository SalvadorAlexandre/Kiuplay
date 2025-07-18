// src/redux/favoriteMusicSlice.ts (NOVO ARQUIVO)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Track } from './playerSlice'; // Importamos a interface Track do playerSlice

// A interface para uma música favorita será a mesma Track,
// mas podemos ter certeza que ela terá as informações essenciais.
// Você pode criar uma nova interface aqui se quiser que o favorito tenha *menos* propriedades que o Track completo,
// mas por simplicidade e para manter a consistência, podemos usar Track diretamente.
export interface FavoritedMusic extends Track {
  // Você pode adicionar propriedades específicas para a música favorita aqui se necessário,
  // mas por enquanto, Track já deve ser suficiente.
}

interface FavoriteMusicState {
  musics: FavoritedMusic[];
}

const initialState: FavoriteMusicState = {
  musics: [], // Começa com uma lista vazia de músicas favoritas
};

const favoriteMusicSlice = createSlice({
  name: 'favoriteMusic',
  initialState,
  reducers: {
    // Ação para adicionar uma música aos favoritos
    addFavoriteMusic: (state, action: PayloadAction<FavoritedMusic>) => {
      // Verifica se a música já está na lista para evitar duplicatas
      const exists = state.musics.some(music => music.id === action.payload.id);
      if (!exists) {
        state.musics.push(action.payload);
      }
    },
    // Ação para remover uma música dos favoritos
    removeFavoriteMusic: (state, action: PayloadAction<string>) => { // Payload é o musicId (Track.id)
      state.musics = state.musics.filter(music => music.id !== action.payload);
    },
    // Ação para verificar se uma música já é favorita (útil para o UI do botão de coração)
    // Embora não seja um reducer que modifica o estado, é uma forma de ter a lógica aqui.
    // Melhor fazer essa verificação no componente usando useSelector.
    // isMusicFavorited: (state, action: PayloadAction<string>) => {
    //   return state.musics.some(music => music.id === action.payload);
    // },

    // Ação para carregar favoritos (útil se você persistir isso localmente ou em um backend)
    setFavoriteMusics: (state, action: PayloadAction<FavoritedMusic[]>) => {
      state.musics = action.payload;
    },
  },
});

export const { addFavoriteMusic, removeFavoriteMusic, setFavoriteMusics } = favoriteMusicSlice.actions;

export default favoriteMusicSlice.reducer;
