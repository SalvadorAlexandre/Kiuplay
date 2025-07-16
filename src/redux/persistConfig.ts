// src/redux/persistConfig.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import favoritesReducer from './favoritesSlice';
import playerReducer from './playerSlice';
import usersReducer from './userSlice';
import followedArtistsReducer from './followedArtistsSlice'; // <-- IMPORTANTE: Novo import

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['favorites', 'followedArtists'], // Persistir apenas favoritos
};

const rootReducer = combineReducers({
  player: playerReducer,
  users: usersReducer,
  favorites: favoritesReducer,
  followedArtists: followedArtistsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const persistedReducer = persistReducer(persistConfig, rootReducer);