import Axios from "axios";
import {axios} from "../constant";

import cookie from './../utils/cookie'

let _instance = Axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: {
    "x-access-token": cookie.getCookie('_atk')
  }
});

const initState = {
  instance: _instance
};


const reducer = (state = initState, action) => {
  switch (action.type) {
    case axios.UPDATE_TOKEN: {
      const {token} = action.payload; 

      let instance = Axios.create({
        baseURL: "http://localhost:5000/api/",
        headers: {
          "x-access-token": token
        }
      });

      cookie.setCookie('_atk', token);
      if(!token){
        cookie.setCookie('_admin', token);
      }
      return {
        ...state,
        instance
      };
    }
    default:
      return state;
  }
};

export default reducer;
