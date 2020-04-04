using System;
using System.Collections.Generic;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public interface IArticleRepository
    {
        BlogViewModel GetBlog(int id);
        List<BlogViewModel> GetBlogs();
        void AddBlog(string userId, BlogCreationViewModel model);
        void AddBlogTags(int blogId, List<String> tags);
        ArticleTag GetTag(string tagName);
    }
}