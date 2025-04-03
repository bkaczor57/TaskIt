import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './TaskModal.css';

const TaskModal = ({ task, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
    status: 'todo'
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || '',
        assignedTo: task.assignedTo || '',
        status: task.status || 'todo'
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tutaj dodamy logikę zapisywania zadania
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{task?.id ? 'Edytuj zadanie' : 'Nowe zadanie'}</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tytuł</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Opis</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priorytet</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Niski</option>
                <option value="medium">Średni</option>
                <option value="high">Wysoki</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Termin</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignedTo">Przypisane do</label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
              >
                <option value="">Wybierz użytkownika</option>
                {/* Tutaj dodamy listę użytkowników */}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="todo">Do zrobienia</option>
                <option value="inProgress">W trakcie</option>
                <option value="done">Zakończone</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Anuluj
            </button>
            <button type="submit" className="save-button">
              {task?.id ? 'Zapisz' : 'Utwórz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal; 