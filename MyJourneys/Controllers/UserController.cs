using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;
using MyJourneys.Services;
using static MyJourneys.Utils.AuthorizationUtils;

namespace MyJourneys.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly IArticleRepository _articleRepository;
        private readonly IOverviewRepository _overviewRepository;
        private readonly IUserService _userService;

        public UserController(IUserRepository userRepository, IArticleRepository articleRepository,
            IOverviewRepository overviewRepository, IUserService userService)
        {
            _userRepository = userRepository;
            _articleRepository = articleRepository;
            _overviewRepository = overviewRepository;
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterViewModel model)
        {
            if (_userRepository.UserWithNameExists(model.Username))
            {
                return StatusCode(422, $"User with name {model.Username} already exists");
            }

            if (_userRepository.UserWithEmailExists(model.Email))
            {
                return StatusCode(422, $"User with email {model.Email} already exists");
            }

            if (model.Password.Length < 8)
            {
                return StatusCode(422, "Password is too short");
            }

            if (await _userService.Register(model))
            {
                return Ok("Registration was successful");
            }

            return StatusCode(500, "Registration has failed. Please try again later");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginViewModel model)
        {
            if (await _userService.Login(model))
            {
                return Ok(await _userService.RequestToken(model.Username));
            }

            return StatusCode(401, "Invalid username or password");
        }

        [Authorize]
        [HttpGet("logout")]
        public IActionResult Logout()
        {
            _userService.Logout();
            return Ok("You have signed out successfully!");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("unapproved")]
        public IActionResult GetUnapprovedWriters()
        {
            return Ok(_userRepository.GetUnapprovedAuthors());
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("approve/{name}")]
        public async Task<IActionResult> ApproveAuthor(string name)
        {
            var approvedUser = await _userRepository.ApproveAuthor(name);
            if (approvedUser == null)
            {
                return StatusCode(500, "System failed to approved author, try again later.");
            }

            var authorId = _userRepository.GetUser(approvedUser).Id;
            _articleRepository.ApproveArticles(authorId);
            return Ok(approvedUser);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("block/{name}")]
        public async Task<IActionResult> BlockAuthor(string name)
        {
            return Ok(await _userRepository.BlockAuthor(name));
        }

        [HttpDelete("delete-photos")]
        [Authorize]
        public IActionResult DeletePhotos()
        {
            var userId = GetUserId(User);
            _overviewRepository.DeletePhotos(userId);
            return Ok("Photos have been deleted successfully");
        }
    }
}