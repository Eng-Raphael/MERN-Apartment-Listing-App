
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001',
    withCredentials: true, // if you ever use cookies
});

export default api;
