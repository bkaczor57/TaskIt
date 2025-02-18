namespace TaskIt.Server.Services
{
    public interface IAuthService
    {
        string Register(string email, string username, string password);
        string Login(string email, string password);
    }
}
