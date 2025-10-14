//src/redux/userSessionAndCurrencySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
// 🛑 IMPORTAR A INTERFACE CENTRALIZADA DE PERFIL 
import { UserProfile } from '@/src/types/contentType';


/* ---------- estado ---------- */
// NOTA: A interface UserProfile agora deve ser importada de '@/src/types/contentType'
interface UsersState {
  byId: Record<string, UserProfile>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;

  // 🛑 NOVOS CAMPOS PARA O USUÁRIO LOGADO (Sessão e Moeda)
  /** O ID do usuário logado */
  currentUserId: string | null;
  /** O código de localização IETF (ex: 'pt-BR', 'en-US') */
  userLocale: string;
  /** O código da moeda (ex: 'BRL', 'USD') */
  userCurrencyCode: string;
}

const initialState: UsersState = {
  byId: {},
  status: 'idle',
  error: null,
  // 🛑 VALORES INICIAIS/PADRÃO
  currentUserId: null,
  userLocale: 'pt-BR', // Padrão
  userCurrencyCode: 'BRL', // Padrão
};

/* ---------- (exemplo) thunk para buscar perfil ----------- */
export const fetchUserThunk = createAsyncThunk<
  UserProfile, // Usa a interface importada
  string, // userId
  { state: RootState; rejectValue: string }
>(
  'users/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      // **troque por sua API**
      const resp = await fetch(`https://api.kiuplay.com/users/${userId}`);
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || 'Falha na requisição');
      }
      const data: UserProfile = await resp.json(); // Usa a interface importada
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Erro desconhecido ao buscar usuário');
    }
  }
);


/* ---------- slice ---------- */
const userSessionAndCurrencySlice = createSlice({
  name: 'users', // O nome interno (name) continua sendo 'users' para manter a compatibilidade com RootState
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<UserProfile[]>) {
      action.payload.forEach(u => { state.byId[u.id] = u; });
    },
    setUser(state, action: PayloadAction<UserProfile>) {
      const u = action.payload;
      state.byId[u.id] = u;
    },
    // 🛑 NOVO REDUCER: Configura a sessão do usuário logado e as propriedades de moeda
    setAuthSession(state, action: PayloadAction<{
      userId: string;
      locale: string;
      currencyCode: string;
    }>) {
      state.currentUserId = action.payload.userId;
      state.userLocale = action.payload.locale;
      state.userCurrencyCode = action.payload.currencyCode;
    },
    // NOVO REDUCER: Para simular um logout ou limpar a sessão
    logoutUser(state) {
      state.currentUserId = null;
      // Retorna aos padrões de moeda
      state.userLocale = 'pt-BR';
      state.userCurrencyCode = 'BRL';
    }
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

export const { setUsers, setUser, setAuthSession, logoutUser } = userSessionAndCurrencySlice.actions;

/* ---------- selectors ---------- */
export const selectUserById = (id: string) =>
  (state: RootState) => state.users.byId[id];

// 🛑 NOVOS SELECTORS PARA ACESSAR A MOEDA
export const selectUserLocale = (state: RootState) => state.users.userLocale;
export const selectUserCurrencyCode = (state: RootState) => state.users.userCurrencyCode;

export default userSessionAndCurrencySlice.reducer;