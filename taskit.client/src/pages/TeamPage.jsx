import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeamSidebar from '../components/TeamSidebar/TeamSidebar';
import { FaPlus, FaCog } from 'react-icons/fa';
import TeamContext from '../context/TeamContext';
import SectionModal from '../components/modals/SectionModal';
import Section from '../components/Section/Section';
import UserTeamContext from '../context/UserTeamContext';
import { useSections } from '../context/SectionContext';
import { useTasks } from '../context/TaskContext';
import { useEnums } from '../context/EnumContext';
import { TaskProvider } from '../context/TaskContext';
import './TeamPage.css';

const TeamPage = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState({
    AssignedUserId: '',
    Status: '',
    Priority: '',
    DueBefore: '',
    DueAfter: '',
    CreatedBefore: '',
    CreatedAfter: '',
    OrderBy: 'CreatedAt',
    Ascending: true
  });

  const { taskStatuses, taskPriorities, taskOrderBy } = useEnums();
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { getTeamById, deleteTeam } = useContext(TeamContext);
  const { teamUsers } = useContext(UserTeamContext);
  const { sections, createSection } = useSections();

  const [team, setTeam] = useState(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showTeamSidebar, setShowTeamSidebar] = useState(false);

  const fetchTeam = useCallback(async () => {
    try {
      const data = await getTeamById(parseInt(teamId));
      setTeam(data);
    } catch (error) {
      console.error('Błąd podczas pobierania zespołu:', error);
    }
  }, [teamId, getTeamById]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [appliedFilters, setAppliedFilters] = useState(draftFilters);
  const applyFilters = () => {
    setAppliedFilters(draftFilters); 
    setFilterOpen(false);
  };
  const handleDeleteTeam = async () => {
    if (window.confirm('Czy na pewno chcesz usunąć tę grupę?')) {
      try {
        await deleteTeam(parseInt(teamId));
        navigate('/dashboard');
      } catch (error) {
        console.error('Błąd podczas usuwania grupy:', error);
      }
    }
  };

  const handleAddSection = async (title) => {
    try {
      await createSection(title);
      setShowSectionModal(false);
    } catch (err) {
      console.error('Błąd podczas tworzenia sekcji:', err);
    }
  };

  const isAdmin = teamUsers?.find(user => user.id === team?.ownerId)?.role === 'Admin';

  if (!team) return <div className="loading">Ładowanie...</div>;

  return (
    <div className={`team-page ${showTeamSidebar ? 'sidebar-open' : ''}`}>
      <TeamSidebar
        team={team}
        isMobile={isMobile}
        isVisible={showTeamSidebar}
        onClose={() => setShowTeamSidebar(false)}
        onDeleteTeam={handleDeleteTeam}
        onLeaveTeam={() => navigate('/dashboard')}
        onTeamUpdated={fetchTeam}
      />

      <div className="team-content">
        <div className="team-header">
          <h1>{team.name}</h1>
          <button className="team-settings-toggle" onClick={() => setShowTeamSidebar(!showTeamSidebar)}>
            <FaCog />
          </button>
        </div>

        <div className="filter-container">
          <button className="filter-toggle" onClick={() => setFilterOpen(prev => !prev)}>Filtracja</button>

          {filterOpen && (
            <div className="filter-dropdown">
              <label>Status</label>
              <select value={draftFilters.Status} onChange={e => setDraftFilters({ ...draftFilters, Status: e.target.value })}>
                <option value="">--</option>
                {taskStatuses.map(status => <option key={status} value={status}>{status}</option>)}
              </select>

              <label>Priorytet</label>
              <select value={draftFilters.Priority} onChange={e => setDraftFilters({ ...draftFilters, Priority: e.target.value })}>
                <option value="">--</option>
                {taskPriorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>

              <label>Przypisany użytkownik</label>
              <select
                value={draftFilters.AssignedUserId}
                onChange={e => setDraftFilters({ ...draftFilters, AssignedUserId: e.target.value ? Number(e.target.value) : '' })}
              >
                <option value="">--</option>
                {teamUsers.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
              </select>

              <label>Data utworzenia od</label>
              <input type="date" value={draftFilters.CreatedAfter} onChange={e => setDraftFilters({ ...draftFilters, CreatedAfter: e.target.value })} />

              <label>Data utworzenia do</label>
              <input type="date" value={draftFilters.CreatedBefore} onChange={e => setDraftFilters({ ...draftFilters, CreatedBefore: e.target.value })} />

              <label>Termin od</label>
              <input type="date" value={draftFilters.DueAfter} onChange={e => setDraftFilters({ ...draftFilters, DueAfter: e.target.value })} />

              <label>Termin do</label>
              <input type="date" value={draftFilters.DueBefore} onChange={e => setDraftFilters({ ...draftFilters, DueBefore: e.target.value })} />

              <label>Sortuj według</label>
              <select value={draftFilters.OrderBy} onChange={e => setDraftFilters({ ...draftFilters, OrderBy: e.target.value })}>
                {taskOrderBy.map(o => <option key={o} value={o}>{o}</option>)}
              </select>

              <label>Kolejność</label>
              <select
                value={draftFilters.Ascending.toString()}
                onChange={e => setDraftFilters({ ...draftFilters, Ascending: e.target.value === 'true' })}
              >
                <option value="true">Rosnąco</option>
                <option value="false">Malejąco</option>
              </select>

              <div className="filter-actions">
                <button onClick={applyFilters}>Zastosuj</button>
                <button onClick={() => setFilterOpen(false)}>Anuluj</button>
              </div>
            </div>
          )}
        </div>

        <div className="sections-container">
          <div className="sections-wrapper">
            {sections.map(section => (
              <TaskProvider
                key={section.id}
                teamId={team.id}
                sectionId={section.id}
                filters={appliedFilters}
              >
                <Section
                  section={section}
                  teamId={team.id}
                  isAdmin={isAdmin}
                />
              </TaskProvider>
            ))}

            {isAdmin && (
              <button className="add-section-btn" onClick={() => setShowSectionModal(true)}>
                <FaPlus /> Dodaj sekcję
              </button>
            )}
          </div>
        </div>

        {showSectionModal && (
          <SectionModal
            onClose={() => setShowSectionModal(false)}
            onSave={handleAddSection}
          />
        )}
      </div>
    </div>
  );
};

export default TeamPage;
