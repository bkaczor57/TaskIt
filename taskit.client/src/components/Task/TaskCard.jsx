import React, { useState } from 'react';
import './TaskCard.css';
import TaskModal from '../modals/TaskModal';

const TaskCard = ({ task }) => {
  const [showModal, setShowModal] = useState(false);

  const formatDate = (iso) => {
    if (!iso) return 'brak daty';
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return 'błędna data';
    }
  };

  const getPriorityClass = () => {
    if (typeof task.priority === 'string') return task.priority.toLowerCase();
    return 'unknown';
  };

  const getPriorityLabel = () => {
    if (typeof task.priority === 'string') return task.priority.toUpperCase();
    return 'BRAK';
  };

  const getStatusDotClass = () => {
    if (typeof task.status === 'string') return task.status.toLowerCase();
    return 'unknown';
  };

  return (
    <>
      <div className="task-card" onClick={() => setShowModal(true)}>
        <div className="task-header">
          <span className={`priority-badge ${getPriorityClass()}`}>
            {getPriorityLabel()}
          </span>
          {typeof task.assignedUserName === 'string' && task.assignedUserName.length > 0 && (
            <div className="user-avatar">
              {task.assignedUserName[0].toUpperCase()}
            </div>
          )}
        </div>

        <div className="task-title-row">
          <span className={`status-dot ${getStatusDotClass()}`}></span>
          <h3>{task.title || 'Bez tytułu'}</h3>
        </div>

        <div className="task-meta">
          <small>Utworzono: {formatDate(task.createdAt)}</small>
          <small>Do: {formatDate(task.dueDate)}</small>
        </div>

        {typeof task.description === 'string' && task.description.length > 0 && (
          <p className="task-description">
            {task.description}
          </p>
        )}
      </div>

      {showModal && (
        <TaskModal task={task} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default TaskCard;
