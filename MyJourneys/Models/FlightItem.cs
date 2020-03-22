using System;

namespace MyJourneys.Models
{
    public class FlightItem : JourneyItem
    {
        public string Airline { get; set; }
        public string FlightNumber { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public DateTime Date { get; set; }
    }
}
