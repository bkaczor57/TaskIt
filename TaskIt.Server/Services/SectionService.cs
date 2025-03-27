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
            var section = new Sections
            {
                Title = request.Title,
                TeamId = teamId
            };

            _sectionRepository.AddSection(section);
            await _sectionRepository.SaveChangesAsync();

            var sectionDTO = new SectionDTO
            {
                SectionId = section.Id,
                Title = section.Title,
                TeamId = section.TeamId
            };

            return ServiceResult<SectionDTO>.Ok(sectionDTO);
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
                SectionId = section.Id,
                Title = section.Title,
                TeamId = section.TeamId
            };
            return ServiceResult<SectionDTO>.Ok(sectionDTO);
        }

        public async Task<ServiceResult<List<SectionDTO>>> GetSectionsByTeamId(int teamId)
        {
            var sections = await _sectionRepository.GetSectionsByTeamId(teamId);
            var sectionDTOs = sections.Select(s => new SectionDTO
            {
                SectionId = s.Id,
                Title = s.Title,
                TeamId = s.TeamId
            }).ToList();
            return ServiceResult<List<SectionDTO>>.Ok(sectionDTOs);
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
                SectionId = section.Id,
                Title = section.Title,
                TeamId = section.TeamId
            };
            return ServiceResult<SectionDTO>.Ok(sectionDTO);
        }

        public async Task<ServiceResult<bool>> DeleteSection(int sectionId)
        {
            var section = await _sectionRepository.GetSectionById(sectionId);
            if (section == null)
            {
                return ServiceResult<bool>.Fail("Section not found");
            }
            _sectionRepository.DeleteSection(section);
            await _sectionRepository.SaveChangesAsync();
            return ServiceResult<bool>.Ok(true);
        }


    }
}
