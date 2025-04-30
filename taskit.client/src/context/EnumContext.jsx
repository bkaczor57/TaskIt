import React, {
  createContext, useContext, useEffect,
  useState, useCallback,
} from 'react';
import EnumService from '../services/EnumService';

const EnumContext = createContext();

export const EnumProvider = ({ children }) => {
  const [state, setState] = useState({
    taskPriorities:   [],
    taskStatuses:     [],
    taskOrderBy:      [],
    userRoles:        [],
    userTeamRoles:    [],
    inviteStatuses:   [],
    notificationTypes:[],
    loading: true,
    error: null,
  });

  const fetchEnums = useCallback(async () => {
    try {
      setState(s => ({ ...s, loading: true, error: null }));

      const [
        taskPriorities, taskStatuses, taskOrderBy,
        userRoles, userTeamRoles, inviteStatuses, notificationTypes,
      ] = await Promise.all([
        EnumService.getTaskPriorities(),
        EnumService.getTaskStatuses(),
        EnumService.getTaskOrderBy(),
        EnumService.getUserRoles(),
        EnumService.getUserTeamRoles(),
        EnumService.getInviteStatuses(),
        EnumService.getNotificationTypes(),
      ]);

      setState({
        taskPriorities,
        taskStatuses,
        taskOrderBy,
        userRoles,
        userTeamRoles,
        inviteStatuses,
        notificationTypes,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error('Błąd pobierania enumów:', err);
      setState(s => ({ ...s, loading: false, error: err.message || 'Wystąpił błąd' }));
    }
  }, []);

  useEffect(() => { fetchEnums(); }, [fetchEnums]);

  return (
    <EnumContext.Provider value={state}>
      {children}
    </EnumContext.Provider>
  );
};

export const useEnums = () => {
  const ctx = useContext(EnumContext);
  if (!ctx) throw new Error('useEnums must be used within an EnumProvider');
  return ctx;
};
