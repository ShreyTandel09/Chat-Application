import { axiosInstance } from "../../axiosService";
import { AuthFormData, SignUpFormData } from "../../../types";

export const authService = {
    signup: async (data: SignUpFormData) => {
        const response = await axiosInstance.post('/api/auth/signup', data);
        return response;
    },
    resendEmailVerify: async (email: string) => {
        const response = await axiosInstance.post('/api/auth/resend-email-verify', { email });
        return response;
    },
    signin: async (data: AuthFormData) => {
        const response = await axiosInstance.post('/api/auth/signin', data);
        return response;
    },

    forgotPassword: async (email: string) => {
        const response = await axiosInstance.post('/api/auth/forgot-password', { email });
        return response;
    },
    resetPassword: (token: string, password: string) => {
        return axiosInstance.post(`/api/auth/reset-password?token=${token}`, { password });
    },
}