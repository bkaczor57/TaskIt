import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './SideMenu.css';
import CreateTeamModal from '../modals/CreateTeamModal';
import UserTeamContext from '../../context/UserTeamContext';


function SideMenu() {
  const navigate = useNavigate();
  const { userTeams, fetchUserTeams } = useContext(UserTeamContext);


  const [groupsOpen, setGroupsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'tasks', label: 'Moje zadania', path: '/tasks' },
    { id: 'settings', label: 'Ustawienia', path: '/settings' },
  ];

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="side-menu-overlay visible"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`side-menu ${isMobile ? (isOpen ? 'mobile-visible' : '') : ''}`}>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
            {menuItems.map(item => (
              <li key={item.id}>
                <button className="side-link" onClick={() => handleNavigate(item.path)}>
                  {item.label}
                </button>
              </li>
            ))}

            <li>
              <button className="side-link" onClick={() => setGroupsOpen(!groupsOpen)}>
                Grupy <span>{groupsOpen ? '▾' : '▸'}</span>
              </button>

              {groupsOpen && (
                <ul className="group-list">
                  {userTeams.length === 0 && <li style={{ paddingLeft: '1rem' }}>Brak zespołów</li>}
                  {userTeams.map(group => (
                    <li key={group.id} onClick={() => handleNavigate(`/groups/${group.id}`)}>
                      {group.name}
                    </li>
                  ))}
                  <li className="create-group" onClick={() => setIsCreateTeamModalOpen(true)}>
                    + Utwórz grupę
                  </li>
                  <li className="create-group">
                    + Dołącz do grupy
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {isCreateTeamModalOpen && (
        <CreateTeamModal onClose={() => setIsCreateTeamModalOpen(false)} />
      )}
    </>
  );
}

export default SideMenu;
