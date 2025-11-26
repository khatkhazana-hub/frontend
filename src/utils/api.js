// utils/api.js
import axios from "axios";

const envBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const baseURL = envBase.endsWith("/api") ? envBase : `${envBase}/api`;

const api = axios.create({
  baseURL,
  maxBodyLength: Infinity,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    let token = localStorage.getItem("adminToken");
    if (token) {
      token = token.replace(/^"|"$/g, "").trim(); 
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
