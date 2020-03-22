using System;
using System.Collections.Generic;
using System.Linq;
using MyJourneys.Data;
using MyJourneys.Enums;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public class JourneyRepository : IJourneyRepository
    {
        private readonly TravelContext _context;

        public JourneyRepository()
        {
            _context = new TravelContext();
        }

        public void AddJourney(User user, JourneyCreationViewModel model)
        {
            _context.Journeys.Add(new Journey
            {
                UserId = user.Id,
                Location = model.Location,
                StartDate = model.StartDate,
                EndDate = model.EndDate
            });
            _context.SaveChanges();
        }

        public List<JourneyViewModel> GetJourneys(string userId)
        {
            return _context.Journeys
                .Where(journey => journey.UserId.Equals(userId))
                .Select(journey => new JourneyViewModel
                {
                    Id = journey.Id,
                    Location = journey.Location,
                    StartDate = journey.StartDate,
                    EndDate = journey.EndDate
                })
                .ToList();
        }

        public List<JourneyItemViewModel> GetJourneyItems(string userId, int journeyId)
        {
            var items = _context.FlightItems
                .Where(item => item.UserId.Equals(userId) && item.JourneyId == journeyId)
                .Select(item => new JourneyItemViewModel
                {
                    Id = item.Id,
                    Type = JourneyItemType.Flight.ToString(),
                    Airline = item.Airline,
                    FlightNumber = item.FlightNumber,
                    Origin = item.Origin,
                    Destination = item.Destination,
                    Date = item.Date
                })
                .ToList();
            items.Sort((it1, it2) => it1.Date.CompareTo(it2.Date));
            return items;
        }

        public void AddFlightItem(string userId, FlightItemCreationViewModel model)
        {
            _context.FlightItems.Add(new FlightItem
            {
                UserId = userId,
                JourneyId = model.JourneyId,
                Airline = model.Airline,
                FlightNumber = model.FlightNumber,
                Origin = model.Origin,
                Destination = model.Destination,
                Date = model.Date
            });
            _context.SaveChanges();
        }
    }
}