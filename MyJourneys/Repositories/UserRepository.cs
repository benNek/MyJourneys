using System.Linq;
using MyJourneys.Data;
using MyJourneys.Models;

namespace MyJourneys.Repositories
{
    public class UserRepository : IUserRepository
    {

        private TravelContext _context;

        public UserRepository()
        {
            _context = new TravelContext();
        }
        
        public bool UserWithNameExists(string username)
        {
            return _context.Users.Any(user => user.UserName.Equals(username));
        }

        public User GetUser(string username)
        {
            
            return _context.Users.First(user => user.UserName.Equals(username));
        }

        public bool UserWithEmailExists(string email)
        {
            return _context.Users.Any(user => user.Email.Equals(email));
        }
    }
}