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

        public bool IsUsersJourney(string userId, int journeyId)
        {
            return _context.Journeys.Any(journey => journey.Id == journeyId && journey.UserId.Equals(userId));
        }

        public List<JourneyItemViewModel> GetJourneyItems(string userId, int journeyId)
        {
            var items = _context.FlightItems
                .OfType<FlightItem>()
                .Where(item => item.UserId.Equals(userId) && item.JourneyId == journeyId)
                .Select(item => new JourneyItemViewModel
                {
                    Id = item.Id,
                    Type = JourneyItemType.Flight.ToString(),
                    Date = item.Date,
                    Airline = item.Airline,
                    FlightNumber = item.FlightNumber,
                    Origin = item.Origin,
                    Destination = item.Destination
                })
                .AsEnumerable()
                .Union(_context.HotelItems
                    .OfType<HotelItem>()
                    .Where(item => item.UserId.Equals(userId) && item.JourneyId == journeyId)
                    .Select(item => new JourneyItemViewModel
                    {
                        Id = item.Id,
                        Type = JourneyItemType.Hotel.ToString(),
                        Date = item.Date,
                        Name = item.Name,
                        Address = item.Address
                    }))
                .AsEnumerable()
                .Union(_context.ReservationItems
                    .OfType<ReservationItem>()
                    .Where(item => item.UserId.Equals(userId) && item.JourneyId == journeyId)
                    .Select(item => new JourneyItemViewModel
                    {
                        Id = item.Id,
                        Type = JourneyItemType.Reservation.ToString(),
                        Date = item.Date,
                        Name = item.Name,
                        Address = item.Address
                    }))
                .AsEnumerable()
                .Union(_context.EventItems
                    .OfType<EventItem>()
                    .Where(item => item.UserId.Equals(userId) && item.JourneyId == journeyId)
                    .Select(item => new JourneyItemViewModel
                    {
                        Id = item.Id,
                        Type = JourneyItemType.Event.ToString(),
                        Date = item.Date,
                        Name = item.Name,
                        Address = item.Address
                    }))
                .ToList();
            items.Sort((it1, it2) => it1.Date.CompareTo(it2.Date));
            return items;
        }

        public List<PlaceViewModel> GetPlaces(string userId, int journeyId)
        {
            return _context.Places
                .Where(item => item.UserId.Equals(userId) && item.JourneyId == journeyId)
                .Select(place => new PlaceViewModel
                {
                    Id = place.Id,
                    Location = place.Location,
                    Address = place.Address,
                    Latitude = place.Latitude,
                    Longitude = place.Longitude
                })
                .ToList();
        }

        public List<NoteViewModel> GetNotes(string userId, int journeyId)
        {
            return _context.Notes
                .Where(item => item.UserId.Equals(userId) && item.JourneyId == journeyId)
                .Select(note => new NoteViewModel
                {
                    Id = note.Id,
                    Title = note.Title,
                    Text = note.Text
                })
                .ToList();
        }

        public void AddFlightItem(string userId, FlightItemCreationViewModel model)
        {
            _context.FlightItems.Add(new FlightItem
            {
                UserId = userId,
                JourneyId = model.JourneyId,
                Date = model.Date,
                Airline = model.Airline,
                FlightNumber = model.FlightNumber,
                Origin = model.Origin,
                Destination = model.Destination
            });
            _context.SaveChanges();
        }

        public void AddHotelItem(string userId, CommonItemCreationViewModel model)
        {
            _context.HotelItems.Add(new HotelItem
            {
                UserId = userId,
                JourneyId = model.JourneyId,
                Date = model.Date,
                Name = model.Name,
                Address = model.Address
            });
            _context.SaveChanges();
        }

        public void AddReservationItem(string userId, CommonItemCreationViewModel model)
        {
            _context.ReservationItems.Add(new ReservationItem
            {
                UserId = userId,
                JourneyId = model.JourneyId,
                Date = model.Date,
                Name = model.Name,
                Address = model.Address
            });
            _context.SaveChanges();
        }

        public void AddEventItem(string userId, CommonItemCreationViewModel model)
        {
            _context.EventItems.Add(new EventItem
            {
                UserId = userId,
                JourneyId = model.JourneyId,
                Date = model.Date,
                Name = model.Name,
                Address = model.Address
            });
            _context.SaveChanges();
        }

        public void AddPlaceItem(string userId, PlaceFormViewModel model)
        {
            _context.Places.Add(new Place
            {
                UserId = userId,
                JourneyId = model.JourneyId,
                Location = model.Location,
                Address = model.Address,
                Latitude = model.Latitude,
                Longitude = model.Longitude
            });
            _context.SaveChanges();
        }

        public void AddNoteItem(string userId, NoteFormViewModel model)
        {
            _context.Notes.Add(new Note
            {
                UserId = userId,
                JourneyId = model.JourneyId,
                Title = model.Title,
                Text = model.Text
            });
            _context.SaveChanges();
        }
    }
}