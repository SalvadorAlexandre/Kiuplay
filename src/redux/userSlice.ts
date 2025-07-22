// src/redux/usersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

/* ---------- tipos ---------- */
export interface UserProfile {
  id: string;
  name: string; // "Saag Weelli Boy"
  username: string; // "@saag_swb_oficial" - Adicionado
  avatarUrl?: string | null; // null → usa imagem padrão
  bio?: string; // Uma pequena descrição ou biografia do usuário
  followersCount: number; // "450 Seguidores" - Adicionado (alterado de 'followers' para 'followersCount' para clareza)
  followingCount: number; // "120 Seguindo" - Adicionado
  singlesCount: number; // "8 Singles" - Adicionado
  epsCount: number; // "2 EPs" - Adicionado
  albumsCount: number; // "1 Álbuns" - Adicionado
  videosCount: number; // Número de vídeos postados (novo)
  isArtist?: boolean; // Se o usuário é um artista verificado (opcional)
  hasMonetizationEnabled?: boolean; // Se o usuário tem monetização ativada
  // Estes abaixo são exemplos de outras informações que podem ser úteis
  socialLinks?: { // Links para redes sociais
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    // ...outras plataformas
  };
  location?: string; // Ex: "Luanda, Angola"
  memberSince?: string; // Data de criação da conta (e.g., "2023-01-15")
  totalPlaysCount?: number; // Total de plays em todas as músicas do artista
}

/* ---------- estado ---------- */
interface UsersState {
  byId: Record<string, UserProfile>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UsersState = {
  byId: {},
  status: 'idle',
  error: null,
};

/* ---------- (exemplo) thunk para buscar perfil ----------- */
export const fetchUserThunk = createAsyncThunk<
  UserProfile,
  string, // userId
  { state: RootState; rejectValue: string }
>(
  'users/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      // **troque por sua API**
      const resp = await fetch(`https://api.kiuplay.com/users/${userId}`);
      if (!resp.ok) {
        // Se a resposta da API não for 2xx, lance um erro
        const errorData = await resp.json();
        throw new Error(errorData.message || 'Falha na requisição');
      }
      const data: UserProfile = await resp.json();
      return data;
    } catch (err: any) {
      // É bom ter um tratamento mais robusto aqui para diferentes tipos de erro
      return rejectWithValue(err.message || 'Erro desconhecido ao buscar usuário');
    }
  }
);

/* ---------- slice ---------- */
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<UserProfile[]>) {
      action.payload.forEach(u => { state.byId[u.id] = u; });
    },
    setUser(state, action: PayloadAction<UserProfile>) {
      const u = action.payload;
      state.byId[u.id] = u;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserThunk.pending, s => { s.status = 'loading'; s.error = null; })
      .addCase(fetchUserThunk.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.byId[a.payload.id] = a.payload;
      })
      .addCase(fetchUserThunk.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload || 'Erro ao buscar usuário';
      });
  },
});

export const { setUsers, setUser } = usersSlice.actions;

/* ---------- selectors ---------- */
export const selectUserById = (id: string) =>
  (state: RootState) => state.users.byId[id];

export default usersSlice.reducer;