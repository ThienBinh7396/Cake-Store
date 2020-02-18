import { admin } from "../constant";

const _updateAdmin = value => {
  return {
    type: admin.UPDATE_ADMIN_INSTANCE,
    payload: {
      ...value
    }
  };
};

const _updateAdminToken = token => {
  return {
    type: admin.UPDATE_ADMIN_TOKEN,
    payload: {
      token
    }
  }
}

export const updateAdmin = value => {
  return dispatch => {
    dispatch(_updateAdmin(value));
  };
};

export const updateAdminToken = token => {
  return dispatch => {
    dispatch(_updateAdminToken(token));
  }
}
