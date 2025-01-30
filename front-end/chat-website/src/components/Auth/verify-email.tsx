import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons';

const VerifyEmail: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleResendEmail = () => {
        console.log('Resend email');
    };

    return (
        <Container fluid className="auth-container">
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col xs={11} sm={8} md={6} lg={4}>
                    <Card className="shadow-lg border-0 text-center">
                        <Card.Body className="p-5">
                            <div className="mb-4">
                                <FontAwesomeIcon
                                    icon={faEnvelopeOpen}
                                    size="3x"
                                    className="text-primary"
                                />
                            </div>
                            <h2 className="mb-3">Check Your Email</h2>
                            <p className="text-muted mb-4">
                                We've sent you an email with a link to verify your account.
                                Please check your inbox and click the link to continue.
                            </p>
                            <Button
                                variant="primary"
                                className="w-100 mb-3"
                                onClick={handleLogin}
                            >
                                Login
                            </Button>

                            <Button
                                variant="primary"
                                className="w-100 mb-3"
                                onClick={handleLogin}
                            >
                                Resend Email Verification Link
                            </Button>
                            <p className="text-muted small mb-0"
                                onClick={handleResendEmail}
                            >
                                Didn't receive the email? Check your spam folder or contact support.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default VerifyEmail; 