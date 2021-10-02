import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3030/api',
})


// Account registration and login
export const registerAccount = payload => api.post(`/register`, payload)
export const loginAccount = payload => api.post(`/login`, payload)

const apis = {
    registerAccount,
    loginAccount,
}

export default apis