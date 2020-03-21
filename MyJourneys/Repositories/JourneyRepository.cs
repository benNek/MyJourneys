using MyJourneys.Data;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public class JourneyRepository : IJourneyRepository
    {
        private readonly TravelContext _context;

        public JourneyRepository()
        {
            _context = new TravelContext();
        }

        public void AddJourney(User user, JourneyCreationViewModel model)
        {
            _context.Journeys.Add(new Journey
            {
                UserId = user.Id,
                Location = model.Location,
                StartDate = model.StartDate,
                EndDate = model.EndDate
            });
            _context.SaveChanges();
        }
    }
}