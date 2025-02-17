import { axiosInstance } from "../../axiosService";

export const userService = {
    getUser: async () => {
        const response = await axiosInstance.get('/api/users/me');
        return response;
    },
    getAllUsers: async () => {
        const response = await axiosInstance.get('/api/users/all');
        return response;
    },
    searchUsers: async (searchTerm: string) => {
        const response = await axiosInstance.post('/api/users/search', {
            searchTerm,
        });
        return response;
    },
};
