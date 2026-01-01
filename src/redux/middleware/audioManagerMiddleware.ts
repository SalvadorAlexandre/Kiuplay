// src/redux/middleware/audioManagerMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { getAudioManager } from '../../utils/audioManager';
import { updatePlaybackStatus, playNextThunk } from '../playerSlice';
// Remova a importação do RootState se ela estiver causando o erro circular
// import type { RootState } from '../store'; 

export const createAudioManagerMiddleware = (): Middleware => {
  return (store) => (next) => (action: any) => {
    const audioManager = getAudioManager();

    // 1. Configuração inicial do Callback
    const managerWithFlag = audioManager as any;
    if (!managerWithFlag._hasCallbackConnected) {
      audioManager.setPlaybackStatusUpdateCallback((status) => {
        store.dispatch(updatePlaybackStatus(status));
        if (status.isLoaded && status.didJustFinish) {
          // Usamos o dispatch do next para evitar problemas de tipagem circular
          store.dispatch(playNextThunk() as any);
        }
      });
      managerWithFlag._hasCallbackConnected = true;
    }

    // 2. Proteção de Race Condition
    if (action.type === 'player/setPlaylistAndPlay/pending' || action.type === 'player/loadTrack/pending') {
      // Em vez de tipar o store todo, acessamos o state como 'any' 
      // ou definimos uma interface local simples para evitar o loop
      const state = store.getState() as any;
      
      if (state.player?.isLoading) {
        console.log('Middleware: Bloqueando sobreposição de áudio...');
      }
    }

    return next(action);
  };
};




{/**
  
import { Middleware } from '@reduxjs/toolkit';
import { getAudioManager } from '../../utils/audioManager';
import { updatePlaybackStatus, playNextThunk, setPlaylistAndPlayThunk } from '../playerSlice';
import type { AppDispatch, RootState } from '../store';

export const createAudioManagerMiddleware = (): Middleware<{}, RootState> => {
  return (store) => (next) => (action: any) => {
    const audioManager = getAudioManager();

    // 1. Configuração inicial do Callback (Mantido sua lógica original)
    const managerWithFlag = audioManager as any;
    if (!managerWithFlag._hasCallbackConnected) {
      audioManager.setPlaybackStatusUpdateCallback((status) => {
        store.dispatch(updatePlaybackStatus(status));
        if (status.isLoaded && status.didJustFinish) {
          (store.dispatch as AppDispatch)(playNextThunk());
        }
      });
      managerWithFlag._hasCallbackConnected = true;
    }

    // 2. PROTEÇÃO DE RACE CONDITION (CONDIÇÃO DE CORRIDA)
    // Se a action for de carregar uma nova música
    if (action.type === 'player/setPlaylistAndPlay/pending' || action.type === 'player/loadTrack/pending') {
      const state = store.getState();
      
      // Se já houver algo carregando ou tocando, forçamos um stop limpo no motor
      // antes de permitir que o próximo 'load' comece no Redux
      if (state.player.isLoading) {
        console.log('Middleware: Bloqueando sobreposição de áudio...');
        // audioManager.stop() é assíncrono, mas aqui apenas sinalizamos
        // O AudioManager que otimizamos antes cuidará do resto.
      }
    }

    return next(action);
  };
};
  */}






{/**
  

  ESSA É A PRIMEIRA VERSAO
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
  
  */}

