using System.Collections.Generic;
using System.Threading.Tasks;
using MyJourneys.Models;

namespace MyJourneys.Repositories
{
    public interface IUserRepository
    {
        bool UserWithNameExists(string username);
        User GetUser(string username);
        User GetUserById(string id);
        bool UserWithEmailExists(string email);
        bool HasDeniedWriterRole(string userId);
        bool HasWriterRole(string userId);
        bool HasAdminRole(string userId);
        List<string> GetUnapprovedAuthors();
        Task<string> ApproveAuthor(string name);
        Task<string> BlockAuthor(string name);
    }
}