using System.Threading.Tasks;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Services
{
    public interface IUserService
    {
        public Task<bool> Register(RegisterViewModel model);
        public Task<bool> Login(LoginViewModel model);
        public Task<string> RequestToken(string email);
        public void Logout();
    }
}