import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeamSidebar from '../components/TeamSidebar/TeamSidebar';
import { FaPlus, FaCog, FaFilter } from 'react-icons/fa';
import TeamContext from '../context/TeamContext';
import SectionModal from '../components/modals/SectionModal';
import Section from '../components/Section/Section';
import UserTeamContext from '../context/UserTeamContext';
import UserContext from "../context/UserContext";
import { useSections } from '../context/SectionContext';
import { useEnums } from '../context/EnumContext';
import { TaskProvider } from '../context/TaskContext';
import FilterPanel from '../components/FilteredPanel/TeamFilteredPanel';
import './TeamPage.css';

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import SectionService from '../services/SectionService'; // nowa metoda move


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

  const { moveSectionLocal } = useSections();
  const { user } = useContext(UserContext);
  const { taskStatuses, taskPriorities, taskOrderBy } = useEnums();
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { getTeamById, deleteTeam } = useContext(TeamContext);
  const { teamUsers, removeUserFromTeam, fetchUserTeams } = useContext(UserTeamContext);
  const { sections, createSection } = useSections();
  const [team, setTeam] = useState(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showTeamSidebar, setShowTeamSidebar] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: 0,
        tolerance: 5,
      },
    }),
  );
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [orderedSections, setOrderedSections] = useState(sections);
  const [newSectionId, setNewSectionId] = useState(null);
  const [removingSectionId, setRemovingSectionId] = useState(null);

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
        await fetchUserTeams();
        navigate('/dashboard');
      } catch (error) {
        console.error('Błąd podczas usuwania grupy:', error);
      }
    }
  };

  const handleLeaveTeam = async () => {
    if (window.confirm('Czy na pewno chcesz opuścić grupę? ')) {
      try {
        await removeUserFromTeam(parseInt(teamId), user.id);
        await fetchUserTeams();
        navigate('/dashboard');
      } catch (error) {
        console.error('Błąd podczas wychodzenia z grupy', error);
      }
    }
  };

  const handleAddSection = async (title) => {
    try {
      const newSection = await createSection(title);
      setNewSectionId(newSection.id);
      setShowSectionModal(false);
      setTimeout(() => setNewSectionId(null), 300); // czas trwania animacji
    } catch (err) {
      console.error('Błąd podczas tworzenia sekcji:', err);
    }
  };

  const handleDelete = async (sectionId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę sekcję?')) return;

    try {
      setRemovingSectionId(sectionId);
      setTimeout(async () => {
        await deleteSection(sectionId);
        setRemovingSectionId(null);
      }, 300); // czas trwania animacji
    } catch (err) {
      console.error('Błąd podczas usuwania sekcji:', err);
      setRemovingSectionId(null);
    }
  };

  useEffect(() => setOrderedSections(sections), [sections]);

  const handleDragStart = useCallback(({ active }) => {
    setActiveSectionId(active.id);
  }, []);

  const handleDragEnd = useCallback(async ({ active, over }) => {
    setActiveSectionId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = orderedSections.findIndex((s) => s.id === active.id);
    const newIndex = orderedSections.findIndex((s) => s.id === over.id);
    const newOrder = arrayMove(orderedSections, oldIndex, newIndex);
    
    try {
      await SectionService.move(team.id, Number(active.id), newIndex + 1);
      setOrderedSections(newOrder);
      moveSectionLocal(active.id, newIndex);
    } catch (e) {
      console.error('Błąd aktualizacji pozycji sekcji:', e);
      setOrderedSections(orderedSections);
    }
  }, [orderedSections, team?.id, moveSectionLocal]);

  const activeSection = orderedSections.find((s) => s.id === activeSectionId);

  const currentUser = teamUsers?.find(u => u.id === user?.id);
  const isAdmin = currentUser?.role === 'Admin';

  if (!team) return <div className="loading">Ladowanie...</div>;

  return (
    <div className={`team-page ${showTeamSidebar ? 'sidebar-open' : ''}`}>
      <TeamSidebar
        team={team}
        isMobile={isMobile}
        isVisible={showTeamSidebar}
        onClose={() => setShowTeamSidebar(false)}
        onDeleteTeam={handleDeleteTeam}
        onLeaveTeam={handleLeaveTeam}
        onTeamUpdated={fetchTeam}
      />

      <div className="team-content">
        <div className="team-header">
          <h1 className="team-title">{team.name}</h1>
          <div className="header-actions">
            <button className="filter-toggle" onClick={() => setFilterOpen(true)}>
              <FaFilter /> Filtracja
            </button>
            <button className="team-settings-toggle" onClick={() => setShowTeamSidebar(!showTeamSidebar)}>
              <FaCog />
            </button>
          </div>
        </div>

        {filterOpen && (
          <FilterPanel
            draftFilters={draftFilters}
            setDraftFilters={setDraftFilters}
            applyFilters={applyFilters}
            onClose={() => setFilterOpen(false)}
            teamUsers={teamUsers}
            taskStatuses={taskStatuses}
            taskPriorities={taskPriorities}
            taskOrderBy={taskOrderBy}
          />
        )}

        <div className="sections-container">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedSections.map((s) => s.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="sections-grid">
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
                      className={`${section.id === newSectionId ? 'new' : ''} ${
                        section.id === removingSectionId ? 'removing' : ''
                      }`}
                    />
                  </TaskProvider>
                ))}

                {isAdmin && (
                  <button className="add-section-btn" onClick={() => setShowSectionModal(true)}>
                    <FaPlus /> Dodaj sekcję
                  </button>
                )}
              </div>
            </SortableContext>
          </DndContext>
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