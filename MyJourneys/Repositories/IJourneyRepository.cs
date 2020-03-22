using System.Collections.Generic;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public interface IJourneyRepository
    {
        void AddJourney(User user, JourneyCreationViewModel model);
        List<JourneyViewModel> GetJourneys(string userId);
        void AddFlightItem(string userId, FlightItemCreationViewModel model);
    }
}