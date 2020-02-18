import {axios} from "../constant";

const _updateToken = token => {
  return {
    type: axios.UPDATE_TOKEN,
    payload: {
      token
    }
  };
};

export const updateToken = (token) => {
  return dispatch => {
    dispatch(_updateToken(token));
  };
};
