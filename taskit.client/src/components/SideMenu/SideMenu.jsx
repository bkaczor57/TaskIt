import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './SideMenu.css';
import CreateTeamModal from '../modals/CreateTeamModal';
import UserInviteListModal from '../modals/UserInviteListModal';
import UserTeamContext from '../../context/UserTeamContext';
import { RxHamburgerMenu } from "react-icons/rx";
import { FaTasks, FaUsers, FaArrowRight, FaArrowDown } from 'react-icons/fa';
import { MdOutlineTaskAlt, MdOutlineTask, MdTask, MdGroup, MdGroupAdd, MdOutlineGroupAdd, MdSpaceDashboard, MdNotifications, MdMail } from "react-icons/md";

function SideMenu() {
  const navigate = useNavigate();
  const { userTeams, fetchUserTeams } = useContext(UserTeamContext);

  const [tasksOpen, setTasksOpen] = useState(false);
  const [groupsOpen, setGroupsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isUserInvitesModalOpen, setIsUserInvitesModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const toggleHandler = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener("toggleSidebar", toggleHandler);
    return () => window.removeEventListener("toggleSidebar", toggleHandler);
  }, []);

  useEffect(() => {
    if (groupsOpen && userTeams.length === 0) {
      fetchUserTeams();
    }
  }, [groupsOpen, userTeams, fetchUserTeams]);

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {isMobile && (
        <button
          className="burger-button"
          onClick={() => setIsOpen(prev => !prev)}
        >
          <RxHamburgerMenu/>
        </button>
      )}
      {isMobile && isOpen && (
        <div
          className="side-menu-overlay visible"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`side-menu ${isMobile ? (isOpen ? 'mobile-visible' : '') : ''}`}>
        <nav>
          <ul className="menu-list">
            <li>
              <button className="menu-item" onClick={() => handleNavigate('/dashboard')}>
                <span className="menu-icon"><MdSpaceDashboard /></span>
                Dashboard
              </button>
            </li>

            <li>
              <button className="menu-item" onClick={() => setTasksOpen(!tasksOpen)}>
                <span className="menu-icon"><FaTasks /></span>
                Zadania
                <span className="arrow">{tasksOpen ? <FaArrowDown /> : <FaArrowRight />}</span>
              </button>
              <ul className={`submenu ${tasksOpen ? 'expand' : 'collapse'}`}>
                <li onClick={() => handleNavigate('/tasks/completed')}>
                  <span className="menu-icon"><MdOutlineTaskAlt /></span>
                  <span className="item-text">Ukończone</span>
                </li>
                <li onClick={() => handleNavigate('/tasks/in-progress')}>
                  <span className="menu-icon"><MdOutlineTask /></span>
                  <span className="item-text">W trakcie</span>
                </li>
                <li onClick={() => handleNavigate('/tasks/todo')}>
                  <span className="menu-icon"><MdTask /></span>
                  <span className="item-text">Do zrobienia</span>
                </li>
              </ul>
            </li>

            <li>
              <button className="menu-item" onClick={() => handleNavigate('/notifications')}>
                <span className="menu-icon"><MdNotifications /></span>
                Powiadomienia
              </button>
            </li>
            <li>
              <button className="menu-item" onClick={() => setIsUserInvitesModalOpen(true)}>
                <span className="menu-icon"><MdMail /></span>
                Zaproszenia
              </button>
            </li>

            <li>
              <button className="menu-item" onClick={() => setGroupsOpen(!groupsOpen)}>
                <span className="menu-icon"><FaUsers /></span>
                Grupy
                <span className="arrow">{groupsOpen ? <FaArrowDown /> : <FaArrowRight />}</span>
              </button>
              <ul className={`submenu ${groupsOpen ? 'expand' : 'collapse'}`}>
                {userTeams.length === 0 && (
                  <li className="no-teams">
                    <span className="item-text">Brak zespołów</span>
                  </li>
                )}
                {userTeams.map(group => (
                  <li key={group.id} onClick={() => handleNavigate(`/groups/${group.id}`)}>
                    <span className="menu-icon"><MdGroup /></span>
                    <span className="item-text" title={group.name}>{group.name}</span>
                  </li>
                ))}
                <li className="action-item" onClick={() => setIsCreateTeamModalOpen(true)}>
                  <span className="menu-icon join"><MdGroupAdd /></span>
                  <span className="item-text">Utwórz grupę</span>
                </li>
                <li className="action-item" onClick={() => handleNavigate('/groups/join')}>
                  <span className="menu-icon join"><MdOutlineGroupAdd /></span>
                  <span className="item-text">Dołącz do grupy</span>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>

      {isCreateTeamModalOpen && (
        <CreateTeamModal
          onClose={() => setIsCreateTeamModalOpen(false)}
          fetchUserTeams={fetchUserTeams}
          navigate={navigate}
        />
      )}

      {isUserInvitesModalOpen && (
        <UserInviteListModal
          onClose={() => setIsUserInvitesModalOpen(false)}
        />
      )}
    </>
  );
}

export default SideMenu;
