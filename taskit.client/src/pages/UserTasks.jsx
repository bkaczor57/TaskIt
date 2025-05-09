import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import { useEnums } from '../context/EnumContext';
import { useUser } from '../context/UserContext';
import { useUserTeam } from '../context/UserTeamContext';
import { UserTasksProvider, useUserTasks } from '../context/UserTasksContext';

import UserFilteredPanel from '../components/FilteredPanel/UserFilteredPanel';
import TaskCard from '../components/Task/TaskCard';
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

  /* ---------- FILTRY ---------- */
  const initialFilters = useMemo(() => ({
    Status: status ? status.toUpperCase() : null,
    OrderBy: 'CreatedAt',
    Ascending: true,
    PageNumber: 1,
    PageSize: 20,
  }), [status]);

  const [filters, setFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filterOpen, setFilterOpen] = useState(false);

  const applyFilters = () => {
    setFilters(draftFilters);
    setFilterOpen(false);
  };



  const titlePrefix = statusLabels[status?.toLowerCase()] || 'Wszystkie';

  return (
    <UserTasksProvider filters={filters}>

      <div className="user-tasks-content">
        <header className="user-tasks-header">
          <h1 className="user-tasks-title">{titlePrefix} zadania {user?.firstName || ''}</h1>
          <div className="header-actions">
            <button onClick={() => setFilterOpen(true)} className="filter-toggle">
              <FaFilter /> Filtracja
            </button>
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
          />
        )}

        <TasksList />
      </div>
    </UserTasksProvider>
  );
};

const TasksList = () => {
  const { tasks, loading, error } = useUserTasks();

  if (loading) return <div className="loading">Ładowanie…</div>;
  if (error) return <div className="error">{error}</div>;
  if (!tasks.length) return <p>Brak zadań do wyświetlenia.</p>;

  return (
    <div className="user-tasks-list">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default UserTasksPage;
