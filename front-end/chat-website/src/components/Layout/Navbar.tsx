import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';

interface NavigationBarProps {
    onLogout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onLogout }) => {
    return (
        <Navbar bg="primary" variant="dark" fixed="top" expand="lg">
            <Container>
                <Navbar.Brand href="#home">Chat App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        {/* <Nav.Link href="#profile">Profile</Nav.Link> */}
                        {/* <Nav.Link href="#settings">Settings</Nav.Link> */}
                        <Nav.Link onClick={onLogout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar; 