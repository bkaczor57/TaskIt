import React, { useState } from 'react';
import './TaskCard.css';
import TaskModal from '../modals/TaskModal';
import ReactDOM from 'react-dom';
import { FaEllipsisH } from 'react-icons/fa';
import { useDraggable } from '@dnd-kit/core';
import { useUser } from '../../context/UserContext';
import { useUserTeam } from '../../context/UserTeamContext';
import UserInfoModal from '../modals/UserInfoModal';


const TaskCard = ({
  task,
  disableAssignEdit = false,
  onTaskUpdated = null     
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id,
  });

  const { user } = useUser();
  const { teamUsers } = useUserTeam();
  const [selectedUser, setSelectedUser] = useState(null);

  const currentUser = teamUsers.find(u => u.id === user?.id);
  const canDrag =
    currentUser?.role === 'Admin' ||
    currentUser?.role === 'Manager' ||
    task.assignedUserId === user?.id;

  const [showModal, setShowModal] = useState(false);

  const handleShowUserInfo = () => {
    const user = teamUsers.find(u => u.id === task.assignedUserId);
    if (user) setSelectedUser(user);
  };

  const formatDate = (iso) => {
    if (!iso) return 'brak daty';
    try {
      return new Date(iso).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
    } catch {
      return 'błędna data';
    }
  };

  const getPriorityClass = () =>
    typeof task.priority === 'string' ? task.priority.toLowerCase() : 'unknown';

  const getPriorityLabel = () =>
    typeof task.priority === 'string' ? task.priority.toUpperCase() : 'BRAK';

  const getStatusClass = () =>
    typeof task.status === 'string' ? task.status.toLowerCase() : 'unknown';

  return (
    <>
      <div
        ref={setNodeRef}
        className={`task-card border-${getStatusClass()}`}
        onClick={() => setShowModal(true)}
        data-task-id={task.id}
      >
        {/* ------------ nagłówek ------------ */}
        <div className="task-header">
          <span className={`priority-badge ${getPriorityClass()}`}>
            {getPriorityLabel()}
          </span>

          <div className="status-avatar">
            <span className={`status-dot ${getStatusClass()}`} />
            <span className={`status-label ${getStatusClass()}`}>
              {task.status}
            </span>
            
            {!task.teamName &&
              typeof task.assignedUserName === 'string' &&
              task.assignedUserName.length > 0 && (
                <div className="user-avatar" onClick={(e) => {
                  e.stopPropagation();
                  handleShowUserInfo();
                }}>
                  {task.assignedUserName[0].toUpperCase()}
                </div>
              )}
          </div>
        </div>

        {/* ------------ tytuł ------------ */}
        <h3 className="task-title">{task.title || 'Bez tytułu'}</h3>

        {task.teamName && (
          <span className="task-team">
            Zespół: <strong>{task.teamName}</strong>
          </span>
        )}



        {/* ------------ daty ------------ */}
        <div className="task-meta">
          <small>Utworzono: {formatDate(task.createdAt)}</small>
          <small>Do: {formatDate(task.dueDate)}</small>
        </div>

        {/* ------------ opis (2 linie) ------------ */}
        <p className="task-description">
          {task.description || '\u00A0'}
        </p>

        {/* ------------ DRAG HANDLE ------------ */}
        {canDrag && (
          <div
            className="task-handle"
            {...listeners}
            {...attributes}
            onClick={(e) => e.stopPropagation()}
          >
            <FaEllipsisH />
          </div>
        )}
      </div>

      {showModal &&
        ReactDOM.createPortal(
          <TaskModal
            task={task}
            onClose={() => setShowModal(false)}
            disableAssignEdit={disableAssignEdit}
            onTaskUpdated={onTaskUpdated}
          />,
          document.getElementById('modal-root') || document.body
        )}
      {selectedUser &&
        ReactDOM.createPortal(
          <UserInfoModal
            userId={selectedUser.id}
            teamId={task.teamId}
            onClose={() => setSelectedUser(null)}
          />,
          document.getElementById('modal-root') || document.body
        )}

    </>
  );
};

export default TaskCard;
