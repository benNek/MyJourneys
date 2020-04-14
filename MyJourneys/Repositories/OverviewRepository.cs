using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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

        public void AddJourneyOverview(string userId, string title, List<JourneyOverviewUploadViewModel> models)
        {
            var journey = new OverviewJourney
            {
                Title = title,
                UserId = userId
            };
            _context.OverviewJourneys.Add(journey);
            _context.SaveChanges();

            models.ForEach(async model =>
            {
                var file = model.File;
                if (file.Length <= 0) return;

                var filePath = Path.Combine(_config["FileStorage:Path"],
                    Guid.NewGuid() + Path.GetExtension(file.FileName));

                await using (var stream = File.Create(filePath))
                {
                    await file.CopyToAsync(stream);
                }

                _context.LocationPhotos.Add(new LocationPhoto
                {
                    Path = filePath,
                    Date = model.Date,
                    Latitude = model.Latitude,
                    Longitude = model.Longitude,
                    OverviewJourneyId = journey.Id
                });
            });
            var a = _context.LocationPhotos.ToList();
            _context.SaveChanges();
        }
    }
}