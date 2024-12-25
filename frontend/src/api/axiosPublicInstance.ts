import axios from 'axios';

const axiosPublicInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

export default axiosPublicInstance;
