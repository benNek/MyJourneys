using System;

namespace MyJourneys.Models.ViewModels
{
    public class JourneyCreationViewModel
    {
        public string Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}