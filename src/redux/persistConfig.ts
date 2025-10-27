// src/redux/persistConfig.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';

import playerReducer from './playerSlice';
import usersReducer from './userSessionAndCurrencySlice';
import followedArtistsReducer from './followedArtistsSlice'; // <-- IMPORTANTE: Novo import

import favoriteMusicReducer from './favoriteMusicSlice'; // <-- NOVA IMPORTAÇÃO: Seu slice de músicas favoritas
import networkReducer from './networkSlice'; // NOVO: Importe o networkReducer

import notificationsReducer from '../redux/notificationsSlice';
import promotionsReducer from '../redux/promotionsSlice';

import purchasesReducer from './purchasesSlice';
import beatStoreReducer from './beatStoreSlice'

import walletReducer from './walletSlice'

const rootReducer = combineReducers({
  player: playerReducer,
  users: usersReducer,
  followedArtists: followedArtistsReducer,
  favoriteMusic: favoriteMusicReducer, // <-- NOVA ADIÇÃO: Para suas músicas favoritas
  network: networkReducer,
  notifications: notificationsReducer,
  promotions: promotionsReducer,
  purchases: purchasesReducer,
  beatStore: beatStoreReducer,
  wallet: walletReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'followedArtists',
    'favoriteMusic',
    'network',
    'notifications',
    'promotions',
    'purchases',
    'beatStore',
    'wallet',
  ], // Persistir apenas favoritos
};


export type RootState = ReturnType<typeof rootReducer>;

export const persistedReducer = persistReducer(persistConfig, rootReducer);