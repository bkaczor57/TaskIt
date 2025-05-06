import React, { useState } from 'react';
import './TaskCard.css';
import TaskModal from '../modals/TaskModal';

const TaskCard = ({ task }) => {
  const [showModal, setShowModal] = useState(false);

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
        className={`task-card border-${getStatusClass()}`}
        onClick={() => setShowModal(true)}
      >
        {/* ------------ nagłówek ------------ */}
        <div className="task-header">
          {/* priorytet po lewej */}
          <span className={`priority-badge ${getPriorityClass()}`}>
            {getPriorityLabel()}
          </span>

          {/* status + kropka + avatar po prawej */}
          <div className="status-avatar">
            <span className={`status-dot ${getStatusClass()}`} />
            <span className={`status-label ${getStatusClass()}`}>
              {task.status}
            </span>

            {typeof task.assignedUserName === 'string' &&
              task.assignedUserName.length > 0 && (
                <div className="user-avatar">
                  {task.assignedUserName[0].toUpperCase()}
                </div>
            )}
          </div>
        </div>

        {/* ------------ tytuł ------------ */}
        <h3 className="task-title">{task.title || 'Bez tytułu'}</h3>

        {/* ------------ daty ------------ */}
        <div className="task-meta">
          <small>Utworzono: {formatDate(task.createdAt)}</small>
          <small>Do: {formatDate(task.dueDate)}</small>
        </div>

        {/* ------------ opis (2 linie) ------------ */}
        <p className="task-description">
          {task.description || '\u00A0'}
        </p>
      </div>

      {showModal && <TaskModal task={task} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default TaskCard;
