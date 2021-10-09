const JWTManager = () => {
    let JWTtoken = null

    const getToken = () => JWTtoken

    const setToken = (token) => {
        JWTtoken = token
        localStorage.setItem('token', token)
        return true
    }

    const deleteToken = () => {
        JWTtoken = null
        return true
    }

    return {
        deleteToken,
        getToken,
        setToken,
    }

}

export default JWTManager()
