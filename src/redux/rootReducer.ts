//src/redux/rootReducer.ts
import { combineReducers } from 'redux';
import playerReducer from './playerSlice';
import usersReducer  from './userSlice'; 
import favoritesReducer from './favoritesSlice'; 
import notificationsReducer from './notificationsSlice'; // SINAL: Importação do novo reducer
import favoriteMusicReducer from './favoriteMusicSlice'; // <-- NOVA IMPORTAÇÃO: Seu novo slice de músicas favoritas


const rootReducer = combineReducers({
  player: playerReducer,
  users  : usersReducer, 
  favorites: favoritesReducer,
  notifications: notificationsReducer, // SINAL: Adição do notificationsReducer   
  favoriteMusic: favoriteMusicReducer, // <-- NOVA ADIÇÃO: Para suas músicas favoritas 
  // Se tiver outros slices no futuro (ex: user, auth, beats), adicione-os aqui
  // user: userReducer,
  // auth: authReducer,
});

export default rootReducer;