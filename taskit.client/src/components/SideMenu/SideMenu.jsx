import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SideMenu.css';

function SideMenu() {
  const navigate = useNavigate();
  const [groupsOpen, setGroupsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

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

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) setIsOpen(false);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'tasks', label: 'Moje zadania', path: '/tasks' },
    { id: 'settings', label: 'Ustawienia', path: '/settings' },
  ];

  const groups = [
    { id: 1, name: 'Frontend Team' },
    { id: 2, name: 'Backend Masters' },
    { id: 3, name: 'Projekt Inżynierskiaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
  ];

  return (
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
                {groups.map(group => (
                  <li key={group.id} onClick={() => handleNavigate(`/groups/${group.id}`)}>
                    {group.name}
                  </li>
                ))}
                <li className="create-group" onClick={() => handleNavigate('/groups/create')}>
                  + Utwórz grupę
                </li>
                <li className="create-group" onClick={() => handleNavige('/groups/join')}>
                  + Dołącz do grupy
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default SideMenu;
