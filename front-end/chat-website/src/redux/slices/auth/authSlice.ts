import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        currentUser: null,
        accessToken: null,
        refreshToken: null,
    },
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.currentUser = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.currentUser = null;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setRefreshToken: (state, action) => {
            state.refreshToken = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        }
    },
});

export const { login, logout, setAccessToken, setRefreshToken, setCurrentUser } = authSlice.actions;
export default authSlice.reducer;
