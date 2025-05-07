import React, { useState } from 'react';
import { FaPlus, FaPencilAlt, FaCheck, FaTimes, FaTrashAlt, FaEllipsisH } from 'react-icons/fa';
import TaskList from '../Task/TaskList';
import CreateTaskModal from '../modals/CreateTaskModal';
import { useUser } from '../../context/UserContext';
import { useUserTeam } from '../../context/UserTeamContext';
import { useSections } from '../../context/SectionContext';
import './Section.css';
import { useSortable } from '@dnd-kit/sortable';
import clsx from 'clsx'; 
const Section = ({ section, teamId, isDragOverlay = false }) => {


  const dnd = useSortable({
    id: section.id,
    disabled: isDragOverlay, // wyłącz w overlay
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = dnd;

    const style = isDragOverlay
      ? undefined // overlay ma własne style w CSS
      : {
        transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
          transition: transition ?? 'transform .15s ease',
          opacity: isDragging ? 0 : 1,
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
            className={clsx('section', { 'drag-overlay': isDragOverlay })}
            {...(!isDragOverlay ? attributes : {})}
          >
      <div className="section-header">

                {/* uchwyt tylko w trybie zwykłym */}
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
