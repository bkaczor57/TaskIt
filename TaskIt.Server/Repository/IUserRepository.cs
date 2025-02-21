using TaskIt.Server.Core.Entities;

namespace TaskIt.Server.Repository
{
    public interface IUserRepository
    {

        //Read
        Task<Users?> GetUserById(int id);
        Task<Users?> GetUserByEmail(string email);
        Task<Users?> GetUserByUsername(string username);
        Task<List<Users>> GetUsers();
        //Create
        void AddUser(Users user);
        //Update
        void UpdateUser(Users user);
        //Delete
        void DeleteUser(Users user);

        int SaveChanges();
        Task<int> SaveChangesAsync();
    }
}
