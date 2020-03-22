using System;
using System.Collections.Generic;
using System.Linq;
using MyJourneys.Data;
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
                DepartureDate = model.DepartureDate
            });
            _context.SaveChanges();
        }
    }
}