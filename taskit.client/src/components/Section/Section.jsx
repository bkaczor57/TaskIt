import React, { useState, memo } from 'react';
import { FaPlus, FaPencilAlt, FaCheck, FaTimes, FaTrashAlt, FaEllipsisH } from 'react-icons/fa';
import TaskList from '../Task/TaskList';
import CreateTaskModal from '../modals/CreateTaskModal';
import { useUser } from '../../context/UserContext';
import { useUserTeam } from '../../context/UserTeamContext';
import { useSections } from '../../context/SectionContext';
import './Section.css';
import { useSortable } from '@dnd-kit/sortable';
import ReactDOM from 'react-dom';

const Section = memo(({ section, teamId, isDragOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id: section.id,
    disabled: isDragOverlay,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 1000 : 1,
    willChange: 'transform',
    touchAction: 'none',
    transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
  };

  const [isScrolling, setIsScrolling] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [newTitle, setNewTitle] = useState(section.title);
  const { updateSection, deleteSection } = useSections();

  const { user } = useUser();
  const { teamUsers } = useUserTeam();

  const currentUser = teamUsers.find(u => u.id === user?.id);
  const canAssign = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  const canEditSection = currentUser?.role === 'Admin';

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

  const handleDelete = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę sekcję?')) return;

    try {
      await deleteSection(section.id);
    } catch (err) {
      console.error('Błąd podczas usuwania sekcji:', err);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="section"
      {...(!isDragOverlay ? attributes : {})}
    >
      <div className="section-header">
        {!isDragOverlay && (
          <button
            className={`drag-handle ${isDragging ? 'invisible' : ''}`}
            {...listeners}
          >
            <FaEllipsisH />
          </button>
        )}
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
              <button onClick={handleDelete} className="edit-delete">
                <FaTrashAlt />
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="section-title">{title}</h3>
            {canEditSection && (
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

      {showCreateTaskModal &&
  ReactDOM.createPortal(
    <CreateTaskModal
      onClose={() => setShowCreateTaskModal(false)}
      assignedUsers={teamUsers}
      canAssign={canAssign}
    />,
    document.getElementById('modal-root') || document.body
  )}
    </div>
  );
});

Section.displayName = 'Section';

export default Section;
