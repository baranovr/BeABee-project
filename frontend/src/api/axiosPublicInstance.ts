import axios from 'axios';

const axiosPublicInstance = axios.create({
  baseURL: 'https://beabee-service.online/api/',
});

export default axiosPublicInstance;
