import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

/* ---------- tipos ---------- */
export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string | null;   // null → usa imagem padrão
  bio?: string;
  followers?: number;
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
  string,                       // userId
  { state: RootState; rejectValue: string }
>(
  'users/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      // **troque por sua API**
      const resp = await fetch(`https://api.kiuplay.com/users/${userId}`);
      if (!resp.ok) throw new Error('Falha na requisição');
      const data: UserProfile = await resp.json();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
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