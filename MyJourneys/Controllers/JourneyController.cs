using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;
using MyJourneys.Services;
using static System.DateTime;
using static MyJourneys.Utils.AuthorizationUtils;

namespace MyJourneys.Controllers
{
    [Route("api/[controller]")]
    public class JourneyController : Controller
    {
        private readonly IJourneyRepository _journeyRepository;
        private readonly IUserRepository _userRepository;
        private readonly IJourneyService _journeyService;

        public JourneyController(IJourneyRepository journeyRepository, IUserRepository userRepository,
            IJourneyService journeyService)
        {
            _journeyRepository = journeyRepository;
            _userRepository = userRepository;
            _journeyService = journeyService;
        }

        [HttpPost]
        [Authorize]
        public IActionResult Create([FromBody] JourneyCreationViewModel model)
        {
            if (model.StartDate.Year < Now.Year ||
                (model.StartDate.Year >= Now.Year && model.StartDate.DayOfYear < Now.DayOfYear))
            {
                return StatusCode(422, "Start date must not be in the past");
            }

            if (model.StartDate.CompareTo(model.EndDate) > 0)
            {
                return StatusCode(422, "Start date is later than end date");
            }

            var userId = GetUserId(User);
            return Ok(_journeyRepository.AddJourney(userId, model));
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
        public JourneyViewModel GetJourney(int id)
        {
            var userId = GetUserId(User);
            return _journeyRepository.GetJourney(userId, id);
        }
        
        [HttpGet("{id}/itinerary")]
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

            return Ok(_journeyRepository.AddFlightItem(userId, model));
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

            return Ok(_journeyRepository.AddHotelItem(userId, model));
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

            return Ok(_journeyRepository.AddReservationItem(userId, model));
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

            return Ok(_journeyRepository.AddEventItem(userId, model));
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

            return Ok(_journeyRepository.AddPlaceItem(userId, model));
        }

        [HttpGet("{id}/places")]
        [Authorize]
        public IEnumerable<PlaceViewModel> GetPlaces(int id)
        {
            var userId = GetUserId(User);
            return _journeyRepository.GetPlaces(userId, id);
        }

        [HttpGet("{id}/places/reorder")]
        [Authorize]
        public IActionResult ReorderPlaces(int id)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, id))
            {
                return StatusCode(403, $"Journey {id} doesn't belong to user");
            }

            return Ok(_journeyService.ReorderPlaces(userId, id));
        }

        [HttpPost("note")]
        [Authorize]
        public IActionResult AddNote([FromBody] NoteFormViewModel model)
        {
            var userId = GetUserId(User);
            return Ok(_journeyRepository.AddNoteItem(userId, model));
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