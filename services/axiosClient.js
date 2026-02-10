import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ✅ from Vercel env
  withCredentials: true, // ✅ REQUIRED for HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================
// REQUEST LOGGING
// =====================
axiosClient.interceptors.request.use(
  (config) => {
    console.log("➡️ Axios Request:", {
      method: config.method,
      url: `${config.baseURL}${config.url}`,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("❌ Axios Request Error:", error);
    return Promise.reject(error);
  }
);

// =====================
// RESPONSE LOGGING
// =====================
axiosClient.interceptors.response.use(
  (response) => {
    console.log("⬅️ Axios Response:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error(
      "❌ Axios Response Error:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default axiosClient;


