using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MyJourneys.Data;
using MyJourneys.Models;
using MyJourneys.Models.Enums;
using MyJourneys.Models.ViewModels;
using Newtonsoft.Json.Bson;

namespace MyJourneys.Repositories
{
    public class JourneyRepository : IJourneyRepository
    {
        private readonly TravelContext _context;
        private readonly IPhotoRepository _photoRepository;
        private readonly IConfiguration _config;

        public JourneyRepository(IPhotoRepository photoRepository, IConfiguration configuration, TravelContext context = null)
        {
            _context = context ?? new TravelContext();
            _photoRepository = photoRepository;
            _config = configuration;
        }

        public Journey AddJourney(string userId, JourneyFormViewModel model)
        {
            var photoPath = GetPhotoPath(model.Location).Result;
            var journey = new Journey
            {
                UserId = userId,
                Location = model.Location,
                PhotoPath = photoPath,
                StartDate = model.StartDate,
                EndDate = model.EndDate
            };
            _context.Journeys.Add(journey);
            _context.SaveChanges();
            return journey;
        }

        public int DeleteJourney(string userId, int journeyId)
        {
            var journey = _context.Journeys.FirstOrDefault(j => j.UserId.Equals(userId) && j.Id == journeyId);
            if (journey == null)
            {
                return -1;
            }

            _context.Journeys.Remove(journey);
            _context.SaveChanges();
            return journey.Id;
        }

        public List<JourneyViewModel> GetJourneys(string userId)
        {
            return _context.Journeys
                .Where(journey => journey.UserId.Equals(userId))
                .Select(journey => new JourneyViewModel
                {
                    Id = journey.Id,
                    Location = journey.Location,
                    PhotoPath = journey.PhotoPath,
                    StartDate = journey.StartDate,
                    EndDate = journey.EndDate,
                    Expired = IsExpired(journey.EndDate)
                })
                .OrderBy(journey => journey.StartDate)
                .ToList();
        }

        public JourneyViewModel GetJourney(string userId, int journeyId)
        {
            return _context.Journeys
                .Where(journey => journey.UserId.Equals(userId) && journey.Id == journeyId)
                .Select(journey => new JourneyViewModel
                {
                    Id = journey.Id,
                    Location = journey.Location,
                    PhotoPath = journey.PhotoPath,
                    StartDate = journey.StartDate,
                    EndDate = journey.EndDate,
                    Expired = IsExpired(journey.EndDate)
                })
                .FirstOrDefault();
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
                    Longitude = place.Longitude,
                    Rank = place.Rank,
                    Start = place.Start,
                })
                .OrderByDescending(place => place.Start)
                .ThenByDescending(place => place.Rank)
                .ThenBy(place => place.Id)
                .ToList();
        }

        public List<Place> GetPlaceObjects(string userId, int journeyId)
        {
            return _context.Places
                .Where(place => place.UserId.Equals(userId) && place.JourneyId == journeyId)
                .OrderByDescending(place => place.Start)
                .ThenByDescending(place => place.Rank)
                .ThenBy(place => place.Id)
                .ToList();
        }

        public void UpdatePlaceRank(int placeId, int rank)
        {
            var place = _context.Places
                .FirstOrDefault(p => p.Id == placeId);
            if (place == null)
            {
                return;
            }

            place.Rank = rank;
            _context.SaveChanges();
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

        public JourneyItemViewModel AddFlightItem(string userId, FlightItemFormViewModel model)
        {
            var item = new FlightItem
            {
                UserId = userId,
                JourneyId = model.JourneyId,
                Date = model.Date,
                Airline = model.Airline,
                FlightNumber = model.FlightNumber,
                Origin = model.Origin,
                Destination = model.Destination
            };
            _context.FlightItems.Add(item);
            _context.SaveChanges();

            return new JourneyItemViewModel
            {
                Id = item.Id,
                Type = JourneyItemType.Flight.ToString(),
                Date = item.Date,
                Airline = item.Airline,
                FlightNumber = item.FlightNumber,
                Origin = item.Origin,
                Destination = item.Destination
            };
        }

        public int DeleteFlightItem(string userId, int itemId)
        {
            var item = _context.FlightItems.FirstOrDefault(i => i.UserId.Equals(userId) && i.Id == itemId);
            if (item == null)
            {
                return -1;
            }

            _context.FlightItems.Remove(item);
            _context.SaveChanges();
            return item.Id;
        }

        public JourneyItemViewModel AddHotelItem(string userId, CommonItemFormViewModel model)
        {
            var item = new HotelItem
            {
                UserId = userId,
                JourneyId = model.JourneyId,
                Date = model.Date,
                Name = model.Name,
                Address = model.Address
            };
            _context.HotelItems.Add(item);
            _context.SaveChanges();
            return new JourneyItemViewModel
            {
                Id = item.Id,
                Type = JourneyItemType.Hotel.ToString(),
                Date = item.Date,
                Name = item.Name,
                Address = item.Address
            };
        }

        public int DeleteHotelItem(string userId, int itemId)
        {
            var item = _context.HotelItems.FirstOrDefault(i => i.UserId.Equals(userId) && i.Id == itemId);
            if (item == null)
            {
                return -1;
            }

            _context.HotelItems.Remove(item);
            _context.SaveChanges();
            return item.Id;
        }

        public JourneyItemViewModel AddReservationItem(string userId, CommonItemFormViewModel model)
        {
            var item = new ReservationItem
            {
                UserId = userId,
                JourneyId = model.JourneyId,
                Date = model.Date,
                Name = model.Name,
                Address = model.Address
            };
            _context.ReservationItems.Add(item);
            _context.SaveChanges();
            return new JourneyItemViewModel
            {
                Id = item.Id,
                Type = JourneyItemType.Reservation.ToString(),
                Date = item.Date,
                Name = item.Name,
                Address = item.Address
            };
        }

        public int DeleteReservationItem(string userId, int itemId)
        {
            var item = _context.ReservationItems.FirstOrDefault(i => i.UserId.Equals(userId) && i.Id == itemId);
            if (item == null)
            {
                return -1;
            }

            _context.ReservationItems.Remove(item);
            _context.SaveChanges();
            return item.Id;
        }

        public JourneyItemViewModel AddEventItem(string userId, CommonItemFormViewModel model)
        {
            var item = new EventItem
            {
                UserId = userId,
                JourneyId = model.JourneyId,
                Date = model.Date,
                Name = model.Name,
                Address = model.Address
            };
            _context.EventItems.Add(item);
            _context.SaveChanges();
            return new JourneyItemViewModel
            {
                Id = item.Id,
                Type = JourneyItemType.Event.ToString(),
                Date = item.Date,
                Name = item.Name,
                Address = item.Address
            };
        }

        public int DeleteEventItem(string userId, int itemId)
        {
            var item = _context.EventItems.FirstOrDefault(i => i.UserId.Equals(userId) && i.Id == itemId);
            if (item == null)
            {
                return -1;
            }

            _context.EventItems.Remove(item);
            _context.SaveChanges();
            return item.Id;
        }

        public Place AddPlaceItem(string userId, PlaceFormViewModel model)
        {
            var hasStart = _context.Places
                .Any(p => p.UserId.Equals(userId) && p.JourneyId == model.JourneyId && p.Start);

            var place = new Place
            {
                UserId = userId,
                JourneyId = model.JourneyId,
                Location = model.Location,
                Address = model.Address,
                Latitude = model.Latitude,
                Longitude = model.Longitude,
                Start = !hasStart
            };
            _context.Places.Add(place);
            _context.SaveChanges();
            return place;
        }

        public int DeletePlaceItem(string userId, int placeId)
        {
            var place = _context.Places.FirstOrDefault(p => p.UserId.Equals(userId) && p.Id == placeId);
            if (place == null)
            {
                return -1;
            }

            _context.Places.Remove(place);
            _context.SaveChanges();
            return place.Id;
        }

        public void SetStartPlace(string userId, int journeyId, int placeId)
        {
            var places = GetPlaceObjects(userId, journeyId);
            var startPlace = places.FirstOrDefault(place => place.Id == placeId);
            if (startPlace == null)
            {
                return;
            }

            places.ForEach(place => place.Start = false);
            startPlace.Start = true;
            _context.SaveChanges();
        }

        public Note AddNoteItem(string userId, NoteFormViewModel model)
        {
            var note = new Note
            {
                UserId = userId,
                JourneyId = model.JourneyId,
                Title = model.Title,
                Text = model.Text
            };
            _context.Notes.Add(note);
            _context.SaveChanges();
            return note;
        }

        public Note UpdateNoteItem(string userId, int noteId, NoteFormViewModel model)
        {
            var note = _context.Notes.FirstOrDefault(n => n.UserId.Equals(userId) && n.Id == noteId);
            if (note == null)
            {
                return null;
            }

            note.Title = model.Title;
            note.Text = model.Text;
            _context.Entry(note).State = EntityState.Modified;
            _context.SaveChanges();
            return note;
        }

        public int DeleteNoteItem(string userId, int noteId)
        {
            var note = _context.Notes.FirstOrDefault(n => n.UserId.Equals(userId) && n.Id == noteId);
            if (note == null)
            {
                return -1;
            }

            _context.Notes.Remove(note);
            _context.SaveChanges();
            return note.Id;
        }

        private static bool IsExpired(DateTime date)
        {
            DateTime now = DateTime.Today;
            return date.CompareTo(now) < 0;
        }

        private async Task<string> GetPhotoPath(string location)
        {
            var path = Path.Combine(_config["FileStorage:LocationPath"], location.ToLower() + ".jpg");
            if (File.Exists(path))
            {
                return path;
            }

            bool success = await _photoRepository.SaveLocationPhoto(location.ToLower());
            return success ? path : null;
        }
    }
}