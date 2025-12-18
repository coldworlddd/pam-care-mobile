import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:4321';

export const api = axios.create({
    baseURL: BASE_URL,
});

// Add a request interceptor for auth tokens if needed in the future
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
