import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // 🔥 points to VPS backend
  withCredentials: true, // 🔥 allows HTTP-only cookies
});

export default axiosClient;