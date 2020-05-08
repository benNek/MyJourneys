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
        bool IsUsersItem(string userId, int itemId);
        bool IsUsersNote(string userId, int noteId);
        bool IsUsersPlace(string userId, int placeId);
        List<JourneyItemViewModel> GetJourneyItems(int journeyId);
        List<PlaceViewModel> GetPlaces(int journeyId);
        List<Place> GetPlaceObjects(int journeyId);
        void UpdatePlaceRank(int placeId, int rank);
        List<NoteViewModel> GetNotes(int journeyId);
        JourneyItemViewModel AddItem(JourneyItemFormViewModel model);
        int DeleteItem(int itemId);
        PlaceViewModel AddPlaceItem(PlaceFormViewModel model);
        int DeletePlaceItem(int placeId);
        void SetStartPlace(int journeyId, int placeId);
        NoteViewModel AddNoteItem(NoteFormViewModel model);
        NoteViewModel UpdateNoteItem(int noteId, NoteFormViewModel model);
        int DeleteNoteItem(int noteId);
    }
}