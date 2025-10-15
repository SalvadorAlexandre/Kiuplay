//src/redux/userSessionAndCurrencySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
// 🛑 IMPORTAR A INTERFACE CENTRALIZADA DE PERFIL 
import { UserProfile } from '@/src/types/contentType';


/* ---------- estado ---------- */
interface UsersState {
  byId: Record<string, UserProfile>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;

  // CAMPOS DE SESSÃO E MOEDA
  /** O ID do usuário logado */
  currentUserId: string | null;
  /** O código de localização IETF (ex: 'pt-BR', 'en-US') */
  userLocale: string;
  /** O código da moeda (ex: 'BRL', 'USD') */
  userCurrencyCode: string;

  // 🛑 NOVOS CAMPOS PARA INTERNACIONALIZAÇÃO (i18n)
  /** Idioma escolhido manualmente pelo usuário ('pt-BR', 'en', 'es'). Null significa usar a lógica de cascata. */
  appLanguage: string | null; // <--- NOVO
  /** Região da conta, vinda do backend (ex: 'BR', 'US'). Usado na Prioridade 2. */
  userAccountRegion: string | null; // <--- NOVO
}

const initialState: UsersState = {
  byId: {},
  status: 'idle',
  error: null,
  // VALORES INICIAIS/PADRÃO
  currentUserId: null,
  userLocale: 'pt-BR', // Padrão de Moeda/Locale
  userCurrencyCode: 'BRL', // Padrão de Moeda

  // 🛑 VALORES INICIAIS DE i18n
  appLanguage: null, // Começa como null para que a cascata de idioma seja executada
  userAccountRegion: null, // Será preenchido no login (setAuthSession) ou no registro
};

/* ---------- (exemplo) thunk para buscar perfil ----------- */
export const fetchUserThunk = createAsyncThunk<
  UserProfile,
  string,
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
      const data: UserProfile = await resp.json();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Erro desconhecido ao buscar usuário');
    }
  }
);


/* ---------- slice ---------- */
const userSessionAndCurrencySlice = createSlice({
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
    // REDUCER: Configura a sessão do usuário logado e as propriedades de moeda
    setAuthSession(state, action: PayloadAction<{
      userId: string;
      locale: string;
      currencyCode: string;
      // 🛑 Adiciona a região da conta aqui (Prioridade 2)
      accountRegion: string;
    }>) {
      state.currentUserId = action.payload.userId;
      state.userLocale = action.payload.locale;
      state.userCurrencyCode = action.payload.currencyCode;
      // 🛑 Salva a região da conta
      state.userAccountRegion = action.payload.accountRegion;
    },
    // NOVO REDUCER: Para salvar a escolha manual de idioma (Prioridade 1)
    setAppLanguage: (state, action: PayloadAction<string>) => {
      state.appLanguage = action.payload;
    }, // <--- NOVO REDUCER
    // REDUCER: Para simular um logout ou limpar a sessão
    logoutUser(state) {
      state.currentUserId = null;
      // Retorna aos padrões de moeda/i18n
      state.userLocale = 'pt-BR';
      state.userCurrencyCode = 'BRL';
      // 🛑 Limpa a preferência de idioma e região
      state.appLanguage = null;
      state.userAccountRegion = null;
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

export const {
  setUsers,
  setUser,
  setAuthSession,
  logoutUser,
  setAppLanguage // 🛑 EXPORTE O NOVO REDUCER
} = userSessionAndCurrencySlice.actions;

/* ---------- selectors ---------- */
export const selectUserById = (id: string) =>
  (state: RootState) => state.users.byId[id];

// NOVOS SELECTORS PARA ACESSAR A MOEDA
export const selectUserLocale = (state: RootState) => state.users.userLocale;
export const selectUserCurrencyCode = (state: RootState) => state.users.userCurrencyCode;

// 🛑 NOVOS SELECTORS PARA i18n
export const selectAppLanguage = (state: RootState) => state.users.appLanguage; // <--- NOVO
export const selectUserAccountRegion = (state: RootState) => state.users.userAccountRegion; // <--- NOVO

export default userSessionAndCurrencySlice.reducer;