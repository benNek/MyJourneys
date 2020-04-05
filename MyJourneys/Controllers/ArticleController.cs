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

        [HttpPost]
        [Authorize]
        public IActionResult Create([FromBody] ArticleFormViewModel model)
        {
            var userId = GetUserId(User);
            _articleRepository.AddArticle(userId, model);
            return Ok("Article has been created successfully");
        }

        [HttpGet]
        public IEnumerable<ArticleViewModel> Get([FromQuery] string tag, [FromQuery] int skip = 0, [FromQuery] int take = 6)
        {
            if (tag != null)
            {
                return _articleRepository.GetArticlesByTag(tag, skip, take);
            }
            return _articleRepository.GetArticles(skip, take);
        }

        [HttpGet("{id}")]
        public ArticleViewModel GetArticle(int id)
        {
            return _articleRepository.GetArticle(id);
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