// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { createAudioManagerMiddleware } from './middleware/audioManagerMiddleware';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
        ignoredPaths: [],
      },
    }).concat(createAudioManagerMiddleware()),
});

// Tipos globais do estado e do dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;