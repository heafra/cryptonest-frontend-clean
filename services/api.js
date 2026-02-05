import axios from "axios";



const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";



const axiosClient = axios.create({

  baseURL: API_URL,

  withCredentials: true, // for HTTP-only cookies

});



export const loginUser = (email, password) => axiosClient.post("/auth/login", { email, password });

export const signupUser = (email, password) => axiosClient.post("/auth/signup", { email, password });



export default axiosClient;

