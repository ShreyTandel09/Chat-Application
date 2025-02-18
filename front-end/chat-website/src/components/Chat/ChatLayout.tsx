import React, { useState, useEffect } from 'react';
import NavigationBar from '../Layout/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faComments, faCog, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { Conversation, Message, User } from '../../types';
import { dummyMessages, dummyUsers } from '../../data/dummyData';
import RightSidebar from '../Layout/RightSidebar';
import LeftSidebar from '../Layout/LeftSidebar';
import '../../styles/chat.css';
import { chatService } from '../../services/api/chat/chatService';
import { useSelector } from 'react-redux';

interface ChatLayoutProps {
    onLogout: () => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ onLogout }) => {
    const conversations = useSelector((state: any) => state.conversation.conversations);
    const [messages, setMessages] = useState<Message[]>(dummyMessages);
    const [newMessage, setNewMessage] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState<'chats' | 'settings' | 'payments'>('chats');
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved ? JSON.parse(saved) : false;
    });


    const getConversation = async () => {
        try {
            const response = await chatService.getConversations(conversations.id);
            if (response.data) {
                setMessages(response.data.messages || []);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(isLeftSidebarCollapsed));
    }, [isLeftSidebarCollapsed]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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

    const filteredMessages = selectedUser
        ? messages.filter(msg =>
            msg.senderId === selectedUser.id ||
            msg.senderId === JSON.parse(localStorage.getItem('currentUser') || '{}').id
        )
        : [];

    const handleNavigate = (section: 'chats' | 'settings' | 'payments') => {
        setActiveSection(section);
    };

    return (
        <div className="app-container">
            <NavigationBar onLogout={onLogout} />
            <div className="main-content">
                <LeftSidebar
                    activeSection={activeSection}
                    onNavigate={handleNavigate}
                    isCollapsed={isLeftSidebarCollapsed}
                    onToggle={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
                />

                <main className="chat-main">
                    {activeSection === 'chats' ? (
                        selectedUser ? (
                            <div className="chat-area">
                                <div className="chat-header">
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            <FontAwesomeIcon icon={faUser} />
                                        </div>
                                        <div className="user-details">
                                            <h6>{selectedUser.first_name} {selectedUser.last_name}</h6>
                                            <span className="status">Active now</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="messages-container">
                                    {filteredMessages.map(msg => (
                                        <div
                                            key={msg.id}
                                            className={`message ${msg.senderId === JSON.parse(localStorage.getItem('currentUser') || '{}').id ? 'sent' : 'received'}`}
                                        >
                                            <div className="message-bubble">
                                                <p>{msg.content}</p>
                                                <span className="message-time">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="message-input-container">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <button
                                        className="send-button"
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-chat">
                                <FontAwesomeIcon icon={faComments} size="3x" />
                                <h5>Select a contact to start chatting</h5>
                            </div>
                        )
                    ) : (
                        <div className="empty-chat">
                            <FontAwesomeIcon icon={faComments} size="3x" />
                            <h5>Select a contact to start chatting</h5>
                        </div>
                    )}
                </main>

                {activeSection === 'chats' && (
                    <div className="users-sidebar">
                        <RightSidebar
                            selectedUser={selectedUser}
                            onSelectUser={setSelectedUser}
                            isCollapsed={false}
                            onGetConversation={getConversation}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatLayout; 