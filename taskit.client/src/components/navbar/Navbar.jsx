import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import UserContext from '../../context/UserContext';
import { ProfileModal } from '../modals/ProfileModal';
import './Navbar.css';

function Navbar() {
    const { logout } = useContext(AuthContext);
    const { user, isUserLoading } = useContext(UserContext);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const navigate = useNavigate();


    const [activeDropdown, setActiveDropdown] = useState(null); // 'profile' | 'notif' | null
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);

    const sampleNotifications = [
        { id: 1, message: 'Nowe zadanie: Zaktualizować dokumentację', type: 'task' },
        { id: 2, message: 'Zaproszenie do grupy: Zespół Frontend', type: 'invite' },
        { id: 3, message: 'Komentarz: "Super robota!"', type: 'comment' }
    ];
    const [notifications, setNotifications] = useState(sampleNotifications);

    if (isUserLoading) return null;

    const unreadCount = notifications.length;

    const toggleDropdown = (type) => {
        if (window.innerWidth < 768) {
            if (type === 'notif') {
                navigate('/notifications');
            } else if (type === 'profile') {
                goToFullProfile();
            }
            return;
        }

        setActiveDropdown(prev => (prev === type ? null : type));
    };

    const goToDashboard = () => {
        navigate('/dashboard');
    };

    const goToFullProfile = () => {
        setIsProfileModalOpen(true);
        setActiveDropdown(null);
    };

    const getAvatarLetter = () => {
        if (user?.firstName?.length > 0) return user.firstName[0].toUpperCase();
        if (user?.username?.length > 0) return user.username[0].toUpperCase();
        return '?';
    };

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 768) {
            setActiveDropdown(null);
          }
        };
      
        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                activeDropdown &&
                !dropdownRef.current?.contains(event.target) &&
                !notifRef.current?.contains(event.target)
            ) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activeDropdown]);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <span className="logo" onClick={goToDashboard}>TaskIt</span>
                    <button className="burger-button" onClick={() => {
                        window.dispatchEvent(new Event("toggleSidebar"));
                    }}>
                        ☰
                    </button>
                </div>

                <div className="navbar-right">
                    <div className="navbar-notif-wrapper"  ref={notifRef}>
                        <div className="navbar-icon" onClick={() => toggleDropdown('notif')}>&#128276;</div>
                        {unreadCount > 0 && <div className="notif-badge">{unreadCount}</div>}
                        {activeDropdown === 'notif' && (
                            <div className="dropdown">
                                <p><strong>Powiadomienia</strong></p>
                                <ul>
                                    {notifications.map(n => (
                                        <li key={n.id}>{n.message}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="navbar-profile" ref={dropdownRef}>
                        <div className="navbar-avatar" onClick={() => toggleDropdown('profile')}>
                            {getAvatarLetter()}
                        </div>
                        {activeDropdown === 'profile' && (
                            <div className="dropdown" >
                                <p>
                                    <span className="tooltip left">
                                        <span className="tooltip-text">{`${user.firstName} ${user.lastName}`}</span>
                                        <span className="tooltip-bubble">{`${user.firstName} ${user.lastName}`}</span>
                                    </span>
                                </p>
                                <p>
                                    <span className="tooltip left">
                                        <span className="tooltip-text">{user.email}</span>
                                        <span className="tooltip-bubble">{user.email}</span>
                                    </span>
                                </p>

                                <div className="form-buttons-column">
                                    <button className="btn-orange btn-full-width" onClick={goToFullProfile}>Zobacz profil</button>
                                    <button className="btn-danger btn-full-width" onClick={logout}>Wyloguj się</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {isProfileModalOpen && (
                <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
            )}
        </>
    );
}

export default Navbar;