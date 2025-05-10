import { useEffect, useContext, useState, useMemo } from 'react';
import AuthContext from '../context/AuthContext';
import UserContext from '../context/UserContext';
import { useUserTasks } from '../context/UserTasksContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, Cell, PieChart, Pie
} from 'recharts';

import './Dashboard.css';           //  ← nowy arkusz

// -----------  stałe  -----------
const priorities = ['Optional', 'Low', 'Medium', 'High'];

const priorityColors = {
  Optional: '#9e9e9e',  // szary
  Low: '#4caf50',       // zielony
  Medium: '#ffc107',    // żółty
  High: '#f44336'       // czerwony
};

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
  const [refreshKey, setRefreshKey] = useState(0);

  // pobierz statystyki tylko przy montowaniu komponentu
  useEffect(() => { 
    fetchUserTaskCount(); 
  }, []); // Usunięto fetchUserTaskCount z zależności

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

  // Custom tooltip dla wykresu
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const handleRefresh = () => {
    fetchUserTaskCount();
    setRefreshKey(prev => prev + 1);
  };

  // -------------  UI  -------------
  if (isUserLoading || !userTaskCount) return <div>Ładowanie…</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleRefresh} className="refresh-button">
          Odśwież dane
        </button>
      </div>

      <div className="stats-row">
        {statusCards.map(card => (
          <div key={card.key} className="stat-card">
            <div className="stat-label">{card.label}</div>
            <div className={`stat-value ${card.valueClass}`}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className="charts-row">
        <div className="chart-box">
          <div className="chart-title">Tasks by Priority</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={priorityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="priority" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="total" 
                radius={[4, 4, 0, 0]}
                barSize={40}
              >
                {priorityData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={priorityColors[entry.priority]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <div className="chart-title">Priority Distribution</div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                dataKey="total"
                nameKey="priority"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {priorityData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={priorityColors[entry.priority]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
