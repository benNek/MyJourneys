using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MyJourneys.Data;
using MyJourneys.Models;
using MyJourneys.Models.Enums;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public class ArticleRepository : IArticleRepository
    {
        private const int PopularLimit = 20;
        private const int AuthorArticlesLimit = 3;

        private readonly TravelContext _context;
        private readonly IUserRepository _userRepository;

        public ArticleRepository(IUserRepository userRepository, TravelContext context = null)
        {
            _context = context ?? new TravelContext();
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

        public List<ArticleViewModel> GetAuthorArticles(string name)
        {
            var user = _userRepository.GetUser(name);
            if (user == null)
            {
                return new List<ArticleViewModel>();
            }

            return _context.Articles.Where(article => article.AuthorId.Equals(user.Id))
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
                }).Take(AuthorArticlesLimit).ToList();
        }

        private static DateTime GetMaxDate(ArticleSortType sortType)
        {
            return sortType switch
            {
                ArticleSortType.Weekly => DateTime.Now.AddDays(-7),
                ArticleSortType.Monthly => DateTime.Now.AddMonths(-1),
                _ => DateTime.MinValue
            };
        }

        public ArticleViewModel AddArticle(string userId, ArticleFormViewModel model)
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
            return GetArticleViewModel(article);
        }

        public ArticleViewModel UpdateArticle(int id, ArticleFormViewModel model)
        {
            var article = _context.Articles.FirstOrDefault(a => a.Id == id);
            if (article == null)
            {
                return null;
            }

            article.Title = model.Title;
            article.Text = model.Text;

            _context.Entry(article).State = EntityState.Modified;
            _context.SaveChanges();

            UpdateArticleTags(article, model.Tags);
            return GetArticleViewModel(article);
        }

        private ArticleViewModel GetArticleViewModel(Article article)
        {
            var author = article.Author != null ? article.Author.UserName : "";
            var tags = article.ArticleTags?.Select(tag => tag.Tag.Name).ToList() ?? new List<string>();
            var likes = article.ArticleLikes?.Count ?? 0;
            return new ArticleViewModel
            {
                Id = article.Id,
                AuthorName = author,
                Title = article.Title,
                Text = article.Text,
                Tags = tags,
                LikesCount = likes,
                CreateDate = article.CreateDate,
                Confirmed = article.Confirmed
            };
        }

        private void AddTagsToArticle(int articleId, IEnumerable<string> tags)
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

        private void UpdateArticleTags(Article article, List<string> tags)
        {
            var unusedTags = _context.ArticleTags
                .Where(x => x.ArticleId == article.Id && !tags.Contains(x.Tag.Name))
                .ToList();
            
            _context.ArticleTags.RemoveRange(unusedTags);
            foreach (string tag in tags)
            {
                if (!_context.ArticleTags.Any(x => x.ArticleId == article.Id && x.Tag.Name.Equals(tag)))
                {
                    var tagId = GetTag(tag).Id;
                    _context.ArticleTags.Add(new ArticleTags
                    {
                        TagId = tagId,
                        ArticleId = article.Id
                    });
                }
            }

            _context.SaveChanges();
        }

        public Tag GetTag(string tagName)
        {
            var articleTag = _context.Tags.FirstOrDefault(tag => tag.Name.ToLower().Equals(tagName.ToLower()));
            if (articleTag != null) return articleTag;
            var newTag = new Tag
            {
                Name = tagName
            };
            _context.Tags.Add(newTag);
            _context.SaveChanges();
            return newTag;
        }

        public List<string> GetTags()
        {
            return _context.Tags.Select(tag => tag.Name).ToList();
        }

        public List<PopularTagViewModel> GetPopularTags()
        {
            return _context.Tags.Where(tag => tag.ArticleTags.Any(x => x.Article.Confirmed))
                .Select(tag => new PopularTagViewModel
                {
                    Tag = tag.Name,
                    Count = tag.ArticleTags.Count(x => x.Article.Confirmed)
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

        public void ApproveArticles(string userId)
        {
            _context.Articles.Where(article => article.AuthorId.Equals(userId)).ToList()
                .ForEach(article => article.Confirmed = true);
            _context.SaveChanges();
        }

        public bool IsUserAuthor(int articleId, string userId)
        {
            return _context.Articles.Any(article => article.Id == articleId && article.AuthorId.Equals(userId));
        }

        public int DeleteArticle(int id)
        {
            var article = _context.Articles.FirstOrDefault(a => a.Id == id);
            if (article == null)
            {
                return -1;
            }

            _context.Articles.Remove(article);
            _context.SaveChanges();
            return article.Id;
        }
    }
}