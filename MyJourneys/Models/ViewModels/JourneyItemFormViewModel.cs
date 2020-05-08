using System;

namespace MyJourneys.Models.ViewModels
{
    public class JourneyItemFormViewModel
    {
        public int JourneyId { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Airline { get; set; }
        public string FlightNumber { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public DateTime Date { get; set; }
    }
}