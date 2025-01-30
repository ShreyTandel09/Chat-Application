import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faCog } from '@fortawesome/free-solid-svg-icons';

interface NavigationBarProps {
    onLogout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onLogout }) => {
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');

    return (
        <Navbar bg="primary" variant="dark" fixed="top" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand href="/chat" className="d-flex align-items-center">
                    <img
                        src="/chat-logo.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top me-2"
                        alt="Chat App Logo"
                    />
                    Chat App
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <NavDropdown
                            title={
                                <span>
                                    <FontAwesomeIcon icon={faUser} className="me-2" />
                                    {currentUser.first_name} {currentUser.last_name}
                                </span>
                            }
                            id="basic-nav-dropdown"
                        >
                            <NavDropdown.Item href="/profile">
                                <FontAwesomeIcon icon={faUser} className="me-2" />
                                Profile
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/settings">
                                <FontAwesomeIcon icon={faCog} className="me-2" />
                                Settings
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={onLogout}>
                                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar; 