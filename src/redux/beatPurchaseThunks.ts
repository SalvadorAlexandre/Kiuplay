import { createAsyncThunk } from '@reduxjs/toolkit';
import { ExclusiveBeat, PurchasedBeat, Notification } from '@/src/types/contentType'; // Certifique-se de que os tipos estão corretos
import { RootState } from '@/src/redux/store'; 
import { addPurchasedBeat } from '@/src/redux/purchasesSlice';
import { markBeatAsSold } from '@/src/redux/beatStoreSlice'; 
import { addNotification } from '@/src/redux/notificationsSlice';


/**
 * @typedef {object} PurchaseThunkPayload
 * @property {ExclusiveBeat} beatToBuy - O beat exclusivo que o usuário está tentando comprar.
 * @property {string} currentUserId - O ID do usuário logado (pode ser obtido do authSlice em um app real).
 */

/**
 * Thunk assíncrono para processar uma compra de beat.
 *
 * Esta função simula a comunicação com um backend:
 * 1. Simula a chamada de API de pagamento/transação.
 * 2. Em caso de sucesso, atualiza o estado do Redux em dois slices:
 * - Adiciona o beat à lista de comprados (purchasesSlice).
 * - Remove o beat das listas de venda (feeds, favorites) (beatStoreSlice).
 * - Adiciona uma notificação (notificationsSlice).
 */
export const processBeatPurchaseThunk = createAsyncThunk<
    PurchasedBeat, // O tipo de valor de retorno em caso de sucesso
    ExclusiveBeat, // O tipo do argumento de entrada
    { 
        state: RootState; // O tipo do estado global
        rejectValue: string; // O tipo do valor de erro
    }
>(
    // Tipo de ação: usado para gerar ações PENDING, FULFILLED, REJECTED
    'transaction/processBeatPurchase',

    async (beatToBuy: ExclusiveBeat, { dispatch, getState, rejectWithValue }) => {
        
        // Em um cenário real, você faria uma chamada de API de pagamento/compra aqui.
        // Se a API falhar, você usaria return rejectWithValue('Mensagem de erro da API').

        try {
            // 1. OBTENÇÃO DE DADOS (Simulação de usuário logado)
            // Em uma aplicação real, você faria:
            // const currentUserId = getState().userSession.userId; 
            const currentUserId = 'mock-user-id-007'; 
            
            if (!currentUserId) {
                 // Esta verificação é crucial em apps reais
                return rejectWithValue('Usuário não autenticado.');
            }

            // 2. SIMULAÇÃO DE CHAMADA DE API BEM-SUCEDIDA
            // Cria o objeto PurchasedBeat que seria retornado pelo backend
            const purchasedBeat: PurchasedBeat = {
                ...beatToBuy,
                buyerId: currentUserId,
                sellerId: beatToBuy.artistId || 'Unknown',
                purchaseDate: new Date().toISOString(),
                downloadUrl: `https://kiuplay.com/downloads/${beatToBuy.id}_highres.zip`, // Simulação de URL de download
                // Assumindo que você adicione isBuyed no PurchasedBeat para fins de UI, se necessário:
                // isBuyed: true, 
            };
            
            // 3. ATUALIZAÇÕES DO FRONT-END (Dispatch de múltiplas actions)

            // A) Atualiza o purchasesSlice: Adiciona à biblioteca de beats comprados
            dispatch(addPurchasedBeat(purchasedBeat));

            // B) Atualiza o beatStoreSlice: Remove o beat das listas 'à venda' (Feeds, Favorites)
            // Usamos o ID do beat
            dispatch(markBeatAsSold(beatToBuy.id));

            // C) Adiciona notificação de sucesso
            const purchaseNotification: Notification = {
                id: `${Date.now()}`,
                title: 'Compra concluída 🎧',
                message: `Você comprou o beat "${beatToBuy.title}".`,
                type: 'purchase',
                contentType: 'exclusive_beat',
                contentId: beatToBuy.id,
                category: 'transaction',
                isRead: false,
                timestamp: new Date().toISOString(),
            };
            dispatch(addNotification(purchaseNotification));

            // Retorna o objeto PurchasedBeat em caso de sucesso (status FULFILLED)
            return purchasedBeat;

        } catch (error) {
            // Lidar com exceções ou erros de rede
            console.error("Erro no processamento da compra:", error);
            const errorMessage = "Não foi possível completar a compra devido a um erro de sistema.";
            return rejectWithValue(errorMessage);
        }
    }
);

// 🛑 NOTA: Certifique-se de que sua store (src/redux/store.ts) está configurada
// para usar o Redux Thunk (ou use o configureStore do RTK que já o inclui).