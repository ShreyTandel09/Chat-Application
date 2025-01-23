import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../types';

const RightSidebar: React.FC = () => {
    const activeUsers: User[] = [
        { id: 1, name: 'John Doe', status: 'online' },
        { id: 2, name: 'Jane Smith', status: 'away' },
        { id: 3, name: 'Mike Johnson', status: 'offline' },
    ];

    const getStatusColor = (status: 'online' | 'away' | 'offline'): string => {
        switch (status) {
            case 'online': return '#28a745';
            case 'away': return '#ffc107';
            default: return '#dc3545';
        }
    };

    return (
        <div className="right-sidebar">
            <h5 className="mb-3">Active Users</h5>
            <div className="active-users">
                {activeUsers.map(user => (
                    <div key={user.id} className="d-flex align-items-center mb-2">
                        <FontAwesomeIcon
                            icon={faCircle}
                            style={{ color: getStatusColor(user.status || 'offline') }}
                            className="me-2"
                            size="xs"
                        />
                        <span>{user.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RightSidebar; 