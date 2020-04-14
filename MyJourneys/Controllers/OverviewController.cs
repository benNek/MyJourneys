using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Controllers
{
    [Route("api/[controller]")]
    public class OverviewController : Controller
    {
        [HttpPost]
        public IActionResult UploadPhoto([FromForm] string title, [FromForm] IFormFile[] files,
            [FromForm] string[] dates, [FromForm] string[] latitudes, [FromForm] string[] longitudes)
        {
            int length = files.Length;
            length = Math.Min(length, dates.Length);
            length = Math.Min(length, longitudes.Length);
            length = Math.Min(length, latitudes.Length);
            List<JourneyOverviewUploadViewModel> models = new List<JourneyOverviewUploadViewModel>();
            for (int i = 0; i < length; i++)
            {
                try
                {
                    models.Add(new JourneyOverviewUploadViewModel(files[i], Convert.ToDateTime(dates[i]),
                        Double.Parse(latitudes[i]), Double.Parse(longitudes[i])));
                }
                catch (OverflowException)
                {
                    return StatusCode(422, "Failed to parse data");
                }
            }

            return Ok("not implemneted");
        }
    }
}