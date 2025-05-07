import React, { createContext, useContext, useState, useEffect } from 'react';
import SectionService from '../services/SectionService';
import { useParams } from 'react-router-dom';

const SectionContext = createContext();

 //SectionProvider - dostarcza dane sekcji i operacje na sekcjach dla komponentów potomnych.
 
export const SectionProvider = ({ children }) => {
  const { teamId } = useParams();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
  * Optimistycznie zmienia kolejność sekcji w kontekście (0‑based).
  * @param sectionId  id przenoszonej sekcji
  * @param newIndex   docelowy indeks w tablicy
  */
 const moveSectionLocal = (sectionId, newIndex) => {
   setSections((prev) => {
     const list = [...prev];
     const from = list.findIndex((s) => s.id === sectionId);
     if (from === -1 || from === newIndex) return prev;

     const [moving] = list.splice(from, 1);
     list.splice(newIndex, 0, moving);

     // zaktualizuj pola position, jeśli je przechowujesz
     return list.map((s, i) => ({ ...s, position: i + 1 }));
   });
 };


  
   // fetchSections - pobiera sekcje z serwera dla danego zespołu.
   
  const fetchSections = async () => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      const data = await SectionService.list(teamId);
      setSections(data || []);
      setError(null);
    } catch (err) {
      console.error('Błąd podczas pobierania sekcji:', err);
      setError('Nie udało się pobrać sekcji');
    } finally {
      setLoading(false);
    }
  };


   //createSection - tworzy nową sekcję i odświeża listę.

  const createSection = async (title) => {
    if (!teamId) {
      throw new Error('Brak ID grupy');
    }

    try {
      const newSection = await SectionService.create(teamId, title);
      setSections(prev => [...prev, newSection]);
      return newSection;
    } catch (err) {
      console.error('Błąd podczas tworzenia sekcji:', err);
      throw err;
    }
  };


    // updateSection - aktualizuje nazwę istniejącej sekcji i odświeża listę.

  const updateSection = async (sectionId, data) => {
    if (!teamId) {
      throw new Error('Brak ID grupy');
    }

    try {
      const updatedSection = await SectionService.update(teamId, sectionId, data);
      setSections(prev => prev.map(section => 
        section.id === sectionId ? updatedSection : section
      ));
      return updatedSection;
    } catch (err) {
      console.error('Błąd podczas aktualizacji sekcji:', err);
      throw err;
    }
  };

  
   //deleteSection - usuwa sekcję i odświeża listę.

  const deleteSection = async (sectionId) => {
    if (!teamId) {
      throw new Error('Brak ID grupy');
    }

    try {
      await SectionService.remove(teamId, sectionId);
      setSections(prev => prev.filter(section => section.id !== sectionId));
    } catch (err) {
      console.error('Błąd podczas usuwania sekcji:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSections();
  }, [teamId]);

  return (
    <SectionContext.Provider value={{
      sections,
      loading,
      error,
      createSection,
      updateSection,
      deleteSection,
      fetchSections,
      moveSectionLocal,
    }}>
      {children}
    </SectionContext.Provider>
  );
};

 // useSections - hook do pobierania danych sekcji w komponentach potomnych.

export const useSections = () => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error('useSections must be used within a SectionProvider');
  }
  return context;
};
