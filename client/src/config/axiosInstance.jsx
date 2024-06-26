import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://taskapp-api.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
