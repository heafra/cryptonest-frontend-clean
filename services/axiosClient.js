import axios from "axios";



const axiosClient = axios.create({

  baseURL:

    process.env.NEXT_PUBLIC_API_URL ||

    "https://api.cryptonep.com/api",

  withCredentials: true, // 🔥 REQUIRED for cookies + body

  headers: {

    "Content-Type": "application/json",

  },

});



export default axiosClient;