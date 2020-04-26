using System.Collections.Generic;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public interface IJourneyRepository
    {
        Journey AddJourney(string userId, JourneyCreationViewModel model);
        List<JourneyViewModel> GetJourneys(string userId);
        JourneyViewModel GetJourney(string userId, int journeyId);
        bool IsUsersJourney(string userId, int journeyId);
        List<JourneyItemViewModel> GetJourneyItems(string userId, int journeyId);
        List<PlaceViewModel> GetPlaces(string userId, int journeyId);
        List<Place> GetPlaceObjects(string userId, int journeyId);
        void UpdatePlaceRank(int placeId, int rank);
        List<NoteViewModel> GetNotes(string userId, int journeyId);
        JourneyItemViewModel AddFlightItem(string userId, FlightItemCreationViewModel model);
        JourneyItemViewModel AddHotelItem(string userId, CommonItemCreationViewModel model);
        JourneyItemViewModel AddReservationItem(string userId, CommonItemCreationViewModel model);
        JourneyItemViewModel AddEventItem(string userId, CommonItemCreationViewModel model);
        Place AddPlaceItem(string userId, PlaceFormViewModel model);
        void SetStartPlace(string userId, int journeyId, int placeId);
        void SetFinishPlace(string userId, int journeyId, int placeId);
        Note AddNoteItem(string userId, NoteFormViewModel model);
        Note UpdateNoteItem(string userId, int noteId, NoteFormViewModel model);
        int DeleteNoteItem(string userId, int noteId);
    }
}