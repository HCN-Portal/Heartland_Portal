import { combineReducers } from '@reduxjs/toolkit';
import appReducer from './reducers/appReducer';
import authReducer from './reducers/authReducer';

const rootReducer = combineReducers({
  application: appReducer,
  auth: authReducer
});

export default rootReducer;
