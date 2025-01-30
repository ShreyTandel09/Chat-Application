import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Form, InputGroup } from 'react-bootstrap';
import { User } from '../../types';

interface LeftSidebarProps {
    users: User[];
    selectedUser: User | null;
    onSelectUser: (user: User) => void;
    isCollapsed: boolean;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
    users,
    selectedUser,
    onSelectUser,
    isCollapsed
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return '#28a745';
            case 'away': return '#ffc107';
            default: return '#dc3545';
        }
    };

    return (
        <div className={`left-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header p-3">
                <h5 className="mb-3">Chats</h5>
                <InputGroup className="mb-2">
                    <InputGroup.Text>
                        <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Search users..."
                        aria-label="Search users"
                    />
                </InputGroup>
            </div>
            <div className="contacts-list">
                {users.map(user => (
                    <div
                        key={user.id}
                        className={`contact-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                        onClick={() => onSelectUser(user)}
                    >
                        <div className="contact-avatar">
                            <FontAwesomeIcon icon={faUser} className="avatar-icon" />
                            <FontAwesomeIcon
                                icon={faCircle}
                                className="status-indicator"
                                style={{ color: getStatusColor(user.status || 'offline') }}
                            />
                        </div>
                        {!isCollapsed && (
                            <div className="contact-info">
                                <div className="contact-name">{user.name}</div>
                                <div className="contact-status">
                                    {user.status === 'online' ? 'Active now' : 'Offline'}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeftSidebar; 