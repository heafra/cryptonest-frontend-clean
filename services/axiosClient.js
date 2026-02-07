// services/axiosClient.js
import axios from "axios";

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ✅ send HTTP-only cookies automatically
});

// Optional: intercept responses for 401 (unauthenticated) to handle auto-logout or refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or not authenticated
      // You can add logic here to redirect to login or refresh token
      console.warn("Unauthorized request - redirecting to login...");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;