using System.Collections.Generic;
using MyJourneys.Models;
using MyJourneys.Repositories;

namespace MyJourneys.Services
{
    public class JourneyService : IJourneyService
    {

        private IJourneyRepository _journeyRepository;

        public JourneyService(IJourneyRepository journeyRepository)
        {
            _journeyRepository = journeyRepository;
        }

        public void ReorderPlaces(string userId, int journeyId)
        {
            List<Place> places = _journeyRepository.GetPlaceObjects(userId, journeyId);
        }
    }
}