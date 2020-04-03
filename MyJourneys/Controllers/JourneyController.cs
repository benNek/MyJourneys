using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;
using static System.DateTime;
using static MyJourneys.Utils.AuthorizationUtils;

namespace MyJourneys.Controllers
{
    [Route("api/[controller]")]
    public class JourneyController : Controller
    {
        private readonly IJourneyRepository _journeyRepository;
        private readonly IUserRepository _userRepository;

        public JourneyController(IJourneyRepository journeyRepository, IUserRepository userRepository)
        {
            _journeyRepository = journeyRepository;
            _userRepository = userRepository;
        }

        [HttpPost]
        [Authorize]
        public IActionResult Create([FromBody] JourneyCreationViewModel model)
        {
            if (model.StartDate < Now)
            {
                return StatusCode(422, "Start date must not be in the past");
            }

            if (model.StartDate.CompareTo(model.EndDate) > 0)
            {
                return StatusCode(422, "Start date is later than end date");
            }

            var user = _userRepository.GetUserById(model.UserId);
            if (user == null)
            {
                return StatusCode(422, "Failed to fetch user");
            }

            _journeyRepository.AddJourney(user, model);
            return Ok("Journey has been created successfully");
        }

        [HttpGet]
        [Authorize]
        public IEnumerable<JourneyViewModel> GetJourneys()
        {
            var userId = GetUserId(User);
            return _journeyRepository.GetJourneys(userId);
        }

        [HttpGet("{id}")]
        [Authorize]
        public IEnumerable<JourneyItemViewModel> GetJourneyItems(int id)
        {
            var userId = GetUserId(User);
            return _journeyRepository.GetJourneyItems(userId, id);
        }

        [HttpPost("flight")]
        [Authorize]
        public IActionResult AddFlight([FromBody] FlightItemCreationViewModel model)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, model.JourneyId))
            {
                return StatusCode(403, $"Journey {model.JourneyId} doesn't belong to user");
            }
            if (model.Date < Now)
            {
                return StatusCode(422, "Date must not be in the past");
            }

            _journeyRepository.AddFlightItem(userId, model);
            return Ok("Flight has been successfully added to the journey");
        }

        [HttpPost("hotel")]
        [Authorize]
        public IActionResult AddHotel([FromBody] CommonItemCreationViewModel model)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, model.JourneyId))
            {
                return StatusCode(403, $"Journey {model.JourneyId} doesn't belong to user");
            }
            if (model.Date < Now)
            {
                return StatusCode(422, "Date must not be in the past");
            }

            _journeyRepository.AddHotelItem(userId, model);
            return Ok("Hotel has been successfully added to the journey");
        }

        [HttpPost("reservation")]
        [Authorize]
        public IActionResult AddReservation([FromBody] CommonItemCreationViewModel model)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, model.JourneyId))
            {
                return StatusCode(403, $"Journey {model.JourneyId} doesn't belong to user");
            }
            if (model.Date < Now)
            {
                return StatusCode(422, "Date must not be in the past");
            }

            _journeyRepository.AddReservationItem(userId, model);
            return Ok("Reservation has been successfully added to the journey");
        }

        [HttpPost("event")]
        [Authorize]
        public IActionResult AddEvent([FromBody] CommonItemCreationViewModel model)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, model.JourneyId))
            {
                return StatusCode(403, $"Journey {model.JourneyId} doesn't belong to user");
            }
            if (model.Date < Now)
            {
                return StatusCode(422, "Date must not be in the past");
            }

            _journeyRepository.AddEventItem(userId, model);
            return Ok("Event has been successfully added to the journey");
        }
        
        [HttpPost("place")]
        [Authorize]
        public IActionResult AddPlace([FromBody] PlaceFormViewModel model)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, model.JourneyId))
            {
                return StatusCode(403, $"Journey {model.JourneyId} doesn't belong to user");
            }
            if (model.Latitude < -90 || model.Latitude > 90)
            {
                return StatusCode(422, "Latitude must be between -90 and 90");
            }
            if (model.Longitude < -180 || model.Longitude > 180)
            {
                return StatusCode(422, "Longitude must be between -180 and 180");
            }

            _journeyRepository.AddPlaceItem(userId, model);
            return Ok("Place has been successfully added to the journey");
        }

        [HttpPost("note")]
        [Authorize]
        public IActionResult AddNote([FromBody] NoteFormViewModel model)
        {
            var userId = GetUserId(User);
            _journeyRepository.AddNoteItem(userId, model);
            return Ok("Note has been successfully added");
        }
        
        [HttpGet("{id}/notes")]
        [Authorize]
        public IEnumerable<NoteViewModel> GetNotes(int id)
        {
            var userId = GetUserId(User);
            return _journeyRepository.GetNotes(userId, id);
        }

    }
}