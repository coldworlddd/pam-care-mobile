import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:4321';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor for auth tokens if needed in the future
api.interceptors.request.use(
    async (config) => {
        // const token = await getToken();
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
