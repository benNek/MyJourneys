using System.Threading.Tasks;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Services
{
    public interface IUserService
    {
        public Task<bool> Register(UserAuthViewModel model);
    }
}