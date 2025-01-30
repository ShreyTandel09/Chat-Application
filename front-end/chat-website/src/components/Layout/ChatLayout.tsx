import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faPaperPlane,
    faUser,
    faEllipsisV
} from '@fortawesome/free-solid-svg-icons';

const ChatLayout: React.FC = () => {
    const [message, setMessage] = useState('');

    return (
        <div className="app-container">
            <div className="chat-wrapper">
                <div className="sidebar">
                    <div className="sidebar-header">
                        <h5 className="mb-3">Messages</h5>
                        <div className="search-box">
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                            <Form.Control
                                type="text"
                                placeholder="Search contacts..."
                            />
                        </div>
                    </div>

                    <div className="contact-list">
                        {/* Contact items */}
                        <div className="contact-item active">
                            <div className="contact-avatar">
                                <div className="avatar-circle">
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <span className="status-dot online"></span>
                            </div>
                            <div className="contact-info">
                                <h6 className="mb-1">John Doe</h6>
                                <small className="text-muted">Online</small>
                            </div>
                        </div>
                        {/* More contact items */}
                    </div>
                </div>

                <div className="chat-area">
                    <div className="chat-header">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <div className="avatar-circle me-2">
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <div>
                                    <h6 className="mb-0">John Doe</h6>
                                    <small className="text-success">Online</small>
                                </div>
                            </div>
                            <Button variant="light">
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </Button>
                        </div>
                    </div>

                    <div className="messages-container">
                        {/* Messages */}
                        <div className="message-bubble">
                            <div className="message-content">
                                Hello! How are you?
                            </div>
                            <div className="message-time">
                                10:30 AM
                            </div>
                        </div>
                        <div className="message-bubble sent">
                            <div className="message-content">
                                I'm good, thanks! How about you?
                            </div>
                            <div className="message-time">
                                10:31 AM
                            </div>
                        </div>
                    </div>

                    <div className="chat-input">
                        <InputGroup>
                            <Form.Control
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button variant="primary">
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </Button>
                        </InputGroup>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatLayout; 