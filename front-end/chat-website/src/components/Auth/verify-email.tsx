import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../Common/Loader';
import { authService } from '../../services/api/authApi/authService';

interface VerifyEmailFormData {
    email: string;
}

const VerifyEmail: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<VerifyEmailFormData>({
        email: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authService.resendEmailVerify(formData.email);
            if (response.status === 200) {
                toast.success(response.data.message || 'Verification email sent successfully');
                navigate('/signin');
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to send verification email');
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
                                <h2 className="text-center mb-4">Email Verification</h2>
                                <p className="text-center mb-4">
                                    Please check your email for verification link. If you haven't received it, you can request a new one.
                                </p>
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

                                    <Button variant="primary" type="submit" className="w-100 mb-3">
                                        Resend Verification Email
                                    </Button>

                                    <p className="text-center mb-0">
                                        Already verified?{' '}
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

export default VerifyEmail; 