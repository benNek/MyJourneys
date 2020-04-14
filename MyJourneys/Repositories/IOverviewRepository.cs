using System.Collections.Generic;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public interface IOverviewRepository
    {
        void AddJourneyOverview(string title, List<JourneyOverviewUploadViewModel> models);
    }
}