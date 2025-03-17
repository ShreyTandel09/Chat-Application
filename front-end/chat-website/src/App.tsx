import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import VerifyEmail from './components/Auth/verify-email';
import './App.css';
import ChatLayout from './components/Chat/ChatLayout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './redux/store';
import { login, logout } from './redux/slices/auth/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/loader.css';
import ForgotPassword from './components/Auth/forgot-password';
import ResetPassword from './components/Auth/reset-password';
import socketService from './services/socketService';


const App: React.FC = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const dispatch = useDispatch();

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const root = document.documentElement;
            if (width >= 992 && width <= 1600) {
                root.style.setProperty('--page-scale', '0.9');
            } else if (width >= 700 && width <= 767) {
                root.style.setProperty('--page-scale', '0.8');
            } else if (width >= 600 && width < 700) {
                root.style.setProperty('--page-scale', '0.75');
            } else if (width <= 600) {
                root.style.setProperty('--page-scale', '0.5');
            } else {
                root.style.setProperty('--page-scale', '1');
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Check authentication status on component mount
    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (user) {
            dispatch(login(user));
        }
    }, [dispatch]);

    // Initialize socket when user is authenticated
    useEffect(() => {
        // socketService.connect();
        if (isAuthenticated && currentUser) {
            // Connect to socket
            const socket = socketService.connect(); // Re-register user
            console.log('Socket connected>>>>>>>>>>>:');
            if (socket) {
                socketService.registerUser(currentUser.id);
            }

        } else {
            // Disconnect socket when not authenticated
            socketService.disconnect();
            console.log('Socket disconnected');
        }
    }, [isAuthenticated, currentUser]);


    const handleLogout = () => {
        localStorage.removeItem('persist:auth');
        localStorage.removeItem('persist:conversation')
        dispatch(logout());
        socketService.disconnect();
        window.location.href = '/signin';
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <BrowserRouter>
                <Routes>
                    <Route path="/signin" element={
                        <SignIn />
                    } />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/signup" element={
                        <SignUp />
                    } />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/chat" element={
                        <ChatLayout onLogout={handleLogout} />
                    } />
                    <Route path="/" element={<Navigate to="/signin" replace />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App; 