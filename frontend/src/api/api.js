import axios from "axios";

const api = axios.create({
  baseURL: "https://peerprep.herokuapp.com/api",
});
const api2 = axios.create({
  baseURL: "http://localhost:3030/question",
});

// Account registration and login
export const registerAccount = (payload) => api.post(`/register`, payload);
export const loginAccount = (payload) => api.post(`/login`, payload);

// Question
export const fetchQuestion = (endpoint) => api.get("/question/" + endpoint);
const apis = {
  registerAccount,
  loginAccount,
  fetchQuestion,
};

export default apis;
