using System.Collections.Generic;
using MyJourneys.Models;
using MyJourneys.Models.Enums;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public interface IArticleRepository
    {
        ArticleViewModel GetArticle(int id);
        List<ArticleViewModel> GetArticles(string tagName, ArticleSortType sortType, string search, int skip, int take);
        List<ArticleViewModel> GetAuthorArticles(string name);
        ArticleViewModel AddArticle(string userId, ArticleFormViewModel model);
        ArticleViewModel UpdateArticle(int id, ArticleFormViewModel model);
        Tag GetTag(string tagName);
        List<string> GetTags();
        List<PopularTagViewModel> GetPopularTags();
        void LikeArticle(string userId, int articleId);
        bool HasLiked(string userId, int articleId);
        void ApproveArticles(string userId);
        bool IsUserAuthor(int articleId, string userId);
        int DeleteArticle(int id);
    }
}