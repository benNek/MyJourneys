using System;
using System.Collections.Generic;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public interface IArticleRepository
    {
        BlogViewModel GetBlog(int id);
        List<BlogViewModel> GetBlogs(int skip, int take);
        List<BlogViewModel> GetBlogsByTag(string tag, int skip, int take);
        void AddBlog(string userId, BlogCreationViewModel model);
        void AddBlogTags(int blogId, List<String> tags);
        ArticleTag GetTag(string tagName);
        List<string> GetTags();
        List<PopularTagViewModel> GetPopularTags();
    }
}