import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCog,
    faCreditCard,
    faComments,
    faChevronLeft,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons';

interface LeftSidebarProps {
    isCollapsed: boolean;
    onNavigate: (section: 'chats' | 'settings' | 'payments') => void;
    activeSection: 'chats' | 'settings' | 'payments';
    onToggle: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
    isCollapsed,
    onNavigate,
    activeSection,
    onToggle
}) => {

    const navigationItems = [
        { id: 'chats', icon: faComments, label: 'Chats' },
        { id: 'settings', icon: faCog, label: 'Settings' },
        { id: 'payments', icon: faCreditCard, label: 'Payments' }
    ];

    return (
        <div className={`navigation-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="nav-items">
                {navigationItems.map(item => (
                    <div
                        key={item.id}
                        className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                        onClick={() => onNavigate(item.id as 'chats' | 'settings' | 'payments')}
                    >
                        <FontAwesomeIcon icon={item.icon} />
                        {!isCollapsed && <span className="nav-label">{item.label}</span>}
                    </div>
                ))}
            </div>
            <div className="nav-toggle" onClick={onToggle}>
                <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
            </div>
        </div>
    );
};

export default LeftSidebar; 