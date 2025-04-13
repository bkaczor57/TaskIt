using TaskIt.Server.Core.Entities;

public interface ITaskRepository
{
    /// <summary>
    /// Zwraca wszystkie taski w postaci IQueryable, 
    /// aby warstwa serwisu mogła dodać filtry, sortowanie itp.
    /// </summary>
    IQueryable<Tasks> GetAllQueryable();

    /// <summary>
    /// Zwraca taska o podanym Id, z opcjonalnym wczytywaniem powiązań.
    /// </summary>
    Task<Tasks?> GetByIdAsync(int id, bool includeSection = false, bool includeAssignedUser = false, bool includeTeam = false);

    void AddTask(Tasks task);
    void UpdateTask(Tasks task);
    void DeleteTask(Tasks task);

    Task<int> SaveChangesAsync();
}
