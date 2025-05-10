import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useEnums } from '../../context/EnumContext';
import { FaCalendarAlt , FaTimes  } from 'react-icons/fa';
import './TaskModal.css';

const CreateTaskModal = ({ onClose, sectionId, assignedUsers = [], canAssign = false }) => {
  const { createTask } = useTasks();
  const { taskPriorities } = useEnums();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [hasDueDate, setHasDueDate] = useState(false);

  const getDueDateUtc = (dateString) => {
    const d = new Date(dateString);
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      priority,
      assignedUserId: assignedUserId ? parseInt(assignedUserId) : null,
      dueDate: hasDueDate && dueDate ? getDueDateUtc(dueDate) : null,
      timeZoneOffsetInMinutes: new Date().getTimezoneOffset(),
    };
    try {
      await createTask(sectionId, payload);
      onClose();
    } catch (err) {
      console.error('Błąd tworzenia zadania:', err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content task-modal">
        <button className="close-btn" onClick={onClose}><FaTimes /></button>

        <h2>Nowe zadanie</h2>

        <form onSubmit={handleSubmit}>
          {/* --------- Tytuł --------- */}
          <div className="task-field">
            <label>Tytuł</label>
            <input
              className="task-modal-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* --------- Opis --------- */}
          <div className="task-field">
            <label>Opis</label>
            <textarea
              className="task-modal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* --------- Priorytet --------- */}
          <div className="task-field">
            <label>Priorytet</label>
            <select
              className="task-modal-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {taskPriorities.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* --------- Przypisanie --------- */}
          {canAssign && (
            <div className="task-field">
              <label>Przypisz do użytkownika</label>
              <select
                className="task-modal-select"
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(e.target.value)}
              >
                {assignedUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>
          )}

          {/* --------- Termin --------- */}
          <div className="task-field due-date-toggle">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={hasDueDate}
                onChange={(e) => setHasDueDate(e.target.checked)}
              />
              <FaCalendarAlt className="calendar-icon" />
              <span>Ustaw datę ukończenia</span>
            </label>
          </div>

          {hasDueDate && (
            <div className="task-field">
              <label>Data ukończenia</label>
              <input
                className="task-modal-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          )}

          {/* --------- Przyciski --------- */}
          <div className="form-buttons">
            <button className="btn-success" type="submit">Zapisz</button>
            <button className="btn-cancel" type="button" onClick={onClose}>Anuluj</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
