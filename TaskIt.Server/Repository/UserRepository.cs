using Microsoft.EntityFrameworkCore;
using TaskIt.Server.Core.Entities;
using TaskIt.Server.Data;

namespace TaskIt.Server.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context; // Wstrzykiwanie zależności 
        }
        public async Task<Users?> GetUserById(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        }
        public async Task<Users?> GetUserByEmail(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
        public async Task<Users?> GetUserByUsername(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }
        public void AddUser(Users user)
        {
            _context.Users.Add(user);
        }
        public void UpdateUser(Users user)
        {
            _context.Users.Update(user);
        }
        public void DeleteUser(Users user)
        {
            _context.Users.Remove(user);
        }

        public int SaveChanges()
        {
            return _context.SaveChanges();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
