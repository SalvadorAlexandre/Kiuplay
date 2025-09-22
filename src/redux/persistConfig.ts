// src/redux/persistConfig.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';

import playerReducer from './playerSlice';
import usersReducer from './userSlice';
import followedArtistsReducer from './followedArtistsSlice'; // <-- IMPORTANTE: Novo import

import favoriteMusicReducer from './favoriteMusicSlice'; // <-- NOVA IMPORTAÇÃO: Seu slice de músicas favoritas
import networkReducer from './networkSlice'; // NOVO: Importe o networkReducer

import notificationsReducer from '../redux/notificationsSlice';
import promotionsReducer from '../redux/promotionsSlice';

const rootReducer = combineReducers({
  player: playerReducer,
  users: usersReducer,
  followedArtists: followedArtistsReducer,
  favoriteMusic: favoriteMusicReducer, // <-- NOVA ADIÇÃO: Para suas músicas favoritas
  network: networkReducer,  
  notifications: notificationsReducer,
  promotions: promotionsReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'favorites',
    'followedArtists',
    'favoriteMusic',
    'network',
    'notifications',
    'promotions',
  ], // Persistir apenas favoritos
};


export type RootState = ReturnType<typeof rootReducer>;

export const persistedReducer = persistReducer(persistConfig, rootReducer);