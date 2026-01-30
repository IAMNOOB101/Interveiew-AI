import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true // Required for JWT cookie authentication
});

export default api;
