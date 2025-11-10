import React from 'react';
import type { Contact } from '../types';

interface ProfileCardProps {
    name: string;
    title: string;
    contacts: Contact[];
}

const SRLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="50" fontWeight="bold" fill="currentColor">
            SR
        </text>
    </svg>
);

export const ProfileCard: React.FC<ProfileCardProps> = ({ name, title, contacts }) => {
    return (
        <div className="profile-card-parent">
            <div className="profile-card-card">
                <div className="profile-card-logo">
                    <span className="profile-card-circle profile-card-circle1"></span>
                    <span className="profile-card-circle profile-card-circle2"></span>
                    <span className="profile-card-circle profile-card-circle3"></span>
                    <span className="profile-card-circle profile-card-circle4"></span>
                    <span className="profile-card-circle profile-card-circle5">
                        <SRLogoIcon className="profile-card-svg" />
                    </span>
                </div>
                <div className="profile-card-glass"></div>
                <div className="profile-card-content">
                    <span className="profile-card-title">{name}</span>
                    <span className="profile-card-text">{title}</span>
                </div>
                <div className="profile-card-bottom">
                    <div className="profile-card-social-buttons-container">
                        {contacts.map(({ Icon, href, type }) => (
                            <a 
                                key={type} 
                                href={href} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="profile-card-social-button"
                                aria-label={`Link to ${type}`}
                            >
                                <Icon className="profile-card-svg" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};