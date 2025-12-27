//src/redux/rootReducer.ts
import { combineReducers } from 'redux';
import playerReducer from './playerSlice';

import usersReducer from './userSessionAndCurrencySlice';

import followedArtistsReducer from './followedArtistsSlice';
import favoriteSinglesReducer from './favoriteSinglesSlice';
import favoriteBeatsReducer from './favoriteBeatsSlice';
import favoriteAlbumsReducer from './favoriteAlbumsSlice';
import favoriteEpReducer from './favoriteEpSlice';




import networkReducer from './networkSlice';
import notificationsReducer from './notificationsSlice';
import promotionsReducer from './promotionsSlice';
import purchasesReducer from './purchasesSlice';
import beatStoreReducer from './beatStoreSlice';
import walletReducer from './walletSlice';
import libraryReducer from './persistTabLibrery';
import beatStoreTabsReducer from './persistTabBeatStore';
import profileTabsReducer from './persistTabProfile';
import promoteTabsReducer from './persistTabPromote';
import draftsReducer from './draftsSlice';

const rootReducer = combineReducers({
  player: playerReducer,
  users: usersReducer,

  followedArtists: followedArtistsReducer,
  favoriteSingles: favoriteSinglesReducer,
  favoriteAlbums: favoriteAlbumsReducer,
  favoriteEPs: favoriteEpReducer,
  favoriteBeats: favoriteBeatsReducer,


  network: networkReducer,
  notifications: notificationsReducer,
  promotions: promotionsReducer,
  purchases: purchasesReducer,
  beatStore: beatStoreReducer,
  wallet: walletReducer,
  library: libraryReducer,
  beatstore: beatStoreTabsReducer,
  profile: profileTabsReducer,
  promoteTabs: promoteTabsReducer,
  drafts: draftsReducer,
});

export default rootReducer;



{/**
  import { combineReducers } from 'redux';
import playerReducer from './playerSlice';
import usersReducer from './userSessionAndCurrencySlice';
import favoriteMusicReducer from './favoriteMusicSlice'; // <-- NOVA IMPORTAÇÃO: Seu novo slice de músicas favoritas
import networkReducer from './networkSlice'; // NOVO: Importe o networkReducer
import promotionsReducer from './promotionsSlice';
import promoteTabsReducer from './persistTabPromote'
import favoriteBeatsReducer from './favoriteBeatsSlice'; // <-- ADICIONAR ESTE
import draftsReducer from './draftsSlice';

const rootReducer = combineReducers({
  player: playerReducer,
  users: usersReducer,
  favoriteMusic: favoriteMusicReducer, // <-- NOVA ADIÇÃO: Para suas músicas favoritas 
  network: networkReducer,// NOVO: Adicione o networkReducer aqui
  promotions: promotionsReducer,
  promoteTabs: promoteTabsReducer,
  favoriteBeats: favoriteBeatsReducer, // <-- ADICIONAR ESTE PARA OS BEATS
  drafts: draftsReducer,
  // Se tiver outros slices no futuro (ex: user, auth, beats), adicione-os aqui
  // user: userReducer,
  // auth: authReducer,
});

export default rootReducer;
  */}

