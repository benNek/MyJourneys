using System.ComponentModel.DataAnnotations.Schema;

namespace MyJourneys.Models
{
    public class OverviewJourneysCountries
    {
        public int Id { get; set; }
        public int OverviewJourneyId { get; set; }
        public int CountryId { get; set; }
        
        [ForeignKey("OverviewJourneyId")] public virtual OverviewJourney OverviewJourney { get; set; }
        [ForeignKey("CountryId")] public virtual Country Country { get; set; }
    }
}