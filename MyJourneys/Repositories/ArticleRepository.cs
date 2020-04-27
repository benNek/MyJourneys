using System;
using System.Collections.Generic;
using System.Linq;
using MyJourneys.Data;
using MyJourneys.Enums;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public class ArticleRepository : IArticleRepository
    {
        private const int PopularLimit = 20;

        private readonly TravelContext _context;
        private readonly IUserRepository _userRepository;

        public ArticleRepository(IUserRepository userRepository)
        {
            _context = new TravelContext();
            _userRepository = userRepository;
        }

        public ArticleViewModel GetArticle(int id)
        {
            return _context.Articles
                .Where(article => article.Id == id)
                .Select(article => new ArticleViewModel
                {
                    Id = article.Id,
                    AuthorName = article.Author.UserName,
                    Title = article.Title,
                    Text = article.Text,
                    Tags = article.ArticleTags.Select(tag => tag.Tag.Name).ToList(),
                    LikesCount = article.ArticleLikes.Count,
                    CreateDate = article.CreateDate,
                    Confirmed = article.Confirmed
                }).FirstOrDefault();
        }

        public List<ArticleViewModel> GetArticles(string tagName, ArticleSortType sortType, string search,
            int skip, int take)
        {
            DateTime filterDate = GetMaxDate(sortType);
            var query = _context.Articles
                .Where(article => article.CreateDate >= filterDate && article.Confirmed);

            if (tagName != null)
            {
                query = query.Where(article =>
                    article.ArticleTags.Any(articleTag => articleTag.Tag.Name.Equals(tagName)));
            }

            if (search != null)
            {
                query = query.Where(article => article.Title.Contains(search));
            }

            var viewModelQuery = query.Select(article => new ArticleViewModel
            {
                Id = article.Id,
                AuthorName = article.Author.UserName,
                Title = article.Title,
                Text = article.Text,
                Tags = article.ArticleTags.Select(tag => tag.Tag.Name).ToList(),
                LikesCount = article.ArticleLikes.Count,
                CreateDate = article.CreateDate,
                Confirmed = article.Confirmed
            }).OrderByDescending(article => article.CreateDate);
            if (!sortType.Equals(ArticleSortType.Feed))
            {
                viewModelQuery = viewModelQuery.OrderByDescending(a => a.LikesCount)
                    .ThenByDescending(article => article.CreateDate);
            }

            return viewModelQuery.Skip(skip).Take(take).ToList();
        }

        private DateTime GetMaxDate(ArticleSortType sortType)
        {
            switch (sortType)
            {
                case ArticleSortType.Weekly:
                    return DateTime.Now.AddDays(-7);
                case ArticleSortType.Monthly:
                    return DateTime.Now.AddMonths(-1);
                default:
                    return DateTime.MinValue;
            }
        }

        public Article AddArticle(string userId, ArticleFormViewModel model)
        {
            var article = new Article
            {
                Title = model.Title,
                Text = model.Text,
                AuthorId = userId,
                CreateDate = DateTime.UtcNow,
                ModifyDate = DateTime.UtcNow,
                Confirmed = _userRepository.HasWriterRole(userId)
            };
            _context.Articles.Add(article);
            _context.SaveChanges();
            AddTagsToArticle(article.Id, model.Tags);
            return article;
        }

        public void AddTagsToArticle(int articleId, List<string> tags)
        {
            foreach (string tag in tags)
            {
                var tagId = GetTag(tag).Id;
                _context.ArticleTags.Add(new ArticleTags
                {
                    TagId = tagId,
                    ArticleId = articleId
                });
            }

            _context.SaveChanges();
        }

        public Tag GetTag(string tagName)
        {
            var articleTag = _context.Tags.FirstOrDefault(tag => tag.Name.ToLower().Equals(tagName.ToLower()));
            if (articleTag == null)
            {
                var newTag = new Tag
                {
                    Name = tagName
                };
                _context.Tags.Add(newTag);
                _context.SaveChanges();
                return newTag;
            }

            return articleTag;
        }

        public List<string> GetTags()
        {
            return _context.Tags.Select(tag => tag.Name).ToList();
        }

        public List<PopularTagViewModel> GetPopularTags()
        {
            return _context.Tags.Select(tag => new PopularTagViewModel
                {
                    Tag = tag.Name,
                    Count = tag.ArticleTags.Count
                })
                .OrderByDescending(tag => tag.Count)
                .Take(PopularLimit)
                .ToList();
        }

        public void LikeArticle(string userId, int articleId)
        {
            var entry = _context.ArticleLikes
                .FirstOrDefault(likes => likes.UserId.Equals(userId) && likes.ArticleId == articleId);

            if (entry == null)
            {
                _context.ArticleLikes.Add(new ArticleLikes
                {
                    UserId = userId,
                    ArticleId = articleId
                });
            }
            else
            {
                _context.ArticleLikes.Remove(entry);
            }

            _context.SaveChanges();
        }

        public bool HasLiked(string userId, int articleId)
        {
            return _context.ArticleLikes.Any(likes => likes.UserId.Equals(userId) && likes.ArticleId == articleId);
        }
    }
}