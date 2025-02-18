import axios from 'axios';

export const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

axiosInstance.interceptors.request.use(
    (config) => {
        const resData = JSON.parse(localStorage.getItem('persist:chat') || '{}');
        const token = JSON.parse(resData.accessToken || 'null');
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong!';
        console.error('API Error:', errorMessage);
        return Promise.reject(error.response.data);
    }
);

