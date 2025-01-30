import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { SignUpFormData } from '../../types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../Common/Loader';
import { authService } from '../../services/api/authApi/authService';

interface SignUpProps {
    onToggleAuth: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onToggleAuth }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<SignUpFormData>({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        re_password: ''
    });

    const handleSignIn = () => {
        navigate('/login');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (formData.password !== formData.re_password) {
            toast.error("Passwords don't match!");
            return;
        }

        setLoading(true);
        try {
            const response = await authService.signup(formData);
            if (response.status === 201) {
                toast.success('Registration successful! Please verify your email.');
                navigate('/verify-email');
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An error occurred during registration');
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Loader loading={loading} />
            <Container fluid className="auth-container">
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col xs={11} sm={8} md={6} lg={4}>
                        <Card className="shadow-lg border-0">
                            <Card.Body className="p-5">
                                <h2 className="text-center mb-4">Create Account</h2>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4">
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faUser} />
                                            </span>
                                            <Form.Control
                                                type="text"
                                                placeholder="First Name"
                                                value={formData.first_name}
                                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faUser} />
                                            </span>
                                            <Form.Control
                                                type="text"
                                                placeholder="Last Name"
                                                value={formData.last_name}
                                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </Form.Group>

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

                                    <Form.Group className="mb-4">
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faLock} />
                                            </span>
                                            <Form.Control
                                                type="password"
                                                placeholder="Confirm Password"
                                                value={formData.re_password}
                                                onChange={(e) => setFormData({ ...formData, re_password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </Form.Group>

                                    <Button variant="primary" type="submit" className="w-100 mb-3" >
                                        Sign Up
                                    </Button>

                                    <p className="text-center mb-0">
                                        Already have an account?{' '}
                                        <Button variant="link" className="p-0" onClick={handleSignIn}>
                                            Sign In
                                        </Button>
                                    </p>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default SignUp; 