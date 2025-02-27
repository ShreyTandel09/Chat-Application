import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthFormData } from '../../types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/api/authApi/authService';
import Loader from '../Common/Loader';
import { useDispatch } from 'react-redux';
import { login, setAccessToken, setCurrentUser, setIsAuthenticated, setRefreshToken } from '../../redux/slices/auth/authSlice';
import socketService from '../../services/socketService';


const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<AuthFormData>({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignUp = () => {
        navigate('/signup');
    }

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        // Password validation
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.signin(formData);
            if (response.status === 200) {
                dispatch(login(response.data.user));
                console.log(response.data);
                dispatch(setAccessToken(response.data.accessToken));
                dispatch(setRefreshToken(response.data.refreshToken));
                dispatch(setCurrentUser(response.data.user));
                toast.success('Login successful!');
                dispatch(setIsAuthenticated(true));
                socketService.registerUser(response.data.user.id);
                navigate('/chat');
            }
        } catch (error: any) {
            if (error.is_verified === false) {
                toast.error(error.message);
                navigate('/verify-email');
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error('An error occurred during sign in');
            }
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Loader loading={loading} />

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
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required
                                            />
                                            <span
                                                className="input-group-text"
                                                onClick={togglePasswordVisibility}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                            </span>
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
                                    <p className="text-center mb-0">
                                        <Button variant="link" className="p-0" onClick={handleForgotPassword}>
                                            Forgot Password
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

export default SignIn; 