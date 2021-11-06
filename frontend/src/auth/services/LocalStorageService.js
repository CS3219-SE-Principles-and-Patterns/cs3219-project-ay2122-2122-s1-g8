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

  function _setRefreshToken(tokenObj) {
    localStorage.setItem("refresh_token", tokenObj.refreshToken);
  }

  function _setUserID(tokenObj) {
    localStorage.setItem("user_id", tokenObj.username);
  }

  function _getUserID() {
    return localStorage.getItem("user_id");
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

  function _getRefreshToken() {
    localStorage.getItem("refresh_token");
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
    setRefreshToken: _setRefreshToken,
    getAccessToken: _getAccessToken,
    getRefreshToken: _getRefreshToken,
    clearToken: _clearToken,
    isAuth: _isAuth,
    setUserID: _setUserID,
    getUserID: _getUserID,
    clearUserID: _clearUserID,
  };
};

export default LocalStorageService();
