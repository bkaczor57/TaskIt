import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
  } from 'react';
  import TaskService from '../services/TaskService';
  
  const UserTasksContext = createContext();
  
  export const UserTasksProvider = ({ filters = {}, children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [userTaskCount, setUserTaskCount] = useState(null);
  
    const filtersSignature = useMemo(() => JSON.stringify(filters), [filters]);
  
    const prepareFilters = () => {
      const parsed = JSON.parse(filtersSignature);
      const tz = new Date().getTimezoneOffset();
  
      return {
        ...parsed,
        Status: parsed.Status || null,
        Priority: parsed.Priority || null,
        OrderBy: parsed.OrderBy || 'CreatedAt',
        Ascending: Boolean(parsed.Ascending),
        TimeZoneOffsetInMinutes: tz,
        DueBefore: parsed.DueBefore || null,
        DueAfter: parsed.DueAfter || null,
        CreatedBefore: parsed.CreatedBefore || null,
        CreatedAfter: parsed.CreatedAfter || null,
        TeamIds: parsed.TeamIds || [],
        SearchTerm: parsed.SearchTerm || '',
        PageNumber: parsed.PageNumber || 1,
        PageSize: parsed.PageSize || 10,
      };
    };
  
    const fetchUserTasks = async () => {
      setLoading(true);
      try {
        const prepared = prepareFilters();
        const res = await TaskService.listUserTasks(prepared);
  
        setTasks(res.items || []);
        setTotalItems(res.totalItems || 0);
        setTotalPages(res.totalPages || 1);
        setError(null);
      } catch (e) {
        console.error('Błąd ładowania zadań użytkownika:', e);
        setError('Nie udało się pobrać zadań użytkownika');
      } finally {
        setLoading(false);
      }
    };

    const refetch = () => fetchUserTasks();   

    const refreshTask = async (taskId) => {
   try {
     const updated = await TaskService.getTask(taskId);   // pojedynczy GET
     setTasks(prev =>
       prev.map((t) => (t.id === taskId ? updated : t))
     );
   } catch (err) {
     console.error('Nie udało się odświeżyć zadania', err);
   }
 };
  
 const fetchUserTaskCount = async () => {
  try {
    // zapytania o status
    const statusQueries = {
      TotalTask: {},                          // bez filtrów
      CompletedTask: { Status: 'Completed' },
      TaskInProgress: { Status: 'InProgress' },
      ToDo: { Status: 'Pending' },
    };

    // zapytania o priorytet
    const priorityLevels = ['Optional', 'Low', 'Medium', 'High'];

    // równoległe odpytanie backendu
    const [statusResults, priorityResults] = await Promise.all([
      Promise.all(
        Object.entries(statusQueries).map(async ([label, q]) => {
          const data = await TaskService.getUserTaskCount(q);
          return [label, data.count ?? data];
        }),
      ),
      Promise.all(
        priorityLevels.map(async (p) => {
          const data = await TaskService.getUserTaskCount({ Priority: p });
          return [p, data.count ?? data];
        }),
      ),
    ]);

    // złożenie w jedną strukturę
    const counts = Object.fromEntries(statusResults);
    counts.byPriority = Object.fromEntries(priorityResults);

    setUserTaskCount(counts);
  } catch (e) {
    console.error('Błąd pobierania statystyk zadań użytkownika:', e);
    setUserTaskCount(null);
  }
};
  
    useEffect(() => {
      fetchUserTasks();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtersSignature]);
  
    return (
      <UserTasksContext.Provider
        value={{
          tasks,
          loading,
          error,
          totalItems,
          totalPages,
          fetchUserTasks,
          refetch,
          refreshTask,
          userTaskCount,
          fetchUserTaskCount,
          
        }}
      >
        {children}
      </UserTasksContext.Provider>
    );
  };
  
  export const useUserTasks = () => {
    const ctx = useContext(UserTasksContext);
    if (!ctx) throw new Error('useUserTasks must be used within a UserTasksProvider');
    return ctx;
  };
  