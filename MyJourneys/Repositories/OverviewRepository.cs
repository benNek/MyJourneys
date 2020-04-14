using System.Collections.Generic;
using MyJourneys.Data;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public class OverviewRepository : IOverviewRepository
    {
        private readonly TravelContext _context;

        public OverviewRepository()
        {
            _context = new TravelContext();
        }

        public void AddJourneyOverview(string title, List<JourneyOverviewUploadViewModel> models)
        {
            var journey = FindJourney(title);
            
            throw new System.NotImplementedException();
        }

        private OverviewJourney FindJourney(string title)
        {
            
            return null;
        }
    }
}