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
  