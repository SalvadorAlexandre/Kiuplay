//src/redux/rootReducer.ts
import { combineReducers } from 'redux';
import playerReducer from './playerSlice';
import usersReducer  from './userSlice'; 
import favoriteMusicReducer from './favoriteMusicSlice'; // <-- NOVA IMPORTAÇÃO: Seu novo slice de músicas favoritas
import networkReducer from './networkSlice'; // NOVO: Importe o networkReducer


const rootReducer = combineReducers({
  player: playerReducer,
  users  : usersReducer, 
  favoriteMusic: favoriteMusicReducer, // <-- NOVA ADIÇÃO: Para suas músicas favoritas 
  network: networkReducer, // NOVO: Adicione o networkReducer aqui
  // Se tiver outros slices no futuro (ex: user, auth, beats), adicione-os aqui
  // user: userReducer,
  // auth: authReducer,
});

export default rootReducer;