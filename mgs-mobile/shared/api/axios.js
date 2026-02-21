import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// Interceptor for attaching tokens (to be implemented with SecureStore)
axiosInstance.interceptors.request.use(
    async (config) => {
        // TODO: Get token from SecureStore and attach as Bearer
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
