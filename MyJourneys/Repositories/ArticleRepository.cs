using System;
using System.Collections.Generic;
using System.Linq;
using MyJourneys.Data;
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
                    CreateDate = article.CreateDate
                }).FirstOrDefault();
        }

        public List<ArticleViewModel> GetArticles(int skip, int take)
        {
            return _context.Articles
                .Select(article => new ArticleViewModel
                {
                    Id = article.Id,
                    AuthorName = article.Author.UserName,
                    Title = article.Title,
                    Text = article.Text,
                    Tags = article.ArticleTags.Select(tag => tag.Tag.Name).ToList(),
                    CreateDate = article.CreateDate
                }).Skip(skip).Take(take).ToList();
        }

        public List<ArticleViewModel> GetArticlesByTag(string tagName, int skip, int take)
        {
            return _context.Articles
                .Where(article => article.ArticleTags.Any(articleTag => articleTag.Tag.Name.Equals(tagName)))
                .Select(article => new ArticleViewModel
                {
                    Id = article.Id,
                    AuthorName = _userRepository.GetUserById(article.AuthorId).UserName,
                    Title = article.Title,
                    Text = article.Text,
                    Tags = article.ArticleTags.Select(tag => tag.Tag.Name).ToList(),
                    CreateDate = article.CreateDate
                }).Skip(skip).Take(take).ToList();
        }

        public void AddArticle(string userId, ArticleFormViewModel model)
        {
            var article = new Article
            {
                Title = model.Title,
                Text = model.Text,
                AuthorId = userId,
                CreateDate = DateTime.UtcNow,
                ModifyDate = DateTime.UtcNow
            };
            _context.Articles.Add(article);
            _context.SaveChanges();
            AddTagsToArticle(article.Id, model.Tags);
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
    }
}