using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyJourneys.Models.Enums;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;
using static MyJourneys.Utils.AuthUtils;

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
            return Ok(_articleRepository.AddArticle(userId, model));
        }
        
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteArticle(int id)
        {
            var userId = GetUserId(User);
            if (!_articleRepository.IsUserAuthor(id, userId))
            {
                return StatusCode(403, $"User is not the author");
            }
            
            return Ok(_articleRepository.DeleteArticle(id));
        }

        [HttpGet]
        public IEnumerable<ArticleViewModel> Get([FromQuery] string tag, [FromQuery] string sortType,
            [FromQuery] string search, [FromQuery] int skip = 0, [FromQuery] int take = 6)
        {
            var sort = GetSortType(sortType);
            return _articleRepository.GetArticles(tag, sort, search, skip, take);
        }

        [HttpGet("author/{name}")]
        public IEnumerable<ArticleViewModel> GetAuthorArticles(string name)
        {
            return _articleRepository.GetAuthorArticles(name);
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

        [HttpPost("{id}/like")]
        public IActionResult Like(int id)
        {
            var userId = GetUserId(User);
            _articleRepository.LikeArticle(userId, id);
            return Ok();
        }

        [HttpGet("{id}/like")]
        public bool HasLiked(int id)
        {
            var userId = GetUserId(User);
            return _articleRepository.HasLiked(userId, id);
        }

        private ArticleSortType GetSortType(string sortType)
        {
            return sortType switch
            {
                "weekly" => ArticleSortType.Weekly,
                "monthly" => ArticleSortType.Monthly,
                "all_time" => ArticleSortType.AllTime,
                _ => ArticleSortType.Feed
            };
        }
    }
}