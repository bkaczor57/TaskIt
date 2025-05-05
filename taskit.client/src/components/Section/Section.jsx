import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { TaskProvider } from '../../context/TaskContext';
import TaskList from '../Task/TaskList';
import CreateTaskModal from '../modals/CreateTaskModal';
import { useUser } from '../../context/UserContext';
import { useUserTeam } from '../../context/UserTeamContext';
import './Section.css';

const Section = ({ section, teamId }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

  const { user } = useUser();
  const { teamUsers } = useUserTeam();

  const currentUser = teamUsers.find(u => u.id === user?.id);
  const canAssign = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setIsScrolling(scrollHeight > clientHeight);
  };

  return (
    <div className="section">
      <div className="section-header">
        <h3>{section.title}</h3>
        <button
          className="add-task-btn"
          onClick={() => setShowCreateTaskModal(true)}
        >
          <FaPlus />
        </button>
      </div>

      <div 
        className={`section-content ${isScrolling ? 'scrollable' : ''}`}
        onScroll={handleScroll}
      >
        <TaskList />
      </div>

      {showCreateTaskModal && (
        <CreateTaskModal
          onClose={() => setShowCreateTaskModal(false)}
          assignedUsers={teamUsers}
          canAssign={canAssign}
        />
      )}
    </div>
  );
};

export default Section;
