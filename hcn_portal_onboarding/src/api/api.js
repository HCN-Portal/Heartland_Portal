import axios from "axios";
const local = 'http://localhost:5001'
const production = ''
const api = axios.create({
    baseURL: `${local}/api`,
})

// Attach token automatically for every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
