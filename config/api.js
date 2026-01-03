
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Inject JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('odoodo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      alert("Cannot connect to server. Is the backend running on port 5000?");
    }
    
    // Optional: Auto-logout on 401
    if (error.response?.status === 401) {
      localStorage.removeItem('odoodo_token');
      localStorage.removeItem('odoodo_user');
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default api;
