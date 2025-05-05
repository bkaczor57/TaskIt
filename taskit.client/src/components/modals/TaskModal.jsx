import React, { useState, useContext, useEffect } from 'react';
import './TaskModal.css';
import { useTasks } from '../../context/TaskContext';
import UserContext from '../../context/UserContext';
import UserTeamContext from '../../context/UserTeamContext';
import { useEnums } from '../../context/EnumContext';
import { FaPencilAlt } from 'react-icons/fa';

const TaskModal = ({ task, onClose }) => {
  const { user } = useContext(UserContext);
  const { teamUsers } = useContext(UserTeamContext);
  const { taskStatuses, taskPriorities } = useEnums();
  const { getTask, updateTask } = useTasks();

  const [formData, setFormData] = useState(null);
  const [enabledFields, setEnabledFields] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const fresh = await getTask(task.id);
      setFormData(fresh);
    };
    fetch();
  }, [task.id]);

  if (!formData) return null;

  const isOwner = task.assignedUserId === user.id;
  const currentUserRole = teamUsers.find(u => u.id === user.id)?.role;
  const isPrivileged = isOwner || ['Manager', 'Admin'].includes(currentUserRole);
  const canEditAssignedUser = ['Manager', 'Admin'].includes(currentUserRole);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleField = (name) => {
    setEnabledFields(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const formatDueDate = (dateStr) => {
    const d = new Date(dateStr);
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  };

  const handleSave = async () => {
    const payload = {};

    if (enabledFields.title && formData.title !== task.title)
      payload.title = formData.title;

    if (enabledFields.description && formData.description !== task.description)
      payload.description = formData.description;

    if (enabledFields.status && formData.status !== task.status)
      payload.status = formData.status;

    if (enabledFields.priority && formData.priority !== task.priority)
      payload.priority = formData.priority;

    if (enabledFields.assignedUserId && formData.assignedUserId !== task.assignedUserId)
      payload.assignedUserId = formData.assignedUserId ? parseInt(formData.assignedUserId) : null;

    if (enabledFields.dueDate) {
      const formattedDueDate = formData.dueDate ? formatDueDate(formData.dueDate) : null;
      if ((task.dueDate || '') !== (formattedDueDate || '')) {
        payload.dueDate = formattedDueDate;
      }
    }

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    try {
      await updateTask(task.id, payload);
      onClose();
    } catch (err) {
      console.error('Błąd przy aktualizacji zadania:', err);
    }
  };

  const renderEditableField = (label, fieldName, fieldContent, canToggle = isPrivileged) => {
    if (!isPrivileged && fieldName !== 'assignedUserId') {
      return (
        <div className="task-field">
          <div className="task-label-row">
            <label>{label}</label>
          </div>
          <div className="readonly-field">
            {fieldContent}
          </div>
        </div>
      );
    }

    return (
      <div className="task-field">
        <div className="task-label-row">
          <label>{label}</label>
          {canToggle && (
            <button
              className="edit-toggle-btn"
              type="button"
              onClick={() => handleToggleField(fieldName)}
            >
              <FaPencilAlt />
            </button>
          )}
        </div>
        {fieldContent}
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content task-modal">
        <button className="close-button" onClick={onClose}>×</button>

        {renderEditableField("Tytuł", "title",
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={!enabledFields.title || !isPrivileged}
            className="task-modal-title"
          />
        )}

        {renderEditableField("Opis", "description",
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="task-modal-description"
            disabled={!enabledFields.description || !isPrivileged}
          />
        )}

        {renderEditableField("Status", "status",
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="task-modal-select"
            disabled={!enabledFields.status || !isPrivileged}
          >
            {taskStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}

        {renderEditableField("Priorytet", "priority",
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="task-modal-select"
            disabled={!enabledFields.priority || !isPrivileged}
          >
            {taskPriorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        )}

        {renderEditableField("Termin", "dueDate",
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate?.substring(0, 10) || ''}
            onChange={handleChange}
            className="task-modal-input"
            disabled={!enabledFields.dueDate || !isPrivileged}
          />
        )}

        {renderEditableField("Przypisany użytkownik", "assignedUserId",
          canEditAssignedUser ? (
            <select
              name="assignedUserId"
              value={formData.assignedUserId || ''}
              onChange={handleChange}
              disabled={!enabledFields.assignedUserId}
              className="task-modal-select"
            >
              <option value="">Nieprzypisany</option>
              {teamUsers.map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          ) : (
            <span>{task.assignedUserName || 'nieprzypisany'}</span>
          ),
          canEditAssignedUser
        )}

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
