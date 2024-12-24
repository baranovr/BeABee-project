import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://beabee-service.online/api/',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
