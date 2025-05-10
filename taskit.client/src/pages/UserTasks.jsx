import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import { useEnums } from '../context/EnumContext';
import { useUser } from '../context/UserContext';
import { useUserTeam } from '../context/UserTeamContext';
import { UserTasksProvider, useUserTasks } from '../context/UserTasksContext';
import UserFilteredPanel from '../components/FilteredPanel/UserFilteredPanel';
import TaskCard from '../components/Task/TaskCard';
import { TaskProvider } from '../context/TaskContext';
import './UserTasks.css';

const statusLabels = {
  pending: 'Oczekujące',
  inprogress: 'W trakcie',
  completed: 'Zakończone',
};

const UserTasksPage = () => {
  const { status } = useParams();
  const { user } = useUser();
  const { userTeams } = useUserTeam();
  const { taskStatuses, taskPriorities, taskOrderBy } = useEnums();
  const readOnlyStatus = !!status;

  /* ---------- FILTRY ---------- */
  const initialFilters = useMemo(() => ({
    Status: status ? status.toUpperCase() : null,
    OrderBy: 'CreatedAt',
    Ascending: true,
    SearchTerm: '',
  }), [status]);

  const [filters, setFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const applyFilters = () => {
    setFilters(draftFilters);
    setFilterOpen(false);
  };

  useEffect(() => {
    const newFilters = {
      Status: status ? status.toUpperCase() : null,
      OrderBy: 'CreatedAt',
      Ascending: true,
      SearchTerm: '',
    };

    setFilters(newFilters);
    setDraftFilters(newFilters);
  }, [status]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        SearchTerm: searchInput
      }));
    }, 1000); // 1 sekunda opóźnienia

    return () => clearTimeout(delay);
  }, [searchInput]);


  const titlePrefix = statusLabels[status?.toLowerCase()] || 'Wszystkie';

  return (
    <TaskProvider>
      <UserTasksProvider filters={filters}>

        <div className="user-tasks-content">
<header className="user-tasks-header">
  <div className="header-top">
    <h1 className="user-tasks-title">{titlePrefix} zadania</h1>
    <div className="header-actions">
      <button onClick={() => setFilterOpen(true)} className="filter-toggle">
        <FaFilter /> Filtracja
      </button>
    </div>
  </div>

  <div className="header-bottom">
    <input
      type="text"
      placeholder="Szukaj..."
      className="task-search-input"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
    />
  </div>
</header>


          {filterOpen && (
            <UserFilteredPanel
              draftFilters={draftFilters}
              setDraftFilters={setDraftFilters}
              applyFilters={applyFilters}
              onClose={() => setFilterOpen(false)}
              userTeams={userTeams}
              taskStatuses={taskStatuses}
              taskPriorities={taskPriorities}
              taskOrderBy={taskOrderBy}
              readOnlyStatus={readOnlyStatus}
            />
          )}

          <TasksList />
        </div>
      </UserTasksProvider>
    </TaskProvider>
  );
};

const TasksList = () => {
  const { tasks, loading, error, refreshTask } = useUserTasks();


  if (loading) return <div className="loading">Ładowanie…</div>;
  if (error) return <div className="error">{error}</div>;
  if (!tasks.length) return <p>Brak zadań do wyświetlenia.</p>;

  return (
    <div className="user-tasks-list">
      {tasks.map(task => (
        <TaskCard 
          key={task.id}
          task={task} 
          disableAssignEdit 
          onTaskUpdated={() => refreshTask(task.id)}
          />
      ))}
    </div>
  );
};

export default UserTasksPage;
