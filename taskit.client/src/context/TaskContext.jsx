import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import TaskService from '../services/TaskService';

const TaskContext = createContext();

export const TaskProvider = ({ teamId, sectionId = null, filters = {}, children }) => {
  /* -------------------------  LOCAL STATE  ------------------------- */
  const [tasks,       setTasks]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [totalItems,  setTotalItems]  = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);

  /* -----------------------  STABILNE FILTRY  ----------------------- *
   * JSON.stringify tworzy „podpis” obiektu. useMemo upewnia się,      *
   * że jeśli zawartość filtrów się nie zmieniła, referencja też       *
   * pozostaje taka sama – dzięki temu useEffect nie wchodzi w pętlę.  */
  const filtersSignature = useMemo(() => JSON.stringify(filters), [filters]);

  /* ----------------------  HELPER: PREPARE  ------------------------ */
  const prepareFilters = () => {
    const parsed = JSON.parse(filtersSignature);       
    const tz     = new Date().getTimezoneOffset();

    return {
      ...parsed,
      AssignedUserId: parsed.AssignedUserId || null,
      Status:         parsed.Status         || null,
      Priority:       parsed.Priority       || null,
      OrderBy:        parsed.OrderBy        || 'CreatedAt',
      Ascending:      Boolean(parsed.Ascending),
      TeamId:         teamId,
      TimeZoneOffsetInMinutes: tz,
      DueBefore:      parsed.DueBefore      || null,
      DueAfter:       parsed.DueAfter       || null,
      CreatedBefore:  parsed.CreatedBefore  || null,
      CreatedAfter:   parsed.CreatedAfter   || null,
    };
  };

  /* --------------------------  FETCH  ------------------------------ */
  const fetchTasks = async () => {
    if (!teamId) return;

    setLoading(true);
    try {
      const prepared = prepareFilters();

      const res = sectionId
        ? await TaskService.listSectionTasks(teamId, sectionId, prepared)
        : await TaskService.listTeamTasks  (teamId,           prepared);

      setTasks(res.items       || []);
      setTotalItems(res.totalItems || 0);
      setTotalPages(res.totalPages || 1);
      setError(null);
    } catch (e) {
      console.error('Błąd ładowania tasków:', e);
      setError('Nie udało się pobrać tasków');
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------  AUTO-REFETCH  --------------------------- *
   * Odpala się TYLKO gdy:                                             *
   *  - zmieni się teamId                                              *
   *  - zmieni się sectionId                                           *
   *  - zmieni się _treść_ filters (por. filtersSignature)             */
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, sectionId, filtersSignature]);

  /* ---------------------------  CRUD  ------------------------------ */
  const createTask = async (data) => {
    const newTask = await TaskService.create(teamId, sectionId, data);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = async (id, data) => {
    const updated = await TaskService.update(id, data);
    setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
    return updated;
  };

  const deleteTask = async (id) => {
    await TaskService.remove(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  /* -------------------------  PROVIDER  ---------------------------- */
  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      error,
      totalItems,
      totalPages,
      fetchTasks,     
      createTask,
      updateTask,
      deleteTask,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within a TaskProvider');
  return ctx;
};
