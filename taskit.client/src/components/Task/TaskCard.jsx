import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task }) => {
  const formatDate = (iso) => new Date(iso).toLocaleDateString();
  const formatDateTime = (iso) => new Date(iso).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="task-card-modern">
      <div className="task-card-header">
        <span className={`priority-badge ${task.priority.toLowerCase()}`}>
          {task.priority.toUpperCase()}
        </span>
        {task.assignedUserName && (
          <div className="user-avatar">
            {task.assignedUserName[0].toUpperCase()}
          </div>
        )}
      </div>

      <div className="task-title-row">
        <span className={`status-dot ${task.status.toLowerCase()}`}></span>
        <h3>{task.title}</h3>
      </div>

      <div className="task-meta">
        <small>Utworzono: {formatDate(task.createdAt)}</small>
        {task.dueDate && <small>Do: {formatDateTime(task.dueDate)}</small>}
      </div>

      {task.description && (
        <p className="task-description">
          {task.description}
        </p>
      )}
    </div>
  );
};

export default TaskCard;
