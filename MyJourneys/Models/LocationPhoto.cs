using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyJourneys.Models
{
    public class LocationPhoto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int OverviewJourneyId { get; set; }

        [ForeignKey("OverviewJourneyId")] public virtual OverviewJourney OverviewJourney { get; set; }
    }
}