using System.Collections.Generic;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public interface IOverviewRepository
    {
        List<OverviewJourneyPreviewViewModel> GetJourneyOverviews(string userId, int year);
        OverviewJourneyViewModel GetJourneyOverview(string userId, int journeyId);
        void AddJourneyOverview(string userId, string title, List<Country> countries,
            List<JourneyOverviewUploadViewModel> models);
        Country GetCountry(string alpha2);
        List<string> GetVisitedCountries(string userId, int year);
        List<int> GetTravelingYears(string userId);
    }
}