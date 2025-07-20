// src/redux/networkSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a interface para o estado da rede
interface NetworkState {
  isConnected: boolean | null; // null para o estado inicial desconhecido
}

// Define o estado inicial
const initialState: NetworkState = {
  isConnected: null, // Inicialmente, o status da conexão é desconhecido
};

// Cria o slice da rede
const networkSlice = createSlice({
  name: 'network', // Nome do slice
  initialState,    // Estado inicial
  reducers: {
    // Reducer para definir o status da conexão
    setNetworkStatus: (state, action: PayloadAction<boolean | null>) => {
      state.isConnected = action.payload; // Atualiza o estado com o payload (true/false/null)
    },
  },
});

// Exporta a ação gerada pelo slice
export const { setNetworkStatus } = networkSlice.actions;

// Exporta o reducer para ser incluído no store
export default networkSlice.reducer;