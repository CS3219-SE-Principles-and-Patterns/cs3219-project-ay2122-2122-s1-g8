import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3030/api",
});
const api2 = axios.create({
  baseURL: "http://localhost:3030/question",
});

// Account registration and login
export const registerAccount = (payload) => api.post(`/register`, payload);
export const loginAccount = (payload) => api.post(`/login`, payload);

// Question
export const fetchQuestion = (endpoint) => api2.get(endpoint);
const apis = {
  registerAccount,
  loginAccount,
  fetchQuestion,
};

export default apis;
