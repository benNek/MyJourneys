using System.Collections.Generic;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public interface IBlogRepository
    {
        List<Blog> GetBlogs();
        void AddBlog(BlogViewModel model);
    }
}