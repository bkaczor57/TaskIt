import React from 'react';
import { useParams } from 'react-router-dom';
import { SectionProvider } from '../context/SectionContext';
import TeamPage from './TeamPage';

const TeamPageWrapper = () => {
  const { teamId } = useParams();
  const parsedTeamId = parseInt(teamId);

  return (

      <SectionProvider teamId={parsedTeamId}>
        <TeamPage />
      </SectionProvider>
  );
};

export default TeamPageWrapper;