import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1", // Change this to your backend URL
  withCredentials: true, // If you use cookies
});

export default api;
