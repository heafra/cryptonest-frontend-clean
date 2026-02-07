import axios from "axios";



const axiosClient = axios.create({

  baseURL: "https://api.cryptonep.com", // ✅ FIXED

  withCredentials: true,

  headers: {

    "Content-Type": "application/json",

  },

});



// REQUEST LOGGING

axiosClient.interceptors.request.use(

  (config) => {

    console.log("➡️ Axios Request:", {

      fullURL: `${config.baseURL}${config.url}`, // 👈 helpful

      method: config.method,

      data: config.data,

    });

    return config;

  },

  (error) => {

    console.error("❌ Axios Request Error:", error);

    return Promise.reject(error);

  }

);



// RESPONSE LOGGING

axiosClient.interceptors.response.use(

  (response) => {

    console.log("⬅️ Axios Response:", {

      url: response.config.url,

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