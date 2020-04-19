using System.Threading.Tasks;

namespace MyJourneys.Repositories
{
    public interface IPhotoRepository
    {
        Task<bool> SaveLocationPhoto(string location);
    }
}