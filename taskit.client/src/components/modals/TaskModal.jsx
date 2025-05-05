import React, { useState, useContext } from 'react';
import './TaskModal.css';
import { useTasks } from '../../context/TaskContext';
import UserContext from '../../context/UserContext';
import UserTeamContext from '../../context/UserTeamContext';
import { useEnums } from '../../context/EnumContext';

const TaskModal = ({ task, onClose }) => {
  const { updateTask } = useTasks();
  const { user } = useContext(UserContext);
  const { teamUsers } = useContext(UserTeamContext);
  const { taskStatuses, taskPriorities } = useEnums();

  const [formData, setFormData] = useState({ ...task });

  const isOwner = task.assignedUserId === user.id;
  const currentUserRole = teamUsers.find(u => u.id === user.id)?.role;
  const isPrivileged = isOwner || ['Manager', 'Admin'].includes(currentUserRole);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateTask({
        ...formData,
        assignedUserId: formData.assignedUserId ? parseInt(formData.assignedUserId) : null,
        dueDate: formData.dueDate ? formatDueDate(formData.dueDate) : null
      });
      onClose();
    } catch (err) {
      console.error('Błąd przy aktualizacji zadania:', err);
    }
  };

  const formatDueDate = (dateStr) => {
    const d = new Date(dateStr);
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content task-modal">
        <button className="close-button" onClick={onClose}>×</button>

        <h2>{isPrivileged ? (
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="task-modal-title"
          />
        ) : (
          task.title
        )}</h2>

        <div className="task-field">
          <label>Opis:</label>
          {isPrivileged ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="task-modal-description"
            />
          ) : (
            <p>{task.description}</p>
          )}
        </div>

        <div className="task-field">
          <label>Status:</label>
          {isPrivileged ? (
            <select name="status" value={formData.status} onChange={handleChange} className="task-modal-select">
              {taskStatuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          ) : (
            <span>{task.status}</span>
          )}
        </div>

        <div className="task-field">
          <label>Priorytet:</label>
          {isPrivileged ? (
            <select name="priority" value={formData.priority} onChange={handleChange} className="task-modal-select">
              {taskPriorities.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          ) : (
            <span>{task.priority}</span>
          )}
        </div>

        <div className="task-field">
          <label>Termin:</label>
          {isPrivileged ? (
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate?.substring(0, 10) || ''}
              onChange={handleChange}
              className="task-modal-input"
            />
          ) : (
            <span>{task.dueDate?.substring(0, 10) || 'brak'}</span>
          )}
        </div>

        <div className="task-field">
          <label>Przypisany użytkownik:</label>
          <span>{task.assignedUserName || 'nieprzypisany'}</span>
        </div>

        {isPrivileged && (
          <div className="modal-buttons">
            <button className="btn-primary" onClick={handleSave}>Zapisz zmiany</button>
            <button className="btn-secondary" onClick={onClose}>Anuluj</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
