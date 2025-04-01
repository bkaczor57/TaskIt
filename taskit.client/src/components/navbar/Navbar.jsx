import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import UserContext from '../../context/UserContext';
import { ProfileModal } from '../modals/ProfileModal';
import './Navbar.css';

function Navbar() {
  const { logout } = useContext(AuthContext);
  const { user, isUserLoading } = useContext(UserContext);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  

  const sampleNotifications = [
    { id: 1, message: 'Nowe zadanie: Zaktualizować dokumentację', type: 'task' },
    { id: 2, message: 'Zaproszenie do grupy: Zespół Frontend', type: 'invite' },
    { id: 3, message: 'Komentarz: "Super robota!"', type: 'comment' }
  ];
  const [notifications, setNotifications] = useState(sampleNotifications);

  if (isUserLoading) return null;


  const unreadCount = notifications.length;

  const toggleNotif = () => {
    if (window.innerWidth < 768) {
      navigate('/notifications');
      return;
    }

    setNotifOpen(!notifOpen);
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    if (window.innerWidth < 768) {
      goToFullProfile();
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const goToFullProfile = () => {
    setIsProfileModalOpen(true);
    setIsDropdownOpen(false);
  };

  const getAvatarLetter = () => {
    if (user?.firstName?.length > 0) return user.firstName[0].toUpperCase();
    if (user?.username?.length > 0) return user.username[0].toUpperCase();
    return '?';
  };

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
          <div className="navbar-notif-wrapper" onClick={toggleNotif}>
            <div className="navbar-icon">&#128276;</div>
            {unreadCount > 0 && <div className="notif-badge">{unreadCount}</div>}
            {notifOpen && (
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

          <div className="navbar-profile" onClick={handleProfileClick}>
            <div className="navbar-avatar">{getAvatarLetter()}</div>
            {isDropdownOpen && (
              <div className="dropdown">
                <p><strong>{user.firstName} {user.lastName}</strong></p>
                <p>{user.email}</p>
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
