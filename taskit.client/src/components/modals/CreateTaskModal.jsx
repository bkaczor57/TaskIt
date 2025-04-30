import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useEnums } from '../../context/EnumContext'; 
import './ModalCommon.css';
import './CreateTaskModal.css';

const CreateTaskModal = ({ onClose, assignedUsers = [], canAssign = false }) => {
  const { createTask } = useTasks();
  const { taskPriorities } = useEnums(); 

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [hasDueDate, setHasDueDate] = useState(false);

  // Zwraca datę jako ISO UTC ustawioną na 23:59:59.999
  const getDueDateUtc = (dateString) => {
    const date = new Date(dateString);
    date.setHours(23, 59, 59, 999);
    return date.toISOString(); // UTC string
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskPayload = {
      title,
      description,
      priority,
      assignedUserId: assignedUserId ? parseInt(assignedUserId) : null,
      dueDate: hasDueDate && dueDate ? getDueDateUtc(dueDate) : null,
      timeZoneOffsetInMinutes: new Date().getTimezoneOffset() 
    };

    try {
      await createTask(taskPayload);
      onClose();
    } catch (error) {
      console.error('Błąd tworzenia zadania:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Dodaj nowe zadanie</h2>
        <form onSubmit={handleSubmit} className="add-task-form">
          <label>Tytuł zadania</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Opis zadania</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Priorytet</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {taskPriorities.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {canAssign && (
            <>
              <label>Przypisz do użytkownika</label>
              <select
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(e.target.value)}
              >
                <option value="">Nieprzypisane</option>
                {assignedUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.username}</option>
                ))}
              </select>
            </>
          )}

          <div className="due-date-toggle">
            <label>
              <input
                type="checkbox"
                checked={hasDueDate}
                onChange={(e) => setHasDueDate(e.target.checked)}
              />
              Ustaw datę ukończenia
            </label>
          </div>

          {hasDueDate && (
            <>
              <label>Data ukończenia</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </>
          )}

          <div className="modal-buttons">
            <button type="submit">Zapisz</button>
            <button type="button" onClick={onClose}>Anuluj</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
