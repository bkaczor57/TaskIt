import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import GroupSidebar from '../components/GroupSidebar/GroupSidebar';
import TaskModal from '../components/modals/TaskModal';
import { FaPlus, FaList, FaTh, FaCog } from 'react-icons/fa';
import TeamContext from '../context/TeamContext';
import './GroupPage.css';

const GroupPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { getTeamById, deleteTeam } = useContext(TeamContext);

  const [group, setGroup] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [sections, setSections] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showGroupSidebar, setShowGroupSidebar] = useState(false);

  const fetchGroup = useCallback(async () => {
    try {
      const data = await getTeamById(parseInt(groupId));
      setGroup(data);
    } catch (error) {
      console.error('Błąd podczas pobierania grupy:', error);
    }
  }, [groupId, getTeamById]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setShowGroupSidebar(false);
  }, [location.pathname]);

  const handleDeleteGroup = async () => {
    if (window.confirm('Czy na pewno chcesz usunąć tę grupę?')) {
      try {
        await deleteTeam(parseInt(groupId));
        navigate('/dashboard');
      } catch (error) {
        console.error('Błąd podczas usuwania grupy:', error);
      }
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      title: 'Nowa sekcja',
      tasks: []
    };
    setSections([...sections, newSection]);
  };

  const handleAddTask = (sectionId) => {
    setSelectedTask({ sectionId });
    setShowTaskModal(true);
  };

  if (!group) {
    return <div className="loading">Ładowanie...</div>;
  }



  return (
    <div className={`group-page ${showGroupSidebar ? 'sidebar-open' : ''}`}>
      <GroupSidebar
        group={group}
        isMobile={isMobile}
        isVisible={showGroupSidebar}
        onClose={() => setShowGroupSidebar(false)}
        onDeleteGroup={handleDeleteGroup}
        onLeaveGroup={() => navigate('/dashboard')}
        onGroupUpdated={fetchGroup}
      />

      <div className="group-header">
        <div className="view-toggle">
          <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
            <FaList /> Lista
          </button>
          <button className={viewMode === 'kanban' ? 'active' : ''} onClick={() => setViewMode('kanban')}>
            <FaTh /> Kanban
          </button>
        </div>

        <button className="group-settings-toggle" onClick={() => setShowGroupSidebar(!showGroupSidebar)}>
          <FaCog />
        </button>
      </div>

      <div className="group-layout">
        <div className="group-content">
          {viewMode === 'list' ? (
            <div className="list-view">
              {sections.map(section => (
                <div key={section.id} className="section">
                  <h3>{section.title}</h3>
                  <div className="tasks">
                    {section.tasks.map(task => (
                      <div
                        key={task.id}
                        className="task"
                        onClick={() => handleTaskClick(task)}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>
                  <button
                    className="add-task"
                    onClick={() => handleAddTask(section.id)}
                  >
                    <FaPlus /> Dodaj zadanie
                  </button>
                </div>
              ))}
              <button className="add-section" onClick={handleAddSection}>
                <FaPlus /> Dodaj sekcję
              </button>
            </div>
          ) : (
            <div className="kanban-view">
              {sections.map(section => (
                <div key={section.id} className="kanban-column">
                  <h3>{section.title}</h3>
                  <div className="tasks">
                    {section.tasks.map(task => (
                      <div
                        key={task.id}
                        className="task"
                        onClick={() => handleTaskClick(task)}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>
                  <button
                    className="add-task"
                    onClick={() => handleAddTask(section.id)}
                  >
                    <FaPlus /> Dodaj zadanie
                  </button>
                </div>
              ))}
              <button className="add-section" onClick={handleAddSection}>
                <FaPlus /> Dodaj kolumnę
              </button>
            </div>
          )}
        </div>
      </div>

      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default GroupPage;
