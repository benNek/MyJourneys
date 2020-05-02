using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MyJourneys.Repositories
{
    public interface IPhotoRepository
    {
        Task<bool> SaveLocationPhoto(string location);
        void SaveOverviewPhoto(IFormFile file, string path);
        void DeletePhoto(string path);
    }
}