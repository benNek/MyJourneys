using System.Threading.Tasks;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Services
{
    public interface IUserService
    {
        public Task<bool> Register(UserRegisterViewModel model);
        public Task<bool> Login(UserLoginViewModel model);
        public Task<string> RequestToken(string email);
    }
}