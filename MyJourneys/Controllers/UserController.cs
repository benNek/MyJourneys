using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;
using MyJourneys.Services;

namespace MyJourneys.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;

        public UserController(IUserRepository userRepository, IUserService userService)
        {
            _userRepository = userRepository;
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserAuthViewModel model)
        {
            if (_userRepository.UserWithNameExists(model.Username))
            {
                return StatusCode(422, $"User with name {model.Username} already exists");
            }

            if (_userRepository.UserWithEmailExists(model.Email))
            {
                return StatusCode(422, $"User with email {model.Email} already exists");
            }

            if (await _userService.Register(model))
            {
                return Ok("Registration was successful");
            }
            
            return StatusCode(500, "Registration has failed. Please try again later");
        }
    }
}