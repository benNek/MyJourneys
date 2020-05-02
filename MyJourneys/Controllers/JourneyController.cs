using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;
using MyJourneys.Services;
using static System.DateTime;
using static MyJourneys.Utils.AuthUtils;

namespace MyJourneys.Controllers
{
    [Route("api/[controller]")]
    public class JourneyController : Controller
    {
        private readonly IJourneyRepository _journeyRepository;
        private readonly IJourneyService _journeyService;

        public JourneyController(IJourneyRepository journeyRepository, IJourneyService journeyService)
        {
            _journeyRepository = journeyRepository;
            _journeyService = journeyService;
        }

        [HttpPost]
        [Authorize]
        public IActionResult CreateJourney([FromBody] JourneyFormViewModel model)
        {
            if (model.EndDate < Today)
            {
                return StatusCode(422, "End date must not be in the past");
            }

            if (model.StartDate.CompareTo(model.EndDate) > 0)
            {
                return StatusCode(422, "Start date is later than end date");
            }

            var userId = GetUserId(User);
            return Ok(_journeyRepository.AddJourney(userId, model));
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteJourney(int id)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, id))
            {
                return StatusCode(403, $"Journey {id} doesn't belong to user");
            }

            return Ok(_journeyRepository.DeleteJourney(userId, id));
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
        public IActionResult AddFlight([FromBody] FlightItemFormViewModel model)
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

        [HttpDelete("flight/{id}")]
        [Authorize]
        public IActionResult DeleteFlight(int id)
        {
            var userId = GetUserId(User);
            return Ok(_journeyRepository.DeleteFlightItem(userId, id));
        }
        
        [HttpPost("hotel")]
        [Authorize]
        public IActionResult AddHotel([FromBody] CommonItemFormViewModel model)
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
        
        [HttpDelete("hotel/{id}")]
        [Authorize]
        public IActionResult DeleteHotel(int id)
        {
            var userId = GetUserId(User);
            return Ok(_journeyRepository.DeleteHotelItem(userId, id));
        }

        [HttpPost("reservation")]
        [Authorize]
        public IActionResult AddReservation([FromBody] CommonItemFormViewModel model)
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
        
        [HttpDelete("reservation/{id}")]
        [Authorize]
        public IActionResult DeleteReservation(int id)
        {
            var userId = GetUserId(User);
            return Ok(_journeyRepository.DeleteReservationItem(userId, id));
        }

        [HttpPost("event")]
        [Authorize]
        public IActionResult AddEvent([FromBody] CommonItemFormViewModel model)
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
        
        [HttpDelete("event/{id}")]
        [Authorize]
        public IActionResult DeleteEvent(int id)
        {
            var userId = GetUserId(User);
            return Ok(_journeyRepository.DeleteEventItem(userId, id));
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

        [HttpDelete("place/{id}")]
        [Authorize]
        public IActionResult DeletePlace(int id)
        {
            var userId = GetUserId(User);
            return Ok(_journeyRepository.DeletePlaceItem(userId, id));
        }

        [HttpGet("{id}/places/{placeId}/start")]
        [Authorize]
        public IActionResult SetStartPlace(int id, int placeId)
        {
            var userId = GetUserId(User);
            _journeyRepository.SetStartPlace(userId, id, placeId);
            return Ok(_journeyRepository.GetPlaces(userId, id));
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
        
        [HttpPut("note/{id}")]
        [Authorize]
        public IActionResult AddNote(int id, [FromBody] NoteFormViewModel model)
        {
            var userId = GetUserId(User);
            return Ok(_journeyRepository.UpdateNoteItem(userId, id, model));
        }
        
        [HttpDelete("note/{id}")]
        [Authorize]
        public IActionResult DeleteNote(int id)
        {
            var userId = GetUserId(User);
            return Ok(_journeyRepository.DeleteNoteItem(userId, id));
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