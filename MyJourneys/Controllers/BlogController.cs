using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;
using static MyJourneys.Utils.AuthorizationUtils;

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
        public IActionResult Create([FromBody] BlogCreationViewModel model)
        {
            var userId = GetUserId(User);
            _blogRepository.AddBlog(userId, model);
            return Ok("Blog has been created successfully");
        }

        [HttpGet]
        public IEnumerable<BlogViewModel> Get()
        {
            return _blogRepository.GetBlogs();
        }

        [HttpGet("{id}")]
        public BlogViewModel GetBlog(int id)
        {
            return _blogRepository.GetBlog(id);
        }
        
    }
}