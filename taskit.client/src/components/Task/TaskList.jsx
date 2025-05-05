import React from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskCard from './TaskCard'; 
import './TaskList.css';

const TaskList = () => {
  const { tasks, loading, error } = useTasks();

  if (loading) return <div className="task-list-loading">Ładowanie zadań...</div>;
  if (error) return <div className="task-list-error">{error}</div>;
  if (!tasks.length) return <div className="task-list-empty">Brak zadań w tej sekcji.</div>;

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
