import axios from "axios";



const axiosClient = axios.create({

  baseURL: "https://api.cryptonep.com/api", // adjust if needed

  withCredentials: true, // send cookies

  headers: {

    "Content-Type": "application/json",

  },

});



// REQUEST LOGGING

axiosClient.interceptors.request.use(

  (config) => {

    console.log("➡️ Axios Request:", {

      url: config.url,

      method: config.method,

      headers: config.headers,

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

    console.error("❌ Axios Response Error:", error.response?.data || error.message);

    return Promise.reject(error);

  }

);



export default axiosClient;

