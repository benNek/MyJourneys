using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;

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
            var userId = User.Claims.ToList()[0].Value;
            return _journeyRepository.GetJourneys(userId);
        }
    }
}