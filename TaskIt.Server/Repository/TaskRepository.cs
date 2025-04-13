using Microsoft.EntityFrameworkCore;
using TaskIt.Server.Core.Entities;
using TaskIt.Server.Data;
using TaskIt.Server.Repository;

public class TasksRepository : ITaskRepository
{
    private readonly AppDbContext _context;

    public TasksRepository(AppDbContext context)
    {
        _context = context;
    }

    public IQueryable<Tasks> GetAllQueryable()
    {
        return _context.Tasks.AsNoTracking().AsQueryable();
    }

    public async Task<Tasks?> GetByIdAsync(
        int id,
        bool includeSection = false,
        bool includeAssignedUser = false,
        bool includeTeam = false)
    {
        var query = _context.Tasks.AsNoTracking().AsQueryable();

        if (includeSection)
            query = query.Include(t => t.Section);

        if (includeAssignedUser)
            query = query.Include(t => t.AssignedUser);

        if (includeTeam)
            query = query.Include(t => t.Section).ThenInclude(s => s.Team);

        return await query.FirstOrDefaultAsync(t => t.Id == id);
    }

    public void AddTask(Tasks task)
    {
        _context.Tasks.Add(task);
    }

    public void UpdateTask(Tasks task)
    {
        _context.Tasks.Update(task);
    }

    public void DeleteTask(Tasks task)
    {
        _context.Tasks.Remove(task);
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}
