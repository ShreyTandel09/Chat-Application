import { axiosInstance } from "../../axiosService";
import { SignUpFormData } from "../../../types";

export const authService = {
    signup: async (data: SignUpFormData) => {
        const response = await axiosInstance.post('/api/auth/signup', data);
        return response;
    }
}