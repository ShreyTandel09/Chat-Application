import { axiosInstance } from "../../axiosService";

export const chatService = {
    createConversation: async (data: any) => {
        const response = await axiosInstance.post('/api/chat/create-conversation', data);
        return response;
    },
    getConversations: async (id: number) => {
        const response = await axiosInstance.get(`/api/chat/get-conversation?id=${id}`);
        console.log(response);
        return response;
    },
    sendMessage: async (data: any) => {
        const response = await axiosInstance.post('/api/chat/send-message', data);
        return response;
    }
};
