import axiosInstance from "./axios";

export const authApi = {
    register: async (userData) => {
        const { data } = await axiosInstance.post("/auth/register", userData);
        return data;
    },

    login: async (credentials) => {
        const { data } = await axiosInstance.post("/auth/login", credentials);
        return data;
    },

    getMe: async () => {
        const { data } = await axiosInstance.get("/auth/me");
        return data;
    },

    logout: async () => {
        const { data } = await axiosInstance.post("/auth/logout");
        return data;
    }
};
