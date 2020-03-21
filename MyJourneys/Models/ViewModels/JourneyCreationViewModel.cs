using System;

namespace MyJourneys.Models.ViewModels
{
    public class JourneyCreationViewModel
    {
        public string UserId { get; set; }
        public string Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}