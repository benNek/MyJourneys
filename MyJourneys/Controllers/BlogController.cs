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
        private readonly IArticleRepository _articleRepository;

        public BlogController(IArticleRepository articleRepository)
        {
            _articleRepository = articleRepository;
        }

        [HttpPost]
        [Authorize]
        public IActionResult Create([FromBody] BlogCreationViewModel model)
        {
            var userId = GetUserId(User);
            _articleRepository.AddBlog(userId, model);
            return Ok("Blog has been created successfully");
        }

        [HttpGet]
        public IEnumerable<BlogViewModel> Get()
        {
            return _articleRepository.GetBlogs();
        }

        [HttpGet("{id}")]
        public BlogViewModel GetBlog(int id)
        {
            return _articleRepository.GetBlog(id);
        }
        
    }
}