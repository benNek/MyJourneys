using System;
using System.ComponentModel.DataAnnotations.Schema;
using MyJourneys.Models.Enums;

namespace MyJourneys.Models
{
    public class JourneyItem
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int JourneyId { get; set; }
        public JourneyItemType Type { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Airline { get; set; }
        public string FlightNumber { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }

        [ForeignKey("JourneyId")] public virtual Journey Journey { get; set; }
    }
}