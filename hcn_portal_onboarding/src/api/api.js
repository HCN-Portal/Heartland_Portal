import axios from "axios";
const local = 'http://localhost:5000'
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

// Handle response errors, especially 401 (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.error || '';
      
      // Check if it's specifically a token expiration/invalid error
      if (errorMessage.includes('Invalid or expired token') || 
          errorMessage.includes('Please log in first')) {
        
        // Clear all authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        
        // Remove authorization header
        delete api.defaults.headers.common['Authorization'];
        
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
