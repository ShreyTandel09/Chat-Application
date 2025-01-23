import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../types';

const LeftSidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const contacts: User[] = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Mike Johnson' },
    ];

    return (
        <div className={`left-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
                <FontAwesomeIcon icon={faBars} />
            </div>
            <div className="sidebar-content">
                <div className="contacts-list">
                    {contacts.map(contact => (
                        <div key={contact.id} className="contact-item">
                            <FontAwesomeIcon icon={faUser} />
                            <span className={isCollapsed ? 'd-none' : 'ms-2'}>
                                {contact.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LeftSidebar; 