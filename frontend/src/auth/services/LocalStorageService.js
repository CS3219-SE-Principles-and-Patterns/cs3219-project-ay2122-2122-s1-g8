const LocalStorageService = () => {
    var _service;

    function _getService() {
        if(!_service) {
            _service = this;
            return _service
        }
        return _service
    }

    function _setToken(tokenObj) {
        localStorage.setItem('access_token', tokenObj.accessToken)
    }

    function _getAccessToken() {
        return localStorage.getItem('access_token');
    }

    function _clearToken() {
        localStorage.removeItem('access_token');
    }

    function _isAuth() {
        return (localStorage.getItem("access_token") !== null)
    }
    return {
        getService : _getService,
        setToken : _setToken,
        getAccessToken : _getAccessToken,
        clearToken : _clearToken,
        isAuth: _isAuth
    }
}

export default LocalStorageService()