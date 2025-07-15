// src/redux/rootReducer.ts
import { combineReducers } from 'redux';
import playerReducer from './playerSlice';
import usersReducer  from './userSlice';   //  ✅  novo import

const rootReducer = combineReducers({
  player: playerReducer,
  users  : usersReducer,      
  // Se tiver outros slices no futuro (ex: user, auth, beats), adicione-os aqui
  // user: userReducer,
  // auth: authReducer,
});

export default rootReducer;