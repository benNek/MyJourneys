using System.IO;
using System.IO.Abstractions;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Unsplash.Photos;
using Unsplash.Requests;

namespace MyJourneys.Repositories
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly IConfiguration _config;
        private readonly IFileSystem _fileSystem;

        public PhotoRepository(IConfiguration configuration, IFileSystem fileSystem = null)
        {
            _config = configuration;
            _fileSystem = fileSystem ?? new FileSystem();
        }

        public async Task<bool> SaveLocationPhoto(string location)
        {
            var client = new Unsplash.Client(_config["Keys:Unsplash"]);
            var request = new SearchPhotosRequest(location, null, 1, Sort.RELEVANT,
                null, null, Orientation.LANDSCAPE);
            var result = await client.SearchPhotosAsync(request);

            if (result.results.Count == 0)
            {
                return false;
            }

            var photo = result.results[0].urls.small;
            if (photo == null)
            {
                return false;
            }

            using (var webClient = new WebClient())
            {
                var localPath = Path.Combine(_config["FileStorage:LocationPath"], location.ToLower() + ".jpg");
                webClient.DownloadFile(photo, localPath);
            }

            return true;
        }

        public void SaveOverviewPhoto(IFormFile file, string path)
        {
            using var stream = _fileSystem.File.Create(path);
            file.CopyTo(stream);
        }

        public void DeletePhoto(string path)
        {
            _fileSystem.File.Delete(path);
        }
    }
}