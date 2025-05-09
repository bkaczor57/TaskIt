import {useState} from 'react';
import './TeamFilteredPanel.css';
import { FaTimes } from 'react-icons/fa';



const FilterPanel = ({ draftFilters, setDraftFilters, applyFilters, onClose, userTeams, taskStatuses, taskPriorities, taskOrderBy }) => {

    const clearFilters = () => {
      setDraftFilters({
        Status: '',
        Priority: '',
        TeamIds: [],
        CreatedAfter: '',
        CreatedBefore: '',
        DueAfter: '',
        DueBefore: '',
        OrderBy: 'CreatedAt',
        Ascending: true,
        SearchTerm: '',
      });
    };

  return (
    <div className="filter-overlay">
      <div className="filter-panel">
        <button className="close-btn" onClick={onClose}><FaTimes /></button>
        <h2>Filtruj zadania</h2>

        <div className="filter-grid">

          <div className="filter-group">
            <label>Status</label>
            <select value={draftFilters.Status || ''} onChange={e => setDraftFilters({ ...draftFilters, Status: e.target.value })}>
              <option value="">--</option>
              {taskStatuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Priorytet</label>
            <select value={draftFilters.Priority || ''} onChange={e => setDraftFilters({ ...draftFilters, Priority: e.target.value })}>
              <option value="">--</option>
              {taskPriorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Twoje zespoły</label>
            <div className="dropdown-checkbox">
              <button
                className="dropdown-toggle"
                onClick={(e) => {
                  e.preventDefault();
                  const dropdown = e.currentTarget.nextSibling;
                  dropdown.classList.toggle('open');
                }}
              >
                Wybierz zespoły
              </button>
              <div className="dropdown-menu">
                {userTeams.map(team => (
                  <label key={team.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={draftFilters.TeamIds?.includes(team.id) || false}
                      onChange={() => {
                        const current = draftFilters.TeamIds || [];
                        const updated = current.includes(team.id)
                          ? current.filter(id => id !== team.id)
                          : [...current, team.id];
                        setDraftFilters({ ...draftFilters, TeamIds: updated });
                      }}
                    />
                    {team.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <fieldset className="filter-group wide">
            <legend>Data utworzenia</legend>
            <div className="filter-dates">
              <div>
                <label>Od</label>
                <input type="date" value={draftFilters.CreatedAfter || ''} onChange={e => setDraftFilters({ ...draftFilters, CreatedAfter: e.target.value })} />
              </div>
              <div>
                <label>Do</label>
                <input type="date" value={draftFilters.CreatedBefore || ''} onChange={e => setDraftFilters({ ...draftFilters, CreatedBefore: e.target.value })} />
              </div>
            </div>
          </fieldset>

          <fieldset className="filter-group wide">
            <legend>Termin</legend>
            <div className="filter-dates">
              <div>
                <label>Od</label>
                <input type="date" value={draftFilters.DueAfter || ''} onChange={e => setDraftFilters({ ...draftFilters, DueAfter: e.target.value })} />
              </div>
              <div>
                <label>Do</label>
                <input type="date" value={draftFilters.DueBefore || ''} onChange={e => setDraftFilters({ ...draftFilters, DueBefore: e.target.value })} />
              </div>
            </div>
          </fieldset>

          <div className="filter-group">
            <label>Sortuj według</label>
            <select value={draftFilters.OrderBy} onChange={e => setDraftFilters({ ...draftFilters, OrderBy: e.target.value })}>
              {taskOrderBy.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Kolejność</label>
            <select
              value={draftFilters.Ascending.toString()}
              onChange={e => setDraftFilters({ ...draftFilters, Ascending: e.target.value === 'true' })}
            >
              <option value="true">Rosnąco</option>
              <option value="false">Malejąco</option>
            </select>
          </div>
        </div>

        <div className="form-buttons">
          <button className="btn-primary" onClick={applyFilters}>Zastosuj</button>
          <button className="btn-secondary" onClick={clearFilters}>Wyczyść</button>
          <button className="btn-cancel" onClick={onClose}>Anuluj</button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
