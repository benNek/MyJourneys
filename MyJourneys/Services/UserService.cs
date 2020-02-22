using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;

namespace MyJourneys.Services
{
    public class UserService : IUserService
    {

        private IConfiguration _configuration;
        private IUserRepository _userRepository;
        private UserManager<User> _userManager;
        private SignInManager<User> _signInManager;
        
        public UserService(IConfiguration configuration, IUserRepository userRepository, UserManager<User> userManager,
            SignInManager<User> signInManager)
        {
            _configuration = configuration;
            _userRepository = userRepository;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<bool> Register(UserAuthViewModel model)
        {
            var user = new User
            {
                UserName = model.Username,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            return result.Succeeded;
        }
    }
}