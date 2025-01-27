import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import VerifyEmail from './components/Auth/verify-email';
import './App.css';
import ChatLayout from './components/Chat/ChatLayout';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [showSignUp, setShowSignUp] = useState<boolean>(false);

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
            setIsAuthenticated(true);
        }
    }, []);

    // Handle logout globally
    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setIsAuthenticated(false);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={
                    isAuthenticated ?
                        <Navigate to="/chat" replace /> :
                        <SignIn onToggleAuth={() => setShowSignUp(true)} setIsAuthenticated={setIsAuthenticated} />
                } />
                <Route path="/verify-email" element={<VerifyEmail />} />

                <Route path="/signup" element={
                    isAuthenticated ?
                        <Navigate to="/verify-email" replace /> :
                        <SignUp onToggleAuth={() => setShowSignUp(false)} />
                } />
                <Route path="/chat" element={
                    isAuthenticated ?
                        <ChatLayout onLogout={handleLogout} /> :
                        <Navigate to="/login" replace />
                } />
                <Route path="/" element={<Navigate to="/chat" replace />} />
            </Routes>
            {/* <ChatLayout /> : */}

        </BrowserRouter>
    );
};

export default App; 