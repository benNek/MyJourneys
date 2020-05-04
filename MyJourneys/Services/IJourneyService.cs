using System.Collections.Generic;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Services
{
    public interface IJourneyService
    {
        public List<PlaceViewModel> ReorderPlaces(int journeyId);
    }
}