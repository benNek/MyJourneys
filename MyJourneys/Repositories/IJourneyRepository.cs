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
        List<NoteViewModel> GetNotes(string userId, int journeyId);
        void AddFlightItem(string userId, FlightItemCreationViewModel model);
        void AddHotelItem(string userId, CommonItemCreationViewModel model);
        void AddReservationItem(string userId, CommonItemCreationViewModel model);
        void AddEventItem(string userId, CommonItemCreationViewModel model);
        void AddNoteItem(string userId, NoteFormViewModel model);
    }
}