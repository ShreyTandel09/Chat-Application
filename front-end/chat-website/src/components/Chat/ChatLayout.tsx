import React, { useState, useEffect } from 'react';
import NavigationBar from '../Layout/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faComments } from '@fortawesome/free-solid-svg-icons';
import { Message, User } from '../../types';
import RightSidebar from '../Layout/RightSidebar';
import LeftSidebar from '../Layout/LeftSidebar';
import '../../styles/chat.css';
import { chatService } from '../../services/api/chat/chatService';
import { useSelector } from 'react-redux';
import { currentUser } from '../Common/commonData';

interface ChatLayoutProps {
    onLogout: () => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ onLogout }) => {
    const conversations = useSelector((state: any) => state.conversation.conversations);
    const [messages, setMessages] = useState<Message[]>([]);
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
                console.log(response.data.messagesHistory);
                setMessages(response.data.messagesHistory || []);
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

    const handleSendMessage = async () => {
        console.log("in handle send message");
        if (newMessage.trim() && selectedUser) {
            const conversationData = JSON.parse(localStorage.getItem('persist:chat') || '{}');
            const newMsg = {
                conversationId: JSON.parse(conversationData.conversations).id,
                senderId: currentUser.id,
                receiverId: selectedUser.id,
                message: newMessage.trim(),
            };

            await chatService.sendMessage(newMsg);
            setMessages([]);
            getConversation();
            setNewMessage('');
        }
    };

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
                                    {messages.map(msg => (
                                        <div
                                            key={msg.id}
                                            className={`message ${msg.sender_id === currentUser.id ? 'sent' : 'received'}`}
                                        >
                                            <div className="message-bubble">
                                                <p>{msg.message}</p>
                                                <span className="message-time">
                                                    {new Date(msg.created_at).toLocaleTimeString([], {
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
                                        onClick={() => handleSendMessage()}
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