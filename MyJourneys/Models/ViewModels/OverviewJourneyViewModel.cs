using System.Collections.Generic;

namespace MyJourneys.Models.ViewModels
{
    public class OverviewJourneyViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public IEnumerable<LocationPhoto> Photos { get; set; }
    }
}