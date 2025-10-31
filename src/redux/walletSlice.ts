//src/redux/walletSlice.ts
import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { LinkedWallet } from '@/src/types/walletType';
import { mockLinkedWallets } from '@/src/types/contentServer';

// ------------------------------------------------------------
// 1️⃣ Definir o tipo do estado do slice
// ------------------------------------------------------------
export interface WalletState {
  wallets: LinkedWallet[];
  activeWallet: LinkedWallet | null;
  loading: boolean;
  error: string | null;
}

// ------------------------------------------------------------
// 2️⃣ Estado inicial tipado
// ------------------------------------------------------------
const initialState: WalletState = {
  wallets: [],
  activeWallet: null,
  loading: false,
  error: null,
};

// ------------------------------------------------------------
// 3️⃣ Thunk tipado (busca carteiras do usuário)
// ------------------------------------------------------------

export const fetchUserWallets = createAsyncThunk<LinkedWallet[], string>(
  'wallet/fetchUserWallets',
  async (userId: string) => {
    // ⚙️ Quando o backend existir:
    // const response = await axios.get(`https://api.kiuplay.com/users/${userId}/wallets`);
    // return response.data;

    // 🧩 Por enquanto, usa mock local:
    const wallets = mockLinkedWallets.filter((w) => w.userId === userId);
    return wallets;
  }
);

// ------------------------------------------------------------
// 4️⃣ Criação do slice com tipos explícitos
// ------------------------------------------------------------
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setActiveWallet: (state, action: PayloadAction<LinkedWallet | null>) => {
      state.activeWallet = action.payload;
    },
    clearWallets: (state) => {
      state.wallets = [];
      state.activeWallet = null;
    },
    // ✅ Novo reducer para alternar carteira ativa
    updateActiveWallet: (state, action: PayloadAction<string>) => {
      const walletId = action.payload;

      // Atualiza o status de todas as carteiras mockadas
      state.wallets = state.wallets.map((wallet) => ({
        ...wallet,
        status: wallet.id === walletId ? 'active' : 'inactive',
      }));

      // Define a nova carteira ativa
      state.activeWallet = state.wallets.find((wallet) => wallet.id === walletId) || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserWallets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWallets.fulfilled, (state, action: PayloadAction<LinkedWallet[]>) => {
        state.loading = false;
        state.wallets = action.payload;

        // detecta automaticamente a carteira ativa
        const active = action.payload.find((w) => w.status === 'active');
        state.activeWallet = active || null;
      })
      .addCase(fetchUserWallets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Erro ao carregar carteiras';
      });
  },
});

// ------------------------------------------------------------
// 5️⃣ Exportações
// ------------------------------------------------------------
export const { setActiveWallet, clearWallets, updateActiveWallet } = walletSlice.actions;

// ------------------------------------------------------------
// 🧠 Selectors otimizados (memoizados)
// ------------------------------------------------------------
export const selectWalletState = (state: { wallet: WalletState }) => state.wallet;

export const selectUserWallets = createSelector(
  [selectWalletState],
  (wallet) => wallet.wallets
);

export const selectActiveWallet = createSelector(
  [selectWalletState],
  (wallet) => wallet.activeWallet
);

export const selectWalletLoading = createSelector(
  [selectWalletState],
  (wallet) => wallet.loading
);

export const selectWalletError = createSelector(
  [selectWalletState],
  (wallet) => wallet.error
);

export default walletSlice.reducer;