import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Change this to your backend URL
  withCredentials: true, // If you use cookies
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // console.log("🚀 Outgoing token:", token); // DEBUG LINE
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
