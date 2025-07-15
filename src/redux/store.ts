// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistedReducer } from './persistConfig';
import { createAudioManagerMiddleware } from './middleware/audioManagerMiddleware';
import { persistStore } from 'redux-persist';

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Ignora verificações para redux-persist
    }).concat(createAudioManagerMiddleware()),
});

export const persistor = persistStore(store);

// Tipos globais
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;