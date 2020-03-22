using System;

namespace MyJourneys.Models.ViewModels
{
    public class JourneyItemViewModel
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
        
        // Flight item
        public string Airline { get; set; }
        public string FlightNumber { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        
    }
}