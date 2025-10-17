//src/redux/notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../types/contentType';

interface NotificationsState {
  items: Notification[];
}

const initialState: NotificationsState = {
  items: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.items.unshift(action.payload);
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notif = state.items.find(n => n.id === action.payload);
      if (notif) notif.isRead = true;
    },
    clearNotifications(state) {
      state.items = [];
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  clearNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;