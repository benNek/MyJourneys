using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;
using MyJourneys.Utils;
using static MyJourneys.Utils.AuthUtils;

namespace MyJourneys.Controllers
{
    [Route("api/[controller]")]
    public class OverviewController : Controller
    {
        private readonly IOverviewRepository _overviewRepository;
        private readonly IConfiguration _config;

        public OverviewController(IOverviewRepository overviewRepository, IConfiguration configuration)
        {
            _overviewRepository = overviewRepository;
            _config = configuration;
        }

        [HttpGet]
        [Authorize]
        public IEnumerable<OverviewJourneyPreviewViewModel> GetOverviewJourneys([FromQuery] int year = 0)
        {
            // Year 0 represents all years
            var userId = GetUserId(User);
            return _overviewRepository.GetJourneyOverviews(userId, year);
        }

        [HttpGet("{id}")]
        [Authorize]
        public ActionResult<OverviewJourneyViewModel> GetOverviewJourney(int id)
        {
            var userId = GetUserId(User);
            if (!_overviewRepository.IsUsersJourney(userId, id))
            {
                return StatusCode(403, "Journey doesn't belong to the user");
            }

            return Ok(_overviewRepository.GetJourneyOverview(id));
        }

        [HttpPost]
        [Authorize]
        public IActionResult UploadPhotos([FromForm] string title, [FromForm] IFormFile[] files,
            [FromForm] string[] dates, [FromForm] string[] latitudes, [FromForm] string[] longitudes,
            [FromForm] string[] countries)
        {
            var maxSize = _config.GetValue<long>("FileStorage:SizeLimit");
            var allowedExtensions = new List<string>(_config["FileStorage:AllowedExtensions"].Split(','));

            var userId = GetUserId(User);
            int length = files.Length;
            length = Math.Min(length, dates.Length);
            length = Math.Min(length, longitudes.Length);
            length = Math.Min(length, latitudes.Length);
            List<JourneyOverviewUploadViewModel> models = new List<JourneyOverviewUploadViewModel>();
            for (int i = 0; i < length; i++)
            {
                var file = files[i];
                if (file.Length > maxSize)
                {
                    var formattedMaxSize = FileUtils.ConvertBytesToMegaBytes(maxSize);
                    return StatusCode(413,
                        $"Single file ({file.FileName}) exceeds the limit ({formattedMaxSize} megabytes)");
                }

                var extension = Path.GetExtension(file.FileName);
                if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
                {
                    return StatusCode(422,
                        $"File extension is not whitelisted for file ({file.FileName})! only .jpg and .png are allowed");
                }

                if (!FileUtils.IsValidImageSignature(file))
                {
                    return StatusCode(422,
                        $"Failed to match file ({file.FileName}) signature to any of known file extensions");
                }

                try
                {
                    models.Add(new JourneyOverviewUploadViewModel(file, Convert.ToDateTime(dates[i]),
                        Double.Parse(latitudes[i]), Double.Parse(longitudes[i])));
                }
                catch (Exception)
                {
                    return StatusCode(422, "Failed to parse data");
                }
            }

            List<Country> countryList = new List<Country>();
            foreach (var countryCode in countries)
            {
                var country = _overviewRepository.GetCountry(countryCode);
                if (country != null)
                {
                    countryList.Add(country);
                }
            }

            _overviewRepository.AddJourneyOverview(userId, title, countryList, models);
            return Ok("Photos have been uploaded successfully");
        }

        [HttpGet("countries")]
        [Authorize]
        public List<string> GetVisitedCountries([FromQuery] int year = 0)
        {
            // Year 0 represents all years
            var userId = GetUserId(User);
            return _overviewRepository.GetVisitedCountries(userId, year);
        }

        [HttpGet("years")]
        [Authorize]
        public List<int> GetTravelingYears()
        {
            var userId = GetUserId(User);
            return _overviewRepository.GetTravelingYears(userId);
        }
    }
}