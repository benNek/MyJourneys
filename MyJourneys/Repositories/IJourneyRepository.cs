using System.Collections.Generic;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public interface IJourneyRepository
    {
        JourneyViewModel AddJourney(string userId, JourneyFormViewModel model);
        int DeleteJourney(int journeyId);
        List<JourneyViewModel> GetJourneys(string userId);
        JourneyViewModel GetJourney(int journeyId);
        bool IsUsersJourney(string userId, int journeyId);
        bool IsUsersFlight(string userId, int flightId);
        bool IsUsersHotel(string userId, int hotelId);
        bool IsUsersEvent(string userId, int eventId);
        bool IsUsersReservation(string userId, int reservationId);
        bool IsUsersNote(string userId, int noteId);
        bool IsUsersPlace(string userId, int placeId);
        List<JourneyItemViewModel> GetJourneyItems(int journeyId);
        List<PlaceViewModel> GetPlaces(int journeyId);
        List<Place> GetPlaceObjects(int journeyId);
        void UpdatePlaceRank(int placeId, int rank);
        List<NoteViewModel> GetNotes(int journeyId);
        JourneyItemViewModel AddFlightItem(FlightItemFormViewModel model);
        int DeleteFlightItem(int itemId);
        JourneyItemViewModel AddHotelItem(CommonItemFormViewModel model);
        int DeleteHotelItem(int itemId);
        JourneyItemViewModel AddReservationItem(CommonItemFormViewModel model);
        int DeleteReservationItem(int itemId);
        JourneyItemViewModel AddEventItem(CommonItemFormViewModel model);
        int DeleteEventItem(int itemId);
        PlaceViewModel AddPlaceItem(PlaceFormViewModel model);
        int DeletePlaceItem(int placeId);
        void SetStartPlace(int journeyId, int placeId);
        NoteViewModel AddNoteItem(NoteFormViewModel model);
        NoteViewModel UpdateNoteItem(int noteId, NoteFormViewModel model);
        int DeleteNoteItem(int noteId);
    }
}