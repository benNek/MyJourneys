using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MyJourneys.Controllers
{
    [Route("api/[controller]")]
    public class OverviewController : Controller
    {
        [HttpPost]
        public IActionResult UploadImage([FromForm] IFormFile file)
        {
            return Ok("not implemneted");
        }
    }
}