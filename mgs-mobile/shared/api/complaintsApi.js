import axiosInstance from "./axios";

export const complaintsApi = {
    submit: async (formData) => {
        const { data } = await axiosInstance.post("/complaints", formData);
        return data;
    },

    getMy: async () => {
        const { data } = await axiosInstance.get("/complaints/my");
        return data;
    },

    getById: async (id) => {
        const { data } = await axiosInstance.get(`/complaints/${id}`);
        return data;
    },

    validate: async (id) => {
        const { data } = await axiosInstance.post(`/complaints/${id}/validate`);
        return data;
    },
};
