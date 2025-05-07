import {useState} from 'react';
import { useParams } from 'react-router-dom';
import { SectionProvider } from '../context/SectionContext';
import { TaskProvider } from '../context/TaskContext';
import TeamPage from './TeamPage';

const defaultFilters = {
  AssignedUserId: '',
  Status: '',
  Priority: '',
  DueBefore: '',
  DueAfter: '',
  CreatedBefore: '',
  CreatedAfter: '',
  OrderBy: 'CreatedAt',
  Ascending: true,
};


const TeamPageWrapper = () => {
  const { teamId } = useParams();
  const parsedTeamId = parseInt(teamId);
  const [filters, setFilters] = useState(defaultFilters);

  return (
    <SectionProvider teamId={parsedTeamId}>
      <TaskProvider teamId={parsedTeamId} filters={filters}>
      <TeamPage filters={filters} setFilters={setFilters} />
      </TaskProvider>
    </SectionProvider>
  );
};

export default TeamPageWrapper;
