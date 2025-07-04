// src/redux/middleware/audioManagerMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { getAudioManager } from '../../utils/audioManager';
import { updatePlaybackStatus, playNextThunk } from '../playerSlice';
import type { AppDispatch } from '../store';

export const createAudioManagerMiddleware = (): Middleware => {
  return (store) => (next) => (action: unknown) => {
    const result = next(action);

    const audioManager = getAudioManager();

    // Tipagem de segurança temporária para propriedade customizada
    const managerWithFlag = audioManager as typeof audioManager & {
      _hasCallbackConnected?: boolean;
    };

    if (!managerWithFlag._hasCallbackConnected) {
      audioManager.setPlaybackStatusUpdateCallback((status) => {
        store.dispatch(updatePlaybackStatus(status));

        if (status.isLoaded && status.didJustFinish) {
          console.log('Música terminou. Despachando playNextThunk.');
          (store.dispatch as AppDispatch)(playNextThunk());
        }
      });

      managerWithFlag._hasCallbackConnected = true;
    }

    return result;
  };
};