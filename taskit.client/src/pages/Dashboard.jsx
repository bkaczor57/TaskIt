import { useEffect, useContext, useState, useMemo } from 'react';
import AuthContext from '../context/AuthContext';
import UserContext from '../context/UserContext';
import { useUserTasks } from '../context/UserTasksContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts';

import './Dashboard.css';           //  ← nowy arkusz

// -----------  stałe  -----------
const priorities = ['Optional', 'Low', 'Medium', 'High'];

const statusLabels = {
  TotalTask:      'TOTAL TASK',
  CompletedTask:  'COMPLETED TASK',
  TaskInProgress: 'TASK IN PROGRESS',
  ToDo:           'TODOS',
};

const statusValueClass = {
  TotalTask:      'total',
  CompletedTask:  'completed',
  TaskInProgress: 'inprogress',
  ToDo:           'pending',
};

// -----------  komponent  -----------
const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const { isUserLoading } = useContext(UserContext);
  const { userTaskCount, fetchUserTaskCount } = useUserTasks();
  const [priorityData, setPriorityData] = useState([]);

  // pobierz statystyki przy starcie
  useEffect(() => { fetchUserTaskCount(); }, [fetchUserTaskCount]);

  // przelicz dane do wykresu
  useEffect(() => {
    if (!userTaskCount?.byPriority) return;

    setPriorityData(
      priorities.map(pr => ({
        priority: pr,
        total: userTaskCount.byPriority[pr] || 0,
      })),
    );
  }, [userTaskCount]);

  // szybka memorisation etykiet + wartości (mniej if‑ów w JSX)
  const statusCards = useMemo(() => (
    Object.entries(statusLabels).map(([key, label]) => ({
      key,
      label,
      value: userTaskCount?.[key] ?? 0,
      valueClass: statusValueClass[key],
    }))
  ), [userTaskCount]);

  // -------------  UI  -------------
  if (isUserLoading || !userTaskCount) return <div>Ładowanie…</div>;

  return (
    <div className="dashboard-container">
      <div className="stats-row">
        {statusCards.map(card => (
          <div key={card.key} className="stat-card">
            <div className="stat-label">{card.label}</div>
            <div className={`stat-value ${card.valueClass}`}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className="chart-box">
        <div className="chart-title">Chart by Priority</div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={priorityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="priority" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" name="total" barSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
