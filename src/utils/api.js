// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. http://localhost:8000/api
  maxBodyLength: Infinity,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    let token = localStorage.getItem("adminToken");
    if (token) {
      token = token.replace(/^"|"$/g, "").trim(); // strip quotes if any
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      // console.debug("Auth header set:", config.headers.Authorization); // uncomment to verify
    }
  }
  return config;
});

export default api;
