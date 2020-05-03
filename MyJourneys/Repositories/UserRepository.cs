using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using MyJourneys.Data;
using MyJourneys.Models;

namespace MyJourneys.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly string writer = "Writer";
        private readonly string deniedWriter = "DeniedWriter";
        private readonly string admin = "Admin";

        private readonly TravelContext _context;
        private readonly UserManager<User> _userManager;

        public UserRepository(UserManager<User> userManager, TravelContext travelContext = null)
        {
            _context = travelContext ?? new TravelContext();
            _userManager = userManager;
        }

        public bool UserWithNameExists(string username)
        {
            return _context.Users.Any(user => user.UserName.Equals(username));
        }

        public User GetUser(string username)
        {
            return _context.Users.FirstOrDefault(user => user.UserName.Equals(username));
        }

        public User GetUserById(string id)
        {
            return _context.Users.FirstOrDefault(user => user.Id.Equals(id));
        }

        public bool UserWithEmailExists(string email)
        {
            return _context.Users.Any(user => user.Email.Equals(email));
        }

        public bool HasDeniedWriterRole(string userId)
        {
            return HasRole(userId, deniedWriter);
        }

        public bool HasWriterRole(string userId)
        {
            return HasRole(userId, writer);
        }

        public bool HasAdminRole(string userId)
        {
            return HasRole(userId, admin);
        }

        public List<string> GetUnapprovedAuthors()
        {
            var users = _context.Articles.Where(article => !article.Confirmed)
                .Select(article => article.Author)
                .Distinct().ToList();

            return users.Where(user => !HasDeniedWriterRole(user.Id)).Select(user => user.UserName).ToList();
        }

        public async Task<string> ApproveAuthor(string name)
        {
            var user = await _userManager.FindByNameAsync(name);
            if (user == null)
            {
                return null;
            }

            if (!await _userManager.IsInRoleAsync(user, writer))
                await _userManager.AddToRoleAsync(user, writer);

            return user.UserName;
        }

        public async Task<string> BlockAuthor(string name)
        {
            var user = await _userManager.FindByNameAsync(name);
            if (user == null)
            {
                return null;
            }

            if (!await _userManager.IsInRoleAsync(user, deniedWriter))
                await _userManager.AddToRoleAsync(user, deniedWriter);

            return user.UserName;
        }

        private bool HasRole(string userId, string roleName)
        {
            string roleId = _context.Roles
                .Where(role => role.NormalizedName.Equals(roleName))
                .Select(role => role.Id)
                .FirstOrDefault();

            return _context.UserRoles
                .Where(userRole => userRole.UserId.Equals(userId))
                .Any(role => role.RoleId.Equals(roleId));
        }
    }
}