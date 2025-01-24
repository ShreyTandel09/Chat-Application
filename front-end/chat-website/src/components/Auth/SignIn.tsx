import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { AuthFormData } from '../../types';
import { dummyUsers } from '../../data/dummyData';
import { useNavigate } from 'react-router-dom';

interface SignInProps {
    onToggleAuth: () => void;
    setIsAuthenticated: (value: boolean) => void;
}

const SignIn: React.FC<SignInProps> = ({ onToggleAuth, setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<AuthFormData>({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string>('');


    const handleSignUp = () => {
        navigate('/signup');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = dummyUsers.find(u => u.email === formData.email && u.password === formData.password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            setIsAuthenticated(true);
            navigate('/chat');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <Container fluid className="auth-container">
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col xs={11} sm={8} md={6} lg={4}>
                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-5">
                            <h2 className="text-center mb-4">Welcome Back!</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </span>
                                        <Form.Control
                                            type="email"
                                            placeholder="Email address"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FontAwesomeIcon icon={faLock} />
                                        </span>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                {error && <div className="alert alert-danger mb-3">{error}</div>}

                                <Button variant="primary" type="submit" className="w-100 mb-3">
                                    Sign In
                                </Button>

                                <p className="text-center mb-0">
                                    Don't have an account?{' '}
                                    <Button variant="link" className="p-0" onClick={handleSignUp}>
                                        Sign Up
                                    </Button>
                                </p>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SignIn; 