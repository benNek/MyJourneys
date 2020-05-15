using System.Collections.Generic;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public interface IOverviewRepository
    {
        List<OverviewJourneyPreviewViewModel> GetJourneyOverviews(string userId, int year);
        bool IsUsersJourney(string userId, int journeyId);
        bool JourneyHasPhotos(int journeyId);
        OverviewJourneyViewModel GetJourneyOverview(int journeyId);
        void AddJourneyOverview(string userId, string title, IEnumerable<Country> countries,
            List<JourneyOverviewUploadViewModel> models);
        Country GetCountry(string alpha2);
        List<string> GetVisitedCountries(string userId, int year);
        List<int> GetTravelingYears(string userId);
        void DeleteJourneys(string userId);
        int DeleteJourney(int journeyId);
        int DeletePhoto(int photoId);
    }
}