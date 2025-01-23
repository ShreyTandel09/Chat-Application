import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p className="text-center mb-0">
                    © {new Date().getFullYear()} Chat App. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer; 