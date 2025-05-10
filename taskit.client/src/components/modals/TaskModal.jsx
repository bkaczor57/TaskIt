// components/modals/TaskModal.jsx
import React, { useState, useContext, useEffect } from 'react';
import './TaskModal.css';
import { useTasks } from '../../context/TaskContext';
import UserContext from '../../context/UserContext';
import UserTeamContext from '../../context/UserTeamContext';
import { useEnums } from '../../context/EnumContext';
import { FaPencilAlt, FaTimes, FaTrash } from 'react-icons/fa';


const TaskModal = ({
  task,
  onClose,
  disableAssignEdit = false,
  onTaskUpdated        
}) => {
  /* --- konteksty --- */
  const { user } = useContext(UserContext);
  const { getUserInTeam, fetchTeamUsers } = useContext(UserTeamContext);
  const { taskStatuses, taskPriorities } = useEnums();
  const { getTask, updateTask, deleteTask } = useTasks();

  /* --- lokalny stan --- */
  const [formData,       setFormData]       = useState(null);
  const [enabledFields,  setEnabledFields]  = useState({});
  const [currentUserRole,setCurrentUserRole]= useState(null); // Member / Manager / Admin / null
  const [taskTeamUsers,  setTaskTeamUsers]  = useState([]);   // użytkownicy danego teamu

  /* --------------------------------------------- */
  /*  Pobierz: szczegóły zadania + rolę + (ew.) users  */
  /* ---------------------------------------------    */
  useEffect(() => {
    let isMounted = true;

    (async () => {
      /*  zadanie */
      const fresh = await getTask(task.id);
      if (!isMounted) return;
      setFormData(fresh);

      /*  moja rola w zespole */
      let role = null;
      try {
        const membership = await getUserInTeam(task.teamId, user.id);
        role = membership?.role || null;
      } catch { /* brak członkostwa */ }
      if (!isMounted) return;
      setCurrentUserRole(role);

      /*  lista userów tylko gdy WOLNO edytować */
      const mayEditAssignee =
        !disableAssignEdit && ['Manager', 'Admin'].includes(role);

      if (mayEditAssignee) {
        try {
          const users = await fetchTeamUsers(task.teamId);   // funkcja MUSI zwracać tablicę!
          if (isMounted) setTaskTeamUsers(users);
        } catch {
          if (isMounted) setTaskTeamUsers([]);
        }
      } else {
        setTaskTeamUsers([]);   // brak uprawnień – nie pokazuj selecta
      }
    })();

    return () => { isMounted = false; };
  }, [task.id, task.teamId, user.id, disableAssignEdit]);

  /* ---------- jeśli nadal ładuje ---------- */
  if (!formData) return null;

  /* ---------- uprawnienia ---------- */
  const isOwner   = task.assignedUserId === user.id;
  const isManager = ['Manager', 'Admin'].includes(currentUserRole);

  const isPrivileged       = isOwner || isManager;
  const canEditAssignedUser = isManager && !disableAssignEdit;

  /* ---------- helpers ---------- */
  const handleToggleField = (name) =>
    setEnabledFields((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć to zadanie?')) return;
    try { await deleteTask(task.id); onClose(); }
    catch (err) { console.error('deleteTask:', err); }
  };

  const formatDueDate = (dateStr) => {
    const d = new Date(dateStr); d.setHours(23, 59, 59, 999);
    return d.toISOString();
  };

  const handleSave = async () => {
    const p = {};

    if (enabledFields.title        && formData.title        !== task.title)        p.title        = formData.title;
    if (enabledFields.description  && formData.description  !== task.description)  p.description  = formData.description;
    if (enabledFields.status       && formData.status       !== task.status)       p.status       = formData.status;
    if (enabledFields.priority     && formData.priority     !== task.priority)     p.priority     = formData.priority;
    if (enabledFields.assignedUserId &&
        formData.assignedUserId    !== task.assignedUserId) p.assignedUserId = formData.assignedUserId
                                                              ? Number(formData.assignedUserId) : null;
    if (enabledFields.dueDate) {
      const due = formData.dueDate ? formatDueDate(formData.dueDate) : null;
      if ((task.dueDate || '') !== (due || '')) p.dueDate = due;
    }

    if (!Object.keys(p).length) return onClose();

    try { await updateTask(task.id, p); 
      if (typeof onTaskUpdated === 'function') onTaskUpdated();
      onClose(); }
    catch (err) { console.error('updateTask:', err); }
  };

  /* ---------- reużywalny renderer pola ---------- */
  const renderField = (label, name, content, canToggle = isPrivileged) => (
    <div className="task-field">
      <div className="task-label-row">
        <label>{label}</label>
        {canToggle && (
          <button
            type="button"
            className="edit-toggle-btn"
            onClick={() => handleToggleField(name)}
          >
            <FaPencilAlt />
          </button>
        )}
      </div>
      {isPrivileged || name === 'assignedUserId' ? content : (
        <div className="readonly-field">{content}</div>
      )}
    </div>
  );

  /* ---------- JSX ---------- */
  return (
    <div className="modal-overlay">
      <div className="modal-content task-modal">
        <button className="close-btn" onClick={onClose}><FaTimes /></button>

        {renderField('Tytuł', 'title',
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={!enabledFields.title || !isPrivileged}
            className="task-modal-title"
          />
        )}

        {renderField('Opis', 'description',
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={!enabledFields.description || !isPrivileged}
            className="task-modal-description"
          />
        )}

        {renderField('Status', 'status',
          <select
            name="status" value={formData.status} onChange={handleChange}
            disabled={!enabledFields.status || !isPrivileged}
            className="task-modal-select"
          >
            {taskStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}

        {renderField('Priorytet', 'priority',
          <select
            name="priority" value={formData.priority} onChange={handleChange}
            disabled={!enabledFields.priority || !isPrivileged}
            className="task-modal-select"
          >
            {taskPriorities.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        )}

        {renderField('Termin', 'dueDate',
          <input
            type="date" name="dueDate"
            value={formData.dueDate?.substring(0, 10) || ''}
            onChange={handleChange}
            disabled={!enabledFields.dueDate || !isPrivileged}
            className="task-modal-input"
          />
        )}

        {renderField('Przypisany użytkownik', 'assignedUserId',
          canEditAssignedUser ? (
            <select
              name="assignedUserId"
              value={formData.assignedUserId || ''}
              onChange={handleChange}
              disabled={!enabledFields.assignedUserId}
              className="task-modal-select"
            >
              {taskTeamUsers.map((u) => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          ) : (
            <span>{task.assignedUserName || 'nieprzypisany'}</span>
          ),
          canEditAssignedUser
        )}

        {isPrivileged && (
          <div className="form-buttons">
            <button className="btn-success" onClick={handleSave}>Zapisz zmiany</button>
            <button className="btn-cancel"  onClick={onClose}>Anuluj</button>
            <button className="btn-danger"  onClick={handleDelete}>
              <FaTrash /> Usuń
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
