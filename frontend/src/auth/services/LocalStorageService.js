const LocalStorageService = () => {
  var _service;

  function _getService() {
    if (!_service) {
      _service = this;
      return _service;
    }
    return _service;
  }

  function _setToken(tokenObj) {
    localStorage.setItem("access_token", tokenObj.token);
  }

  function _setUserID(tokenObj) {
    localStorage.setItem("user_id", tokenObj.username);
  }

  function _getUserID() {
    var user_id = localStorage.getItem("user_id");
    return user_id;
  }

  function _clearUserID() {
    try {
      localStorage.removeItem("user_id");
    } catch (error) {
      console.error(error);
    }
  }

  function _getAccessToken() {
    return localStorage.getItem("access_token");
  }

  function _clearToken() {
    try {
      localStorage.removeItem("access_token");
    } catch (error) {
      console.error(error);
    }
  }

  function _isAuth() {
    return (
      localStorage.getItem("access_token") !== null &&
      localStorage.getItem("user_id") !== null
    );
  }
  return {
    getService: _getService,
    setToken: _setToken,
    getAccessToken: _getAccessToken,
    clearToken: _clearToken,
    isAuth: _isAuth,
    setUserID: _setUserID,
    getUserID: _getUserID,
    clearUserID: _clearUserID,
  };
};

export default LocalStorageService();
