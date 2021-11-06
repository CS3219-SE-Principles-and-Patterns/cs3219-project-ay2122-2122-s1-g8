import axios from "axios";

const api = axios.create({
  baseURL: "https://peerprep.herokuapp.com/api",
  // baseURL: "http://192.168.0.103:3030/api",
  // baseURL: "http://127.0.0.1:3030/api",
});
// Account registration and login
export const registerAccount = (payload) => api.post(`/register`, payload);
export const loginAccount = (payload) => api.post(`/login`, payload);
export const updateUserStatus = (payload) => api.post(`/updateStatus`, payload);

// Question
export const fetchQuestion = (payload) =>
  api.get("/question/" + payload.id, { headers: payload });
export const updateQuestionType = (payload) =>
  api.post(`/updateQuestionType`, payload);  

// Match
export const newMatch = (payload) => api.post("/match/new", payload);
export const matchStatus = (payload) => api.post("/match/status", payload);
export const dropMatch = (payload) => api.post("/match/drop", payload);
export const getRoom = (id) => api.get(`/room/${id}`);
//export const getChat = () => api.get("/chat");

// Token
export const refreshToken = (payload) => api.post("/token", payload);

const apis = {
  registerAccount,
  loginAccount,
  updateUserStatus,
  updateQuestionType,
  fetchQuestion,
  newMatch,
  matchStatus,
  dropMatch,
  getRoom,
  refreshToken,
  //getChat,
};

export default apis;
