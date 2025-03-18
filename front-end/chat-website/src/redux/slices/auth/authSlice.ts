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
            state.accessToken = null;
            state.refreshToken = null;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setRefreshToken: (state, action) => {
            state.refreshToken = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        }
    },
});

export const { login, logout, setAccessToken, setRefreshToken, setCurrentUser, setIsAuthenticated } = authSlice.actions;
export default authSlice.reducer;
