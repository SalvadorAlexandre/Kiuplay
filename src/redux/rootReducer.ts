//src/redux/rootReducer.ts
import { combineReducers } from 'redux';
import playerReducer from './playerSlice';
import usersReducer  from './userSlice'; 
import favoritesReducer from './favoritesSlice'; 
import notificationsReducer from './notificationsSlice'; // SINAL: Importação do novo reducer


const rootReducer = combineReducers({
  player: playerReducer,
  users  : usersReducer, 
  favorites: favoritesReducer,
  notifications: notificationsReducer, // SINAL: Adição do notificationsReducer    
  // Se tiver outros slices no futuro (ex: user, auth, beats), adicione-os aqui
  // user: userReducer,
  // auth: authReducer,
});

export default rootReducer;

