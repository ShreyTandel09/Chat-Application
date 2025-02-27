import { axiosInstance } from "../../axiosService";
import socketService from "../../socketService";

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
    sendMessage: (data: any) => {
        socketService.sendMessage(data);
        return { status: 'pending' }; // Return a placeholder response
    },
    joinConversation: (conversationId: number) => {
        socketService.joinConversation(conversationId);
    }
};
