import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust to your backend port
  withCredentials: true, // optional, if you're using cookies
});
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // where you saved token at login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



export default instance;
