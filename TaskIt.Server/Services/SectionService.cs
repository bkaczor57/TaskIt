using Microsoft.AspNetCore.Http.HttpResults;
using TaskIt.Server.Core.Entities;
using TaskIt.Server.DTOs;
using TaskIt.Server.Repository;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public class SectionService : ISectionService
    {
        private readonly ISectionRepository _sectionRepository;

        public SectionService(ISectionRepository sectionRepository)
        {
            _sectionRepository = sectionRepository;
        }

        public async Task<ServiceResult<SectionDTO>> CreateSection(int teamId, SectionCreateRequest request)
        {
            var position = await _sectionRepository.GetNextPositionForTeam(teamId);

            var section = new Sections
            {
                Title = request.Title,
                TeamId = teamId,
                Position = position         // <‑‑ ustawiamy numer
            };

            _sectionRepository.AddSection(section);
            await _sectionRepository.SaveChangesAsync();

            return ServiceResult<SectionDTO>.Ok(new SectionDTO
            {
                Id = section.Id,
                Title = section.Title,
                TeamId = teamId,
                Position = position
            });
        }

        public async Task<ServiceResult<List<SectionDTO>>> GetSectionsByTeamId(int teamId)
        {
            var sections = await _sectionRepository.GetSectionsByTeamIdOrdered(teamId);

            var dto = sections.Select(s => new SectionDTO
            {
                Id = s.Id,
                Title = s.Title,
                TeamId = teamId,
                Position = s.Position
            }).ToList();

            return ServiceResult<List<SectionDTO>>.Ok(dto);
        }

        public async Task<ServiceResult<SectionDTO>> GetSectionById(int sectionId)
        {
            var section = await _sectionRepository.GetSectionById(sectionId);
            if (section == null)
            {
                return ServiceResult<SectionDTO>.Fail("Section not found");
            }
            var sectionDTO = new SectionDTO
            {
                Id = section.Id,
                Title = section.Title,
                TeamId = section.TeamId
            };
            return ServiceResult<SectionDTO>.Ok(sectionDTO);
        }

        public async Task<ServiceResult<SectionDTO>> UpdateSection(int sectionId, SectionCreateRequest request)
        {
            var section = await _sectionRepository.GetSectionById(sectionId);
            if (section == null)
            {
                return ServiceResult<SectionDTO>.Fail("Section not found");
            }

            section.Title = request.Title;

            _sectionRepository.UpdateSection(section);
            await _sectionRepository.SaveChangesAsync();

            var sectionDTO = new SectionDTO
            {
                Id = section.Id,
                Title = section.Title,
                TeamId = section.TeamId
            };
            return ServiceResult<SectionDTO>.Ok(sectionDTO);
        }

        public async Task<ServiceResult<bool>> DeleteSection(int sectionId)
        {
            var section = await _sectionRepository.GetSectionById(sectionId);
            if (section == null)
                return ServiceResult<bool>.Fail("Section not found");

            int teamId = section.TeamId;
            int deletedPos = section.Position;

            _sectionRepository.DeleteSection(section);

            // Pobierz wszystkie sekcje z tego teamu, które mają pozycję większą
            var toShift = await _sectionRepository.GetSectionsAfterPosition(teamId, deletedPos);

            foreach (var s in toShift)
                s.Position -= 1;

            await _sectionRepository.SaveChangesAsync();
            return ServiceResult<bool>.Ok(true);
        }

        public async Task<ServiceResult<bool>> MoveSection(int teamId, int sectionId, int newPosition)
        {
            var section = await _sectionRepository.GetSectionById(sectionId);
            if (section == null || section.TeamId != teamId)
                return ServiceResult<bool>.Fail("Section not found");

            if (newPosition < 1)
                return ServiceResult<bool>.Fail("Position must be >= 1");

            // pobieramy sekcje w tym zespole
            var list = await _sectionRepository.GetSectionsByTeamIdOrdered(teamId);

            if (newPosition > list.Count)
                newPosition = list.Count;          // wpychamy na koniec

            // przesuwamy – proste podejście: re‑indeksujemy całą listę
            list.Remove(section);
            list.Insert(newPosition - 1, section);

            for (int i = 0; i < list.Count; i++)
                list[i].Position = i + 1;

            await _sectionRepository.SaveChangesAsync();

            return ServiceResult<bool>.Ok(true);
        }



    }
}
