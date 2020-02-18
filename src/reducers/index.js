import { combineReducers } from 'redux';
import axiosReducer from './axios'
import adminReducer from './admin'

const rootReducer = combineReducers({
  axios: axiosReducer,
  admin: adminReducer
})

export default rootReducer;