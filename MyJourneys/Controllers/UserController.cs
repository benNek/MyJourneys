using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserAuthViewModel model)
        {
            return null;
//            return View();
        }
    }
}