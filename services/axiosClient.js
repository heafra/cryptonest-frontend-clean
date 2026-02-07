import axios from "axios";



const axiosClient = axios.create({

  baseURL: "https://api.cryptonep.com/api",

  withCredentials: true,

});



axiosClient.interceptors.request.use((config) => {

  console.log("API REQUEST:", config.method, config.url, config.data);

  return config;

});



axiosClient.interceptors.response.use(

  (res) => {

    console.log("API RESPONSE:", res.status, res.data);

    return res;

  },

  (err) => {

    console.error("API ERROR:", err.response?.status, err.response?.data);

    return Promise.reject(err);

  }

);



export default axiosClient;