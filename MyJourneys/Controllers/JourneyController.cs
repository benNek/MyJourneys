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
        public ActionResult<JourneyViewModel> CreateJourney([FromBody] JourneyFormViewModel model)
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
        public ActionResult<int> DeleteJourney(int id)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, id))
            {
                return StatusCode(403, "Journey doesn't belong to the user");
            }

            return Ok(_journeyRepository.DeleteJourney(id));
        }

        [HttpGet]
        [Authorize]
        public ActionResult<IEnumerable<JourneyViewModel>> GetJourneys()
        {
            var userId = GetUserId(User);
            return Ok(_journeyRepository.GetJourneys(userId));
        }

        [HttpGet("{id}")]
        [Authorize]
        public ActionResult<JourneyViewModel> GetJourney(int id)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, id))
            {
                return StatusCode(403, "Journey doesn't belong to the user");
            }

            return Ok(_journeyRepository.GetJourney(id));
        }

        [HttpGet("{id}/itinerary")]
        [Authorize]
        public ActionResult<IEnumerable<JourneyItemViewModel>> GetJourneyItems(int id)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, id))
            {
                return StatusCode(403, "Journey doesn't belong to the user");
            }

            return Ok(_journeyRepository.GetJourneyItems(id));
        }

        [HttpPost("item")]
        [Authorize]
        public ActionResult<JourneyItemViewModel> AddItem([FromBody] JourneyItemFormViewModel model)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, model.JourneyId))
            {
                return StatusCode(403, "Journey doesn't belong to the user");
            }

            if (model.Date < Now)
            {
                return StatusCode(422, "Date must not be in the past");
            }

            return _journeyRepository.AddItem(model);
        }

        [HttpDelete("item/{id}")]
        [Authorize]
        public ActionResult<int> DeleteItem(int id)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersItem(userId, id))
            {
                return StatusCode(403, "Item doesn't belong to the user");
            }
            
            return Ok(_journeyRepository.DeleteItem(id));
        }

        [HttpPost("place")]
        [Authorize]
        public ActionResult<PlaceViewModel> AddPlace([FromBody] PlaceFormViewModel model)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, model.JourneyId))
            {
                return StatusCode(403, "Journey doesn't belong to the user");
            }

            if (model.Latitude < -90 || model.Latitude > 90)
            {
                return StatusCode(422, "Latitude must be between -90 and 90");
            }

            if (model.Longitude < -180 || model.Longitude > 180)
            {
                return StatusCode(422, "Longitude must be between -180 and 180");
            }

            return Ok(_journeyRepository.AddPlaceItem(model));
        }

        [HttpDelete("place/{id}")]
        [Authorize]
        public ActionResult<int> DeletePlace(int id)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersPlace(userId, id))
            {
                return StatusCode(403, "Place doesn't belong to the user");
            }

            return Ok(_journeyRepository.DeletePlaceItem(id));
        }

        [HttpGet("{id}/places/{placeId}/start")]
        [Authorize]
        public ActionResult<IEnumerable<PlaceViewModel>> SetStartPlace(int id, int placeId)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, id))
            {
                return StatusCode(403, "Journey doesn't belong to the user");
            }

            _journeyRepository.SetStartPlace(id, placeId);
            return Ok(_journeyRepository.GetPlaces(id));
        }

        [HttpGet("{id}/places")]
        [Authorize]
        public ActionResult<IEnumerable<PlaceViewModel>> GetPlaces(int id)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, id))
            {
                return StatusCode(403, "Journey doesn't belong to the user");
            }

            return Ok(_journeyRepository.GetPlaces(id));
        }

        [HttpGet("{id}/places/reorder")]
        [Authorize]
        public ActionResult<IEnumerable<PlaceViewModel>> ReorderPlaces(int id)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, id))
            {
                return StatusCode(403, "Journey doesn't belong to the user");
            }

            return Ok(_journeyService.ReorderPlaces(id));
        }

        [HttpPost("note")]
        [Authorize]
        public ActionResult<NoteViewModel> AddNote([FromBody] NoteFormViewModel model)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, model.JourneyId))
            {
                return StatusCode(403, "Journey doesn't belong to the user");
            }

            return Ok(_journeyRepository.AddNoteItem(model));
        }

        [HttpPut("note/{id}")]
        [Authorize]
        public ActionResult<NoteViewModel> EditNote(int id, [FromBody] NoteFormViewModel model)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersNote(userId, id))
            {
                return StatusCode(403, "Note doesn't belong to the user");
            }

            return Ok(_journeyRepository.UpdateNoteItem(id, model));
        }

        [HttpDelete("note/{id}")]
        [Authorize]
        public ActionResult<int> DeleteNote(int id)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersNote(userId, id))
            {
                return StatusCode(403, "Note doesn't belong to the user");
            }

            return Ok(_journeyRepository.DeleteNoteItem(id));
        }

        [HttpGet("{id}/notes")]
        [Authorize]
        public ActionResult<IEnumerable<NoteViewModel>> GetNotes(int id)
        {
            var userId = GetUserId(User);
            if (!_journeyRepository.IsUsersJourney(userId, id))
            {
                return StatusCode(403, "Journey doesn't belong to the user");
            }

            return Ok(_journeyRepository.GetNotes(id));
        }
    }
}