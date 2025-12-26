//src/redux/rootReducer.ts
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