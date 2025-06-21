// src/redux/rootReducer.ts
import { combineReducers } from 'redux';
import playerReducer from './playerSlice';

const rootReducer = combineReducers({
  player: playerReducer,
  // Se tiver outros slices no futuro (ex: user, auth, beats), adicione-os aqui
  // user: userReducer,
  // auth: authReducer,
});

export default rootReducer;