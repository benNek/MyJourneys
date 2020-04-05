using System.Collections.Generic;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public interface IArticleRepository
    {
        ArticleViewModel GetArticle(int id);
        List<ArticleViewModel> GetArticles(int skip, int take);
        List<ArticleViewModel> GetArticlesByTag(string tag, int skip, int take);
        void AddArticle(string userId, ArticleFormViewModel model);
        void AddTagsToArticle(int articleId, List<string> tags);
        Tag GetTag(string tagName);
        List<string> GetTags();
        List<PopularTagViewModel> GetPopularTags();
        void LikeArticle(string userId, int articleId);
        bool HasLiked(string userId, int articleId);
    }
}