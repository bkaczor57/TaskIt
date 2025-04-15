import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import UserContext from '../../context/UserContext';
import { ProfileModal } from '../modals/ProfileModal';
import { MdNotifications } from "react-icons/md";
import './Navbar.css';

function Navbar() {
  const { logout } = useContext(AuthContext);
  const { user, isUserLoading } = useContext(UserContext);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'profile' | 'notif' | null
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const sampleNotifications = [
    { id: 1, message: 'Nowe zadanie: Zaktualizować dokumentację' },
    { id: 2, message: 'Zaproszenie do grupy: Zespół Frontend' },
    { id: 3, message: 'Komentarz: "Super robota!"' }
  ];
  const [notifications, setNotifications] = useState(sampleNotifications);

  const formatName = (firstName, lastName) => {
    const maxLineLength = 22; // Maksymalna długość linii
    
    // Sprawdź czy imię i nazwisko mieszczą się w jednej linii
    if ((firstName.length + lastName.length + 1) <= maxLineLength) {
      return { firstName, lastName, singleLine: true };
    }
    
    // Sprawdź czy imię jest za długie
    if (firstName.length > maxLineLength) {
      return { 
        firstName: firstName.substring(0, maxLineLength - 3) + '...', 
        lastName, 
        singleLine: false 
      };
    }
    
    // Sprawdź czy nazwisko jest za długie
    if (lastName.length > maxLineLength) {
      return { 
        firstName, 
        lastName: lastName.substring(0, maxLineLength - 3) + '...', 
        singleLine: false 
      };
    }
    
    // Przypadek gdy imię i nazwisko osobno mieszczą się w liniach
    return { firstName, lastName, singleLine: false };
  };

  const unreadCount = notifications.length;

  const toggleDropdown = (type) => {
    if (window.innerWidth < 768) {
      navigate(type === 'notif' ? '/notifications' : '/profile');
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
    if (user?.firstName) return user.firstName[0].toUpperCase();
    if (user?.username) return user.username[0].toUpperCase();
    return '?';
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  if (isUserLoading || !user) return null;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left" onClick={goToDashboard}>
          <img src="/logo.png" alt="Task It Logo" className="navbar-logo" />
          <span className="navbar-title">Task It</span>
        </div>

        <div className="navbar-right">
          {/* Notifications */}
          <div className="navbar-item" ref={notifRef}>
            <div className="navbar-icon" onClick={() => toggleDropdown('notif')}>
              <MdNotifications />
              {unreadCount > 0 && <div className="notif-badge">{unreadCount}</div>}
            </div>
            <div className={`dropdown ${activeDropdown === 'notif' ? 'show' : ''}`}>
              <p><strong>Powiadomienia</strong></p>
              <ul>
                {notifications.map(n => (
                  <li key={n.id}>{n.message}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Profile */}
          <div className="navbar-item" ref={dropdownRef}>
            <div className="navbar-avatar" onClick={() => toggleDropdown('profile')}>
              {getAvatarLetter()}
            </div>
            <div className={`dropdown ${activeDropdown === 'profile' ? 'show' : ''}`}>
              <div className="profile-name">
                {(() => {
                  const { firstName, lastName, singleLine } = formatName(user.firstName, user.lastName);
                  return singleLine ? (
                    <div className="single-line">
                      <span className="firstname" title={user.firstName}>{firstName}</span>
                      <span className="lastname" title={user.lastName}>{lastName}</span>
                    </div>
                  ) : (
                    <div className="two-lines">
                      <span className="firstname" title={user.firstName}>{firstName}</span>
                      <span className="lastname" title={user.lastName}>{lastName}</span>
                    </div>
                  );
                })()}
              </div>
              <p title={user.email}>{user.email}</p>
              <div className="form-buttons-column">
                <button className="btn-orange" onClick={goToFullProfile}>Zobacz profil</button>
                <button className="btn-danger" onClick={logout}>Wyloguj się</button>
              </div>
            </div>
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
