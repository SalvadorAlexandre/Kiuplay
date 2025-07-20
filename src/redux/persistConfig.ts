// src/redux/persistConfig.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import favoritesReducer from './favoritesSlice';
import playerReducer from './playerSlice';
import usersReducer from './userSlice';
import followedArtistsReducer from './followedArtistsSlice'; // <-- IMPORTANTE: Novo import
import notificationsReducer from './notificationsSlice'; // SIGNA: New import for notificationsReducer
import favoriteMusicReducer from './favoriteMusicSlice'; // <-- NOVA IMPORTAÇÃO: Seu slice de músicas favoritas
import networkReducer from './networkSlice'; // NOVO: Importe o networkReducer


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['favorites', 'followedArtists', 'notifications', 'favoriteMusic', 'network'], // Persistir apenas favoritos
};

const rootReducer = combineReducers({
  player: playerReducer,
  users: usersReducer,
  favorites: favoritesReducer,
  followedArtists: followedArtistsReducer,
  notifications: notificationsReducer,
  favoriteMusic: favoriteMusicReducer, // <-- NOVA ADIÇÃO: Para suas músicas favoritas
  network: networkReducer,  
});

export type RootState = ReturnType<typeof rootReducer>;

export const persistedReducer = persistReducer(persistConfig, rootReducer);