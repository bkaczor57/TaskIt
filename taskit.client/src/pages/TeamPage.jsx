import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeamSidebar from '../components/TeamSidebar/TeamSidebar';
import { FaPlus, FaCog, FaFilter } from 'react-icons/fa';
import TeamContext from '../context/TeamContext';
import SectionModal from '../components/modals/SectionModal';
import Section from '../components/Section/Section';
import UserTeamContext from '../context/UserTeamContext';
import UserContext from '../context/UserContext';
import { useSections } from '../context/SectionContext';
import { useEnums } from '../context/EnumContext';
import { useTasks } from '../context/TaskContext';
import FilterPanel from '../components/FilteredPanel/TeamFilteredPanel';
import TaskCard from '../components/Task/TaskCard';
import './TeamPage.css';

import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import SectionService from '../services/SectionService';

const TeamPage = ({ filters, setFilters }) => {
  /* ---------- konteksty ---------- */
  const { updateTask, tasks } = useTasks();
  const { moveSectionLocal, sections, createSection } = useSections();
  const { taskStatuses, taskPriorities, taskOrderBy } = useEnums();

  const { user } = useContext(UserContext);
  const { getTeamById, deleteTeam } = useContext(TeamContext);
  const { teamUsers, removeUserFromTeam, fetchUserTeams } =
    useContext(UserTeamContext);

  /* ---------- routing / state ---------- */
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showTeamSidebar, setShowTeamSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  /* ---------- drag‑n‑drop helpers ---------- */
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [orderedSections, setOrderedSections] = useState(sections);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 }, // opóźnienie dla scrolla
    }),
  );

  /* ---------- ef. pobrania zespołu ---------- */
  const fetchTeam = useCallback(async () => {
    try {
      const data = await getTeamById(Number(teamId));
      setTeam(data);
    } catch (err) {
      console.error('Błąd pobierania zespołu:', err);
    }
  }, [teamId, getTeamById]);

  useEffect(() => { fetchTeam(); }, [fetchTeam]);

  /* ---------- responsywność ---------- */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ---------- sekcje <-> state ---------- */
  useEffect(() => { setOrderedSections(sections); }, [sections]);

  /* ---------- filtry ---------- */
  const [draftFilters, setDraftFilters] = useState(filters);
  const applyFilters = () => { setFilters(draftFilters); setFilterOpen(false); };

  /* ---------- akcje sekcji ---------- */
  const handleAddSection = async (title) => {
    try {
      const s = await createSection(title);
      setShowSectionModal(false);
      // opcjonalnie wyróżnianie nowej sekcji…  
    } catch (err) { console.error('Błąd tworzenia sekcji:', err); }
  };

  /* ---------- drag‑n‑drop ---------- */
  const handleDragStart = ({ active }) => {
    if (tasks.some((t) => t.id === active.id)) {
      setActiveTaskId(active.id);
      // Ukryj oryginalny element podczas przeciągania
      const element = document.querySelector(`[data-task-id="${active.id}"]`);
      if (element) element.style.opacity = '0';
    } else {
      setActiveSectionId(active.id);
      // Ukryj oryginalną sekcję podczas przeciągania
      const element = document.querySelector(`[data-section-id="${active.id}"]`);
      if (element) element.style.opacity = '0';
    }
  };

  const handleDragEnd = useCallback(
    async ({ active, over }) => {
      // Przywróć widoczność elementów
      const taskElement = document.querySelector(`[data-task-id="${active.id}"]`);
      const sectionElement = document.querySelector(`[data-section-id="${active.id}"]`);
      if (taskElement) taskElement.style.opacity = '1';
      if (sectionElement) sectionElement.style.opacity = '1';

      if (!over || active.id === over.id) {
        setActiveTaskId(null);
        setActiveSectionId(null);
        return;
      }

      /* --- TASK przenoszony --- */
      const draggedTask = tasks.find((t) => t.id === active.id);
      if (draggedTask) {
        if (draggedTask.sectionId !== over.id) {
          try {
            await updateTask(draggedTask.id, { sectionId: over.id });
          } catch (err) {
            console.error('Błąd aktualizacji zadania:', err);
          }
        }
        setActiveTaskId(null);
        return;
      }

      /* --- SEKCJA przenoszona --- */
      const oldIdx = orderedSections.findIndex((s) => s.id === active.id);
      const newIdx = orderedSections.findIndex((s) => s.id === over.id);
      const newOrder = arrayMove(orderedSections, oldIdx, newIdx);

      try {
        await SectionService.move(team.id, Number(active.id), newIdx + 1);
        setOrderedSections(newOrder);
        moveSectionLocal(active.id, newIdx);
      } catch (err) {
        console.error('Błąd przenoszenia sekcji:', err);
      }
      setActiveSectionId(null);
    },
    [tasks, orderedSections, team?.id, updateTask, moveSectionLocal],
  );

  /* ---------- uprawnienia ---------- */
  const role = teamUsers.find((u) => u.id === user?.id)?.role;
  const isAdmin = role === 'Admin';

  if (!team) return <div className="loading">Ładowanie…</div>;

  return (
    <div className={`team-page ${showTeamSidebar ? 'sidebar-open' : ''}`}>
      {/* ----- sidebar z info o zespole ----- */}
      <TeamSidebar
        team={team}
        isMobile={isMobile}
        isVisible={showTeamSidebar}
        onClose={() => setShowTeamSidebar(false)}
        onDeleteTeam={async () => {
          if (window.confirm('Usunąć zespół?')) {
            await deleteTeam(team.id); await fetchUserTeams(); navigate('/dashboard');
          }
        }}
        onLeaveTeam={async () => {
          if (window.confirm('Opuścić zespół?')) {
            await removeUserFromTeam(team.id, user.id); await fetchUserTeams(); navigate('/dashboard');
          }
        }}
        onTeamUpdated={fetchTeam}
      />

      {/* ----- główna treść ----- */}
      <div className="team-content">
        <header className="team-header">
          <h1 className="team-title">{team.name}</h1>
          <div className="header-actions">
            <button onClick={() => setFilterOpen(true)} className="filter-toggle">
              <FaFilter /> Filtracja
            </button>
            <button onClick={() => setShowTeamSidebar(!showTeamSidebar)} className="team-settings-toggle">
              <FaCog />
            </button>
          </div>
        </header>

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

        {/* ----- kanban ----- */}
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
                {orderedSections.map((section) => (
                  <Section
                    key={section.id}
                    section={section}
                    teamId={team.id}
                    isAdmin={isAdmin}
                  />
                ))}

                {isAdmin && (
                  <button
                    className="add-section-btn"
                    onClick={() => setShowSectionModal(true)}
                  >
                    <FaPlus /> Dodaj sekcję
                  </button>
                )}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeTaskId && (
                <TaskCard
                  task={tasks.find((t) => t.id === activeTaskId)}
                  isDragOverlay
                />
              )}
            </DragOverlay>
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
