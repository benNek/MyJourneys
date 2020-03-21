using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public interface IJourneyRepository
    {
        void AddJourney(User user, JourneyCreationViewModel model);
    }
}