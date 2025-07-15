//src/redux/rootReducer.ts
import { combineReducers } from 'redux';
import playerReducer from './playerSlice';
import usersReducer  from './userSlice'; 
import favoritesReducer from './favoritesSlice'; 


const rootReducer = combineReducers({
  player: playerReducer,
  users  : usersReducer, 
  favorites: favoritesReducer,     
  // Se tiver outros slices no futuro (ex: user, auth, beats), adicione-os aqui
  // user: userReducer,
  // auth: authReducer,
});

export default rootReducer;