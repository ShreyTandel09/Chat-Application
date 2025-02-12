import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faSignOutAlt,
    faCog,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

interface NavigationBarProps {
    onLogout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onLogout }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigate = (path: string) => {
        navigate(path);
        setShowDropdown(false);
    };

    return (
        <Navbar className="custom-navbar" fixed="top" expand="lg">
            <Container fluid>
                <div className="d-flex align-items-center">
                    <Navbar.Brand href="/chat" className="brand-logo">
                        <span className="brand-text">Chat App</span>
                    </Navbar.Brand>
                </div>

                <Nav className="ms-auto align-items-center">
                    <div className="user-profile" ref={dropdownRef}>
                        <div
                            className="user-avatar-wrapper"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <div className="user-avatar">
                                {currentUser.avatar ? (
                                    <img src={currentUser.avatar} alt="Profile" />
                                ) : (
                                    <FontAwesomeIcon icon={faUser} />
                                )}
                            </div>
                            <span className="user-name">
                                {currentUser.first_name} {currentUser.last_name}
                            </span>
                        </div>

                        {showDropdown && (
                            <div className="custom-dropdown">
                                <div
                                    className="dropdown-item"
                                    onClick={() => handleNavigate('/profile')}
                                >
                                    <FontAwesomeIcon icon={faUser} className="me-2" />
                                    Profile
                                </div>
                                <div
                                    className="dropdown-item"
                                    onClick={() => handleNavigate('/settings')}
                                >
                                    <FontAwesomeIcon icon={faCog} className="me-2" />
                                    Settings
                                </div>
                                <div className="dropdown-divider" />
                                <div
                                    className="dropdown-item"
                                    onClick={() => {
                                        onLogout();
                                        setShowDropdown(false);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavigationBar; 