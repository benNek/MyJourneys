using System;
using Microsoft.AspNetCore.Http;

namespace MyJourneys.Models.ViewModels
{
    public class JourneyOverviewUploadViewModel
    {
        public IFormFile File { get; }
        public DateTime Date { get; }
        public double Latitude { get; }
        public double Longitude { get; }

        public JourneyOverviewUploadViewModel(IFormFile file, DateTime date, double latitude, double longitude)
        {
            File = file;
            Date = date;
            Latitude = latitude;
            Longitude = longitude;
        }
    }
}