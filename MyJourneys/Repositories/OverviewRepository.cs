using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using MyJourneys.Data;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public class OverviewRepository : IOverviewRepository
    {
        private readonly TravelContext _context;
        private readonly IConfiguration _config;

        public OverviewRepository(IConfiguration configuration)
        {
            _context = new TravelContext();
            _config = configuration;
        }

        public List<OverviewJourneyPreviewViewModel> GetJourneyOverviews(string userId, int year)
        {
            var query = _context.OverviewJourneys.Where(journey => journey.UserId.Equals(userId));
            if (year != 0)
            {
                query = query.Where(journey => journey.LocationPhotos.Any(photo => photo.Date.Year == year));
            }

            return query.Select(journey => new OverviewJourneyPreviewViewModel
                {
                    Id = journey.Id,
                    Title = journey.Title,
                    CoverPhoto = journey.LocationPhotos.FirstOrDefault()
                })
                .Where(journey => journey.CoverPhoto != null)
                .ToList();
        }

        public void AddJourneyOverview(string userId, string title, List<Country> countries,
            List<JourneyOverviewUploadViewModel> models)
        {
            var journey = new OverviewJourney
            {
                Title = title,
                UserId = userId
            };
            _context.OverviewJourneys.Add(journey);
            _context.SaveChanges();

            AddCountriesToJourney(journey.Id, countries);

            models.ForEach(model =>
            {
                var file = model.File;
                if (file.Length <= 0) return;

                var filePath = Path.Combine(_config["FileStorage:Path"],
                    Guid.NewGuid() + Path.GetExtension(file.FileName));

                SaveFile(file, filePath);
                _context.LocationPhotos.Add(new LocationPhoto
                {
                    Path = filePath,
                    Date = model.Date,
                    Latitude = model.Latitude,
                    Longitude = model.Longitude,
                    OverviewJourneyId = journey.Id
                });
            });
            _context.SaveChanges();
        }

        private void AddCountriesToJourney(int journeyId, List<Country> countries)
        {
            foreach (var country in countries)
            {
                _context.OverviewJourneysCountries.Add(new OverviewJourneysCountries
                {
                    OverviewJourneyId = journeyId,
                    CountryId = country.Id
                });
            }

            _context.SaveChanges();
        }

        private void SaveFile(IFormFile file, string path)
        {
            using (var stream = File.Create(path))
            {
                file.CopyTo(stream);
            }
        }

        public Country GetCountry(string alpha2)
        {
            return _context.Countries.FirstOrDefault(country => country.Alpha2.Equals(alpha2));
        }

        public List<string> GetVisitedCountries(string userId, int year)
        {
            var query = _context.OverviewJourneys.Where(journey => journey.UserId.Equals(userId));

            if (year != 0)
            {
                query = query.Where(journey => journey.LocationPhotos.Any(photo => photo.Date.Year == year));
            }

            return query
                .SelectMany(journey => journey.OverviewJourneysCountries)
                .Select(journeyCountries => journeyCountries.Country.Alpha3)
                .Distinct()
                .ToList();
        }

        public List<int> GetTravelingYears(string userId)
        {
            return _context.LocationPhotos.Select(photo => photo.Date.Year).Distinct().ToList();
        }
    }
}