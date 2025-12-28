//src/redux/rootReducer.ts
import { combineReducers } from 'redux';
import playerReducer from './playerSlice';

import usersReducer from './userSessionAndCurrencySlice';

import followedArtistsReducer from './followedArtistsSlice';
import favoriteSinglesReducer from './favoriteSinglesSlice';
import favoriteAlbumsReducer from './favoriteAlbumsSlice';
import favoriteEpReducer from './favoriteEpSlice';


import favoriteFreeBeatReducer from './favoriteFreeBeatsSlice';
import favoriteExclusiveBeatsReducer from './favoriteExclusiveBeatsSlice';
import purchasesExclusiveBeatsReducer from './purchasesExclusiveBeatsSlice';


import networkReducer from './networkSlice';
import notificationsReducer from './notificationsSlice';
import promotionsReducer from './promotionsSlice';
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

  favoriteExclusiveBeats:favoriteExclusiveBeatsReducer,
  favoriteFreeBeats: favoriteFreeBeatReducer,
  purchasesExclusiveBeats: purchasesExclusiveBeatsReducer,


  network: networkReducer,
  notifications: notificationsReducer,
  promotions: promotionsReducer,
  wallet: walletReducer,
  library: libraryReducer,
  beatstore: beatStoreTabsReducer,
  profile: profileTabsReducer,
  promoteTabs: promoteTabsReducer,
  drafts: draftsReducer,
});

export default rootReducer;