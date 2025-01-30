import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../Common/Loader';
import { authService } from '../../services/api/authApi/authService';

interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ResetPasswordFormData>({
        password: '',
        confirmPassword: ''
    });

    // Get token from URL query parameters
    const token = new URLSearchParams(location.search).get('token');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error('Invalid reset token');
            navigate('/forgot-password');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.resetPassword(token, formData.password);
            if (response.status === 200) {
                toast.success(response.data.message || 'Password reset successfully');
                navigate('/signin');
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to reset password');
            }
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = () => {
        navigate('/signin');
    };

    return (
        <>
            <Loader loading={loading} />
            <Container fluid className="auth-container">
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col xs={11} sm={8} md={6} lg={4}>
                        <Card className="shadow-lg border-0">
                            <Card.Body className="p-5">
                                <h2 className="text-center mb-4">Reset Password</h2>
                                <p className="text-center mb-4">
                                    Enter your new password below.
                                </p>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4">
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faLock} />
                                            </span>
                                            <Form.Control
                                                type="password"
                                                placeholder="New Password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required
                                                minLength={6}
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
                                                placeholder="Confirm New Password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </Form.Group>

                                    <Button variant="primary" type="submit" className="w-100 mb-3">
                                        Reset Password
                                    </Button>

                                    <p className="text-center mb-0">
                                        Remember your password?{' '}
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

export default ResetPassword; 