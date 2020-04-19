using System.IO;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Unsplash.Photos;
using Unsplash.Requests;

namespace MyJourneys.Repositories
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly IConfiguration _config;

        public PhotoRepository(IConfiguration configuration)
        {
            _config = configuration;
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
    }
}