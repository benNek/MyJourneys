using System;
using Microsoft.AspNetCore.Http;

namespace MyJourneys.Models.ViewModels
{
    public class JourneyOverviewUploadViewModel
    {
        public IFormFile File { get; set; }
        public DateTime Date { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public JourneyOverviewUploadViewModel(IFormFile file, DateTime date, double latitude, double longitude)
        {
            File = file;
            Date = date;
            Latitude = latitude;
            Longitude = longitude;
        }
    }
}