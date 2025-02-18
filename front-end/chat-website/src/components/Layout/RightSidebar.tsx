import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../types';
import { userService } from '../../services/api/users/userService';
import { chatService } from '../../services/api/chat/chatService';
import { useDispatch, useSelector } from 'react-redux';
import { setConversations } from '../../redux/slices/chat/conversationSlice';

interface RightSidebarProps {
    selectedUser: User | null;
    onSelectUser: (user: User) => void;
    isCollapsed: boolean;
    onGetConversation: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
    selectedUser,
    onSelectUser,
    onGetConversation,
}) => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const currentUser = useSelector((state: any) => state.auth.currentUser);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await userService.getAllUsers();
                setUsers(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const searchUsers = async (searchTerm: string) => {
        const response = await userService.searchUsers(searchTerm);
        setUsers(response.data.data);
    };

    const createConversation = async (user: User) => {
        const data = {
            clientId1: user.id,
            clientId2: currentUser.id,
        };
        const response = await chatService.createConversation(data);
        dispatch(setConversations(response.data.data));
        onGetConversation();
    };

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
                        onChange={(e) => {
                            searchUsers(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="users-container">
                {users.map((user: User) => (
                    <div
                        key={user.id}
                        className={`user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                        onClick={() => {
                            onSelectUser(user);
                            createConversation(user);
                        }}
                    >
                        <div className="user-avatar">
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div className="user-info">
                            <div className="user-name">{user.first_name} {user.last_name}</div>
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