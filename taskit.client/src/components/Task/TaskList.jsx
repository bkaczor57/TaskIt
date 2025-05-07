import React from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskCard from './TaskCard'; 
import './TaskList.css';

const TaskList = ({ sectionId }) => {
  const { tasks, loading, error } = useTasks();
  const sectionTasks = tasks.filter(t => t.sectionId === sectionId);

  if (loading) return <div className="task-list-loading">Ładowanie zadań...</div>;
  if (error) return <div className="task-list-error">{error}</div>;
  if (!sectionTasks.length) return <div className="task-list-empty">Brak zadań w tej sekcji.</div>;

  return (
    <div className="task-list">
      {sectionTasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};


export default TaskList;
