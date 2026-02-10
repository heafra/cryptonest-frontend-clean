import axios from "axios";



const axiosClient = axios.create({

  baseURL:

    process.env.NEXT_PUBLIC_API_URL || "https://api.cryptonep.com",

  withCredentials: true, // 🔑 REQUIRED for auth cookies

  headers: {

    "Content-Type": "application/json",

  },

  timeout: 15000, // prevents hanging requests

});



/* ======================

   REQUEST LOGGING

====================== */

axiosClient.interceptors.request.use(

  (config) => {

    console.log("➡️ Axios Request:", {

      fullURL: `${config.baseURL}${config.url}`,

      method: config.method?.toUpperCase(),

      data: config.data,

      withCredentials: config.withCredentials,

    });



    return config;

  },

  (error) => {

    console.error("❌ Axios Request Error:", error);

    return Promise.reject(error);

  }

);



/* ======================

   RESPONSE LOGGING

====================== */

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

    console.error("❌ Axios Response Error:", {

      url: error.config?.url,

      status: error.response?.status,

      data: error.response?.data,

    });



    return Promise.reject(error);

  }

);



export default axiosClient;



