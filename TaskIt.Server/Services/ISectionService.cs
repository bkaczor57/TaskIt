using TaskIt.Server.DTOs;
using TaskIt.Server.Requests;

namespace TaskIt.Server.Services
{
    public interface ISectionService
    {
        Task<ServiceResult<SectionDTO>> CreateSection(int teamId, SectionCreateRequest request);
        Task<ServiceResult<SectionDTO>> GetSectionById(int sectionId);
        Task<ServiceResult<List<SectionDTO>>> GetSectionsByTeamId(int teamId);
        Task<ServiceResult<SectionDTO>> UpdateSection(int sectionId, SectionCreateRequest request);
        Task<ServiceResult<bool>> DeleteSection(int sectionId);

        Task<ServiceResult<bool>> MoveSection(int teamId, int sectionId, int newPosition);
    }
}
