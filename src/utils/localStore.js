const localStore = {
  setDataStorage: (key, value) => {
    if (value !== undefined || value !== null) {
      localStorage.setItem(key, escape(JSON.stringify(value)));
    } else {
      localStorage.removeItem(key);
    }
  },
  getDataStorage: key => {
    try {
      let _value = localStorage.getItem(key);

      _value =
        _value !== null && _value !== undefined
          ? JSON.parse(unescape(_value))
          : null;
      return _value;
    } catch (error) {
      return null;
    }
  }
};

export default localStore;
