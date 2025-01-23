import React, { useState, useEffect } from 'react';
import NavigationBar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCircle, faBars } from '@fortawesome/free-solid-svg-icons';
import { Message, User } from '../../types';
import { dummyMessages, dummyUsers } from '../../data/dummyData';

interface ChatLayoutProps {
    onLogout: () => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ onLogout }) => {
    const [messages, setMessages] = useState<Message[]>(dummyMessages);
    const [newMessage, setNewMessage] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    // Get initial sidebar state from localStorage or default to false
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved ? JSON.parse(saved) : false;
    });

    // Save sidebar state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(isLeftSidebarCollapsed));
    }, [isLeftSidebarCollapsed]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() && selectedUser) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            const newMsg: Message = {
                id: messages.length + 1,
                senderId: currentUser.id,
                content: newMessage,
                timestamp: new Date()
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return '#28a745';
            case 'away': return '#ffc107';
            default: return '#dc3545';
        }
    };

    const filteredMessages = selectedUser
        ? messages.filter(msg =>
            msg.senderId === selectedUser.id ||
            msg.senderId === JSON.parse(localStorage.getItem('currentUser') || '{}').id
        )
        : [];

    const toggleLeftSidebar = () => {
        setIsLeftSidebarCollapsed((prev: boolean) => !prev);
    };

    return (
        <div className={`app ${isLeftSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <NavigationBar onLogout={onLogout} />
            <div className="main-container">
                {/* Toggle button for collapsed state */}
                <div
                    className="sidebar-toggle-button"
                    onClick={toggleLeftSidebar}
                >
                    <FontAwesomeIcon icon={faBars} />
                </div>

                {/* Left Sidebar - Contact List */}
                <div className={`left-sidebar ${isLeftSidebarCollapsed ? 'collapsed' : ''}`}>
                    <div className="sidebar-header">
                        <div className="d-flex align-items-center">
                            <h5 className="m-3">Users</h5>
                            <FontAwesomeIcon
                                icon={faBars}
                                className="ms-auto me-3"
                                style={{ cursor: 'pointer' }}
                                onClick={toggleLeftSidebar}
                            />
                        </div>
                    </div>
                    <div className="contacts-list">
                        {dummyUsers.map(user => (
                            <div
                                key={user.id}
                                className={`contact-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                                onClick={() => setSelectedUser(user as User)}
                            >
                                <FontAwesomeIcon icon={faUser} className="me-2" />
                                {!isLeftSidebarCollapsed && <span>{user.name}</span>}
                                {!isLeftSidebarCollapsed && (
                                    <FontAwesomeIcon
                                        icon={faCircle}
                                        className="ms-auto"
                                        style={{
                                            color: getStatusColor(user.status || 'offline'),
                                            fontSize: '0.5rem'
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <main className={`content ${isLeftSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    {selectedUser ? (
                        <div className="chat-container">
                            <div className="chat-header">
                                <h6 className="m-3">
                                    Chatting with {selectedUser.name}
                                    <span className="ms-2" style={{ fontSize: '0.8rem', color: getStatusColor(selectedUser.status || 'offline') }}>
                                        ● {selectedUser.status}
                                    </span>
                                </h6>
                            </div>
                            <div className="messages">
                                {filteredMessages.map(msg => (
                                    <div key={msg.id} className={`message ${msg.senderId === JSON.parse(localStorage.getItem('currentUser') || '{}').id ? 'sent' : 'received'}`}>
                                        <div className="message-content">{msg.content}</div>
                                        <div className="message-time">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="message-input">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button className="btn btn-primary" onClick={handleSendMessage}>
                                    Send
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="chat-container d-flex align-items-center justify-content-center">
                            <div className="text-center text-muted">
                                <FontAwesomeIcon icon={faUser} size="3x" className="mb-3" />
                                <h5>Select a contact to start chatting</h5>
                            </div>
                        </div>
                    )}
                </main>

                {/* Right Sidebar - Online Users */}
                <div className="right-sidebar">
                    <div className="sidebar-header">
                        <h5 className="m-3">Online Users</h5>
                    </div>
                    <div className="online-users">
                        {dummyUsers.filter(user => user.status === 'online').map(user => (
                            <div key={user.id} className="user-item">
                                <FontAwesomeIcon icon={faUser} className="me-2" />
                                <span>{user.name}</span>
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    className="ms-auto"
                                    style={{ color: '#28a745', fontSize: '0.5rem' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default ChatLayout; 