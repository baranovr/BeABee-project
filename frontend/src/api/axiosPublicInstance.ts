import axios from 'axios';

const axiosPublicInstance = axios.create({
  baseURL: 'http://13.48.24.31:8000/api/',
});

export default axiosPublicInstance;
