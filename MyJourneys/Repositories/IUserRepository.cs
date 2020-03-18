using MyJourneys.Models;

namespace MyJourneys.Repositories
{
    public interface IUserRepository
    {
        bool UserWithNameExists(string username);
        User GetUser(string username);
        User GetUserById(string id);
        bool UserWithEmailExists(string email);
    }
}