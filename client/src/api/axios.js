import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // REQUIRED for HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
