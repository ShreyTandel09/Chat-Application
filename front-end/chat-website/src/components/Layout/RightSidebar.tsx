import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Form, InputGroup } from 'react-bootstrap';
import { User } from '../../types';

interface RightSidebarProps {
    users: User[];
    selectedUser: User | null;
    onSelectUser: (user: User) => void;
    isCollapsed: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
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
        <div className="users-list">
            <div className="sidebar-header">
                <h5 className="m-3">Users</h5>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="search-input"
                    />
                </div>
            </div>
            <div className="users-container">
                {users.map(user => (
                    <div
                        key={user.id}
                        className={`user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                        onClick={() => onSelectUser(user)}
                    >
                        <div className="user-avatar">
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div className="user-info">
                            <div className="user-name">{user.name}</div>
                            <div className="user-status">
                                {user.status === 'online' ? 'Active now' : 'Offline'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RightSidebar; 