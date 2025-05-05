import React, { useState } from 'react';
import { FaPlus, FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { TaskProvider } from '../../context/TaskContext';
import TaskList from '../Task/TaskList';
import CreateTaskModal from '../modals/CreateTaskModal';
import { useUser } from '../../context/UserContext';
import { useUserTeam } from '../../context/UserTeamContext';
import { useSections } from '../../context/SectionContext';
import './Section.css';

const Section = ({ section, teamId }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [newTitle, setNewTitle] = useState(section.title);
  const { updateSection } = useSections();

  const { user } = useUser();
  const { teamUsers } = useUserTeam();

  const currentUser = teamUsers.find(u => u.id === user?.id);
  const canAssign = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  const canEditTitle = canAssign;

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setIsScrolling(scrollHeight > clientHeight);
  };

  const handleEditClick = () => {
    setNewTitle(title);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    try {
      const updated = await updateSection(section.id, { title: newTitle });
      setTitle(updated.title);
    } catch (e) {
      console.error('Błąd edycji tytułu sekcji:', e);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        {isEditing ? (
          <>
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="section-title-input"
            />
            <div className="section-edit-actions">
              <button onClick={handleSaveEdit} className="edit-confirm">
                <FaCheck />
              </button>
              <button onClick={handleCancelEdit} className="edit-cancel">
                <FaTimes />
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="section-title">{title}</h3>
            {canEditTitle && (
              <button className="edit-toggle-btn" onClick={handleEditClick}>
                <FaPencilAlt />
              </button>
            )}
          </>
        )}

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
