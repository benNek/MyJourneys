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
        private readonly IPhotoRepository _photoRepository;

        public OverviewRepository(IConfiguration configuration, IPhotoRepository photoRepository)
        {
            _context = new TravelContext();
            _config = configuration;
            _photoRepository = photoRepository;
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

        public OverviewJourneyViewModel GetJourneyOverview(string userId, int journeyId)
        {
            return _context.OverviewJourneys.Where(journey => journey.Id == journeyId && journey.UserId.Equals(userId))
                .Select(journey => new OverviewJourneyViewModel
                {
                    Id = journey.Id,
                    Title = journey.Title,
                    Photos = journey.LocationPhotos
                })
                .FirstOrDefault();
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

                var filePath = Path.Combine(_config["FileStorage:OverviewPath"],
                    Guid.NewGuid() + Path.GetExtension(file.FileName));

                _photoRepository.SaveOverviewPhoto(file, filePath);
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
            return _context.LocationPhotos.Select(p => p.Date.Year).Distinct().OrderByDescending(y => y).ToList();
        }

        public void DeletePhotos(string userId)
        {
            var journeys = _context.OverviewJourneys.Where(journey => journey.UserId.Equals(userId)).ToList();
            var photos = _context.LocationPhotos.Where(photo => journeys.Contains(photo.OverviewJourney)).ToList();
            photos.ForEach(photo =>
            {
                _photoRepository.DeletePhoto(photo.Path);
            });
            _context.OverviewJourneys.RemoveRange(journeys);
            _context.SaveChanges();
        }

    }
}