using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;

namespace MyJourneys.Controllers
{
    [Route("api/[controller]")]
    public class BlogController : Controller
    {
        private readonly IBlogRepository _blogRepository;

        public BlogController(IBlogRepository blogRepository)
        {
            _blogRepository = blogRepository;
        }

        [HttpPost]
        [Authorize]
        public IActionResult Create([FromBody] BlogViewModel model)
        {
            _blogRepository.AddBlog(model);
            return Ok("Blog has been created successfully");
        }
    }
}