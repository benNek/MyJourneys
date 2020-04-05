using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;
using static MyJourneys.Utils.AuthorizationUtils;

namespace MyJourneys.Controllers
{
    [Route("api/[controller]")]
    public class ArticleController : Controller
    {
        private readonly IArticleRepository _articleRepository;

        public ArticleController(IArticleRepository articleRepository)
        {
            _articleRepository = articleRepository;
        }

        [HttpPost("blog")]
        [Authorize]
        public IActionResult Create([FromBody] BlogCreationViewModel model)
        {
            var userId = GetUserId(User);
            _articleRepository.AddBlog(userId, model);
            return Ok("Blog has been created successfully");
        }

        [HttpGet("blog")]
        public IEnumerable<BlogViewModel> Get([FromQuery] string tag, [FromQuery] int skip = 0, [FromQuery] int take = 6)
        {
            if (tag != null)
            {
                return _articleRepository.GetBlogsByTag(tag, skip, take);
            }
            return _articleRepository.GetBlogs(skip, take);
        }

        [HttpGet("blog/{id}")]
        public BlogViewModel GetBlog(int id)
        {
            return _articleRepository.GetBlog(id);
        }
        
        [HttpGet("tags")]
        public IEnumerable<string> GetTags()
        {
            return _articleRepository.GetTags();
        }

        [HttpGet("tags/popular")]
        public IEnumerable<PopularTagViewModel> GetPopularTags()
        {
            return _articleRepository.GetPopularTags();
        }
    }
}