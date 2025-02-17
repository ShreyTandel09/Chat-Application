import { axiosInstance } from "../../axiosService";

export const chatService = {
    createConversation: async (data: any) => {
        const response = await axiosInstance.post('/api/chat/create-conversation', data);
        return response;
    },
    getConversations: async () => {
        const response = await axiosInstance.get('/api/chat/get-conversations');
        return response;
    },
};
