using System.Collections.Generic;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public interface IJourneyRepository
    {
        void AddJourney(User user, JourneyCreationViewModel model);
        List<JourneyViewModel> GetJourneys(string userId);
        List<JourneyItemViewModel> GetJourneyItems(string userId, int journeyId);
        void AddFlightItem(string userId, FlightItemCreationViewModel model);
        void AddHotelItem(string userId, HotelItemCreationViewModel model);
    }
}