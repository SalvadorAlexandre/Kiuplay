// src/redux/slices/notificationsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Interface para os dados do vídeo (copiada do seu NotificationsScreen para consistência)
export interface VideoNotification {
    id: string;
    title: string;
    artist: string;
    artistId: string;
    artistProfileImageUrl?: string;
    thumbnail: string;
    videoUrl: string;
    uploadTime: string;
    // ADIÇÃO: Um campo para marcar como lida, opcionalmente
    read: boolean;
}

// Interface para o estado inicial do slice de notificações
interface NotificationsState {
    notifications: VideoNotification[];
}

// Estado inicial das notificações
const initialState: NotificationsState = {
    notifications: [],
};

const notificationsSlice = createSlice({
    name: 'notifications', // Nome único para este slice
    initialState,
    reducers: {
        // AÇÃO: Adicionar uma ou mais notificações
        addNotifications(state, action: PayloadAction<VideoNotification[]>) {
            // ADIÇÃO: Garante que as novas notificações não sejam duplicatas por ID
            action.payload.forEach(newNotif => {
                if (!state.notifications.some(existingNotif => existingNotif.id === newNotif.id)) {
                    state.notifications.push({ ...newNotif, read: false }); // ADIÇÃO: Adiciona 'read: false' por padrão
                }
            });
            // Opcional: Manter um limite de notificações
            // state.notifications = state.notifications.slice(0, 50); // Exemplo: manter apenas as 50 mais recentes
        },
        // AÇÃO: Remover uma notificação específica pelo ID
        removeNotification(state, action: PayloadAction<string>) {
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload
            );
        },
        // AÇÃO: Remover todas as notificações
        removeAllNotifications(state) {
            state.notifications = [];
        },
        // ADIÇÃO: Marcar uma notificação como lida
        markNotificationAsRead(state, action: PayloadAction<string>) {
            const index = state.notifications.findIndex(notif => notif.id === action.payload);
            if (index !== -1) {
                state.notifications[index].read = true;
            }
        },
        // ADIÇÃO: Marcar todas as notificações como lidas
        markAllNotificationsAsRead(state) {
            state.notifications.forEach(notif => {
                notif.read = true;
            });
        },
    },
});

// Exportar as ações e o reducer
export const {
    addNotifications,
    removeNotification,
    removeAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;