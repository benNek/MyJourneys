using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyJourneys.Models
{
    public class OverviewJourney
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string UserId { get; set; }

        [ForeignKey("UserId")] public virtual User User { get; set; }
        public ICollection<LocationPhoto> LocationPhotos { get; set; }
        public virtual ICollection<OverviewJourneysCountries> OverviewJourneysCountries { get; set; }
    }
}