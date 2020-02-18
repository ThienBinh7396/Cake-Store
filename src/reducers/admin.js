import { admin } from "../constant";
import cookie from "../utils/cookie";
import Axios from "axios";

let _instance = Axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: {
    "x-access-token": cookie.getCookie("_atk")
  }
});

const initializeState = {
  instance: null,
  axios: _instance
};

const reducer = (state = initializeState, action) => {
  switch (action.type) {
    case admin.UPDATE_ADMIN_INSTANCE: {
      let _admin = { ...action.payload };

      cookie.setCookie("_admin", _admin);

      return {
        ...state,
        instance: {
          ..._admin
        }
      };
    }
    case admin.UPDATE_ADMIN_TOKEN: {
      const {token} = action.payload; 

      cookie.setCookie('_atk', token);
      if(!token){
        cookie.setCookie('_admin', token);
      }
      
      let instance = Axios.create({
        baseURL: "http://localhost:5000/api/",
        headers: {
          "x-access-token": token
        }
      });
      

      return {
        ...state,
        axios: instance
      }
    }
    default:
      return state;
  }
};

export default reducer;
