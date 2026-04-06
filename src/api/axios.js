import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.MODE === 'development' 
        ? 'http://localhost:5000/api' 
        : 'https://artheron-backend.vercel.app/api',
});

// Add a request interceptor to include the JWT token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('artheron_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;
