import { useEffect, useContext, useState, useMemo } from 'react';
import AuthContext from '../context/AuthContext';
import UserContext from '../context/UserContext';
import { useUserTasks } from '../context/UserTasksContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, Cell, PieChart, Pie
} from 'recharts';
import { 
  MdRefresh, 
  MdAssignment, 
  MdCheckCircle, 
  MdAccessTime, 
  MdList,
  MdTrendingUp 
} from 'react-icons/md';

import './Dashboard.css';

// -----------  stałe  -----------
const PRIORITIES = {
  Optional: 'Opcjonalny',
  Low: 'Niski',
  Medium: 'Średni',
  High: 'Wysoki'
};

const STATUS_CONFIG = {
  TotalTask: {
    label: 'Wszystkie Zadania',
    icon: MdAssignment,
    className: 'total'
  },
  CompletedTask: {
    label: 'Ukończone',
    icon: MdCheckCircle,
    className: 'completed'
  },
  TaskInProgress: {
    label: 'W Trakcie',
    icon: MdAccessTime,
    className: 'inprogress'
  },
  ToDo: {
    label: 'Do zrobienia',
    icon: MdList,
    className: 'pending'
  }
};

// -----------  komponenty pomocnicze  -----------
const StatCard = ({ label, value, className, Icon }) => (
  <div className="stat-card">
    <div className="stat-content">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${className}`}>{value}</div>
    </div>
    <div className="stat-icon-wrapper">
      <Icon className="stat-icon" />
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const value = payload[0].value;
  const name = payload[0].name || label;
  const priorityName = PRIORITIES[name] || name;
  
  // Zabezpieczenie przed undefined
  const priorityClass = name ? `priority-${name.toLowerCase()}` : '';
  
  return (
    <div className={`custom-tooltip ${priorityClass}`}>
      <div className="tooltip-header">
        <span className="tooltip-label">Priorytet: {priorityName}</span>
        <MdTrendingUp className="tooltip-trend-icon" />
      </div>
      <div className="tooltip-content">
        <div className="tooltip-value">{value}</div>
        <div className="tooltip-subtext">Liczba zadań</div>
      </div>
    </div>
  );
};

const PriorityChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart 
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis 
        dataKey="priorityName" 
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
        name="Liczba zadań"
        radius={[4, 4, 0, 0]}
        barSize={40}
      >
        {data.map((entry, index) => (
          <Cell 
            key={`cell-${index}`}
            className={`priority-${entry.priority.toLowerCase()}`}
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const DistributionChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        dataKey="total"
        nameKey="priorityName"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label={entry => entry.priorityName}
      >
        {data.map((entry, index) => (
          <Cell 
            key={`cell-${index}`}
            className={`priority-${entry.priority.toLowerCase()}`}
          />
        ))}
      </Pie>
      <Tooltip 
        content={<CustomTooltip />}
        formatter={(value, name) => [value, name]}
      />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

// -----------  główny komponent  -----------
const Dashboard = () => {
  const { isUserLoading } = useContext(UserContext);
  const { userTaskCount, fetchUserTaskCount } = useUserTasks();
  const [priorityData, setPriorityData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // pobierz dane przy montowaniu
  useEffect(() => { 
    fetchUserTaskCount(); 
  }, []); 

  // aktualizuj dane wykresu
  useEffect(() => {
    if (!userTaskCount?.byPriority) return;

    setPriorityData(
      Object.keys(PRIORITIES).map(priority => ({
        priority,
        priorityName: PRIORITIES[priority],
        total: userTaskCount.byPriority[priority] || 0,
      }))
    );
  }, [userTaskCount]);

  // przygotuj dane dla kart statystyk
  const statusCards = useMemo(() => (
    Object.entries(STATUS_CONFIG).map(([key, config]) => ({
      ...config,
      value: userTaskCount?.[key] ?? 0,
    }))
  ), [userTaskCount]);

  // obsługa odświeżania
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUserTaskCount();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (isUserLoading || !userTaskCount) {
    return <div className="dashboard-loading">Ładowanie danych...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button 
          onClick={handleRefresh} 
          className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
          disabled={isRefreshing}
        >
          <MdRefresh className="refresh-icon" />
          Odśwież dane
        </button>
      </div>

      <div className="stats-row">
        {statusCards.map(({ label, value, className, icon: Icon }) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            className={className}
            Icon={Icon}
          />
        ))}
      </div>

      <div className="charts-row">
        <div className="chart-box">
          <div className="chart-title">Zadania według priorytetu</div>
          <PriorityChart data={priorityData} />
        </div>

        <div className="chart-box">
          <div className="chart-title">Rozkład priorytetów</div>
          <DistributionChart data={priorityData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
