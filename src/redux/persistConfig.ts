// src/redux/persistConfig.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';

import playerReducer from './playerSlice';
import usersReducer from './userSessionAndCurrencySlice';
import followedArtistsReducer from './followedArtistsSlice'; // <-- IMPORTANTE: Novo import

import favoriteMusicReducer from './favoriteMusicSlice'; // <-- NOVA IMPORTAÇÃO: Seu slice de músicas favoritas
import favoriteBeatsReducer from './favoriteBeatsSlice'; // <-- 1. IMPORTAR
import networkReducer from './networkSlice'; // NOVO: Importe o networkReducer

import notificationsReducer from '../redux/notificationsSlice';
import promotionsReducer from '../redux/promotionsSlice';

import purchasesReducer from './purchasesSlice';
import beatStoreReducer from './beatStoreSlice'

import walletReducer from './walletSlice'

import libraryReducer from './persistTabLibrery'
import beatStoreTabsSlice from './persistTabBeatStore'
import profileTabsSlice from './persistTabProfile'
import promoteTabsReducer from './persistTabPromote';

import draftsReducer from './draftsSlice';


const rootReducer = combineReducers({
  player: playerReducer,
  users: usersReducer,

  followedArtists: followedArtistsReducer,
  favoriteMusic: favoriteMusicReducer, // <-- NOVA ADIÇÃO: Para suas músicas favoritas
  favoriteBeats: favoriteBeatsReducer, // <-- 2. ADICIONAR AO REDUCER

  network: networkReducer,
  notifications: notificationsReducer,
  promotions: promotionsReducer,
  purchases: purchasesReducer,
  beatStore: beatStoreReducer,
  wallet: walletReducer,
  library: libraryReducer,
  beatstore: beatStoreTabsSlice,
  profile: profileTabsSlice,
  promoteTabs: promoteTabsReducer,
  drafts: draftsReducer,
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
    'library',
    'beatstore',
    'profile',
    'promoteTabs',
    'drafts',
  ], // Persistir apenas favoritos
};


export type RootState = ReturnType<typeof rootReducer>;

//export const persistedReducer = persistReducer(persistConfig, rootReducer);

export const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer)