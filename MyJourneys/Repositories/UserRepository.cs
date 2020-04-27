using System;
using System.Linq;
using MyJourneys.Data;
using MyJourneys.Models;

namespace MyJourneys.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly String writer = "Writer";
        private readonly TravelContext _context;

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

        public User GetUserById(string id)
        {
            return _context.Users.First(user => user.Id.Equals(id));
        }

        public bool UserWithEmailExists(string email)
        {
            return _context.Users.Any(user => user.Email.Equals(email));
        }

        public bool HasWriterRole(string userId)
        {
            string roleId = _context.Roles
                .Where(role => role.NormalizedName.Equals(writer))
                .Select(role => role.Id)
                .FirstOrDefault();

            if (roleId == null)
            {
                return false;
            }
            return _context.UserRoles
                .Where(userRole => userRole.UserId.Equals(userId))
                .Any(role => role.RoleId.Equals(roleId));
        }
    }
}